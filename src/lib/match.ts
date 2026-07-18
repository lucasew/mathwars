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

/** Inverse of encodeMatchState. Pass the value from URLSearchParams.get. */
export function decodeMatchState(encoded: string): MatchState {
    const binary = atob(encoded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return JSON.parse(new TextDecoder().decode(bytes)) as MatchState
}