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