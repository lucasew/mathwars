import type { Problem } from "./problemgen"

/**
 * Represents a complete game session or match record.
 */
export type Match = {
    /** The player's name. */
    name: string
    /** The history of questions and answers in this match. */
    plays: Array<{
        /** The math problem presented. */
        pergunta: Problem,
        /** The user's response details. */
        resposta: {
            /** True if the user answered correctly. */
            right: boolean
            /** Time taken to answer (milliseconds). */
            time: number
        }
    }>,
    /** Configuration and summary of the match. */
    match: {
        /** Maximum operand value used. */
        maxNumber: number,
        /** String of allowed operators (e.g., "+-*"). */
        ops: string,
        /** Total number of plays/questions. */
        plays: number 
    }
}