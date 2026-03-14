import type { Problem } from "./problemgen"

/**
 * Represents a complete multiplayer or single-player game session and its results.
 * Shared over `ntfy.sh` for live scoreboard syncing among participants.
 */
export type Match = {
    /** The display name of the participant submitting these results. */
    name: string
    /** Detailed array logging the user's responses for each presented math problem. */
    plays: Array<{
        /** The generated math problem. */
        pergunta: Problem,
        /** Metrics detailing performance. `right` tracks correctness; `time` measures ms latency to answer. */
        resposta: {
            right: boolean
            time: number
        }
    }>,
    /** The configuration parameters that dictate the match's difficulty and bounds. */
    match: {
        /** The maximum integer value allowable in a math problem expression. */
        maxNumber: number,
        /** Serialized string representation of permitted operators (e.g. "+-*/"). */
        ops: string,
        /** Overall number of discrete problems in the session. */
        plays: number 
    }
}