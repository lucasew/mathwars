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
 * Time is clamped so zero/near-zero ms cannot explode the score.
 */
export function pointsForPlay(timeMs: number, streak: number): number {
    if (streak <= 0) return 0
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

function isPlay(value: unknown): boolean {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false
    }
    const play = value as Record<string, unknown>
    if (play.resposta === null || typeof play.resposta !== "object" || Array.isArray(play.resposta)) {
        return false
    }
    const answer = play.resposta as Record<string, unknown>
    return typeof answer.right === "boolean" && typeof answer.time === "number"
}

function isMatch(value: unknown): value is Match {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false
    }
    const m = value as Record<string, unknown>
    if (typeof m.name !== "string") return false
    if (!Array.isArray(m.plays) || !m.plays.every(isPlay)) return false
    if (m.match === null || typeof m.match !== "object" || Array.isArray(m.match)) {
        return false
    }
    const settings = m.match as Record<string, unknown>
    return (
        typeof settings.maxNumber === "number" &&
        typeof settings.ops === "string" &&
        typeof settings.plays === "number"
    )
}

/** Inverse of encodeMatchState. Pass the value from URLSearchParams.get. */
export function decodeMatchState(encoded: string): MatchState {
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
    const out: MatchState = {}
    for (const [id, entry] of Object.entries(parsed as Record<string, unknown>)) {
        if (!isMatch(entry)) {
            throw new Error(`Invalid match state for player ${id}`)
        }
        out[id] = entry
    }
    return out
}