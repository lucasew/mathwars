import type { Problem } from "./problemgen"

export type Match = {
    name: string
    plays: Array<{
        pergunta: Problem,
        resposta: {
            right: boolean
            time: number
        }
    }>,
    match: {
        maxNumber: number,
        ops: string,
        plays: number 
    }
}

export type MatchState = Record<string, Match>

/**
 * Points for one answered play given the current correct-answer streak.
 * Faster answers score higher; wrong answers (streak 0) score 0.
 * Non-finite or negative times score 0 (corrupt / crafted state).
 * Sub-50ms times are clamped so near-zero ms cannot explode the score.
 */
export function pointsForPlay(timeMs: number, streak: number): number {
    if (streak <= 0) return 0
    if (!Number.isFinite(timeMs) || timeMs < 0) return 0
    // 50ms floor ≈ one frame pair; avoids /0 and absurd sub-ms scores
    const ms = Math.max(timeMs, 50)
    // ~200 * streak at 50ms, ~10 * streak at 1s, ~2 * streak at 5s
    return Math.floor((10000 / ms) * streak)
}

/** Total score for a player's ordered plays (streak resets on wrong answers). */
export function scorePlays(plays: Match['plays']): number {
    let total = 0
    let streak = 0
    for (const play of plays) {
        if (play.resposta.right) {
            streak++
        } else {
            streak = 0
        }
        total += pointsForPlay(play.resposta.time, streak)
    }
    return total
}

/** UTF-8 JSON → standard base64 (not URI-encoded). Safe for accented names. */
export function encodeMatchState(state: MatchState): string {
    const bytes = new TextEncoder().encode(JSON.stringify(state))
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]!)
    }
    return btoa(binary)
}

const PROBLEM_OPS = new Set(["+", "-", "*", "/"])

// Align with QuickMatch form clamps so shared links cannot widen settings.
const MAX_MAX_NUMBER = 999
const MAX_PLAYS = 200
const MAX_PLAYERS = 32
const MAX_NAME_LENGTH = 64
const MAX_OPS_LENGTH = 16
const MAX_PLAYER_ID_LENGTH = 64
/** ~1h per answer; rejects absurd crafted times that inflate totals. */
const MAX_ANSWER_TIME_MS = 3_600_000
/** Base64 budget before atob; full 200-play single-player state is far smaller. */
const MAX_ENCODED_LENGTH = 100_000

function isIntInRange(value: unknown, min: number, max: number): value is number {
    return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max
}

/** Ops field only allows the four generator ops (and empty = all). */
function isValidOpsString(ops: string): boolean {
    if (ops.length > MAX_OPS_LENGTH) {
        return false
    }
    for (let i = 0; i < ops.length; i++) {
        if (!PROBLEM_OPS.has(ops[i]!)) {
            return false
        }
    }
    return true
}

function isProblem(value: unknown): boolean {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false
    }
    const problem = value as Record<string, unknown>
    // Mental math: whole safe integers within the game maxNumber range
    // (problemgen / QuickMatch never emit |operand| > MAX_MAX_NUMBER).
    if (
        typeof problem.a !== "number" ||
        !Number.isSafeInteger(problem.a) ||
        typeof problem.b !== "number" ||
        !Number.isSafeInteger(problem.b) ||
        Math.abs(problem.a) > MAX_MAX_NUMBER ||
        Math.abs(problem.b) > MAX_MAX_NUMBER ||
        typeof problem.op !== "string" ||
        !PROBLEM_OPS.has(problem.op)
    ) {
        return false
    }
    // Crafted share links can claim `/` with b=0 or a non-integer quotient;
    // generator never emits those (see problemgen `/` branch).
    if (problem.op === "/") {
        if (problem.b === 0) {
            return false
        }
        if (problem.a % problem.b !== 0) {
            return false
        }
    }
    return true
}

function isPlay(value: unknown): boolean {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false
    }
    const play = value as Record<string, unknown>
    if (!isProblem(play.pergunta)) {
        return false
    }
    if (play.resposta === null || typeof play.resposta !== "object" || Array.isArray(play.resposta)) {
        return false
    }
    const answer = play.resposta as Record<string, unknown>
    // Reject NaN/±Infinity/negative/huge times so scores stay finite and ungameable
    return (
        typeof answer.right === "boolean" &&
        typeof answer.time === "number" &&
        Number.isFinite(answer.time) &&
        answer.time >= 0 &&
        answer.time <= MAX_ANSWER_TIME_MS
    )
}

function isMatch(value: unknown): value is Match {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false
    }
    const m = value as Record<string, unknown>
    // Reject blank / whitespace-only names (UI trims; crafted links must not blank the board)
    if (
        typeof m.name !== "string" ||
        m.name.length < 1 ||
        m.name.length > MAX_NAME_LENGTH ||
        m.name.trim().length < 1
    ) {
        return false
    }
    // At least one play for a result; cap length to match QuickMatch MAX_PLAYS
    if (!Array.isArray(m.plays) || m.plays.length < 1 || m.plays.length > MAX_PLAYS) {
        return false
    }
    if (!m.plays.every(isPlay)) {
        return false
    }
    if (m.match === null || typeof m.match !== "object" || Array.isArray(m.match)) {
        return false
    }
    const settings = m.match as Record<string, unknown>
    return (
        isIntInRange(settings.maxNumber, 1, MAX_MAX_NUMBER) &&
        typeof settings.ops === "string" &&
        isValidOpsString(settings.ops) &&
        isIntInRange(settings.plays, 1, MAX_PLAYS)
    )
}

/** Inverse of encodeMatchState. Pass the value from URLSearchParams.get. */
export function decodeMatchState(encoded: string): MatchState {
    if (typeof encoded !== "string" || encoded.length === 0 || encoded.length > MAX_ENCODED_LENGTH) {
        throw new Error("Invalid match state: encoded payload size")
    }
    const binary = atob(encoded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes))
    // Reject null / arrays / primitives so callers never Object.entries a non-map
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Invalid match state: expected object map")
    }
    const entries = Object.entries(parsed as Record<string, unknown>)
    if (entries.length < 1 || entries.length > MAX_PLAYERS) {
        throw new Error("Invalid match state: player count")
    }
    const out: MatchState = {}
    for (const [id, entry] of entries) {
        if (id.length < 1 || id.length > MAX_PLAYER_ID_LENGTH || id.trim().length < 1) {
            throw new Error(`Invalid match state for player ${id}`)
        }
        if (!isMatch(entry)) {
            throw new Error(`Invalid match state for player ${id}`)
        }
        out[id] = entry
    }
    return out
}