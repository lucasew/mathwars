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