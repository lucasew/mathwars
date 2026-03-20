import type { Problem } from "./problemgen"

/**
 * Represents the full state and history of a played match.
 *
 * This object is typically encoded in base64 within the query string to
 * share the final statistics (PlayStatsPage) without needing backend storage.
 * It contains the overall match settings and the user's responses for each round.
 */
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