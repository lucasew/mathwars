export type Problem = {
    a: number
    op: '+' | '-' | '*' | '/'
    b: number
}

/**
 * Generates a math problem based on the provided configuration.
 *
 * @param options - Configuration for problem generation.
 * @param options.max - Maximum absolute value for operands (1 to max).
 * @param options.negativeProb - Probability (0.0 to 1.0) that an operand will be negative.
 * @param options.ops - Set of allowed operators. Defaults to all basic operators (+, -, *, /).
 * @returns A problem object with operands `a`, `b` and operator `op`.
 *
 * @remarks
 * - For division (`/`), `b` is guaranteed to be a divisor of `a` (or rather, logic ensures integer division).
 * - For subtraction, attempts to keep result positive by flipping sign of `b` if `b < 0`, though this logic is specific.
 */
export function generateProblem(options: {
    max: number,
    negativeProb?: number
    ops?: Set<Problem['op']>
}): Problem {
    let usedOps: Set<Problem['op']> = new Set(['+', '-', '*', '/'])
    if (options.ops && [...options.ops].length > 0) {
        console.log('usando options.ops')
        usedOps = options.ops
    }
    let opsList = [...usedOps]
    // console.log('ops', opsList)

    const op = opsList[Math.floor(Math.random()*opsList.length)]

    let a = 1 + Math.floor(Math.random()*options.max)
    let b = 1 + Math.floor(Math.random()*options.max)
    if (options.negativeProb) {
        if (Math.random() < options.negativeProb) a = -a
        if (Math.random() < options.negativeProb) b = -b
    }
    if (b < 0 && (op === '-' || op === '+')) {
        b *= -1
    }
    return {
        a,
        b,
        op
    }
}

/**
 * Calculates the correct answer for a given problem.
 *
 * @param problem - The problem to solve.
 * @returns The numeric result of the operation.
 * @throws Error if the operator is invalid.
 */
export function getProblemAnswer(problem: Problem) {
    const {op, a, b} = problem
    switch (op) {
        case '*':
            return a * b;
        case '/':
            return a / b;
        case '+':
            return a + b;
        case '-':
            return a - b;
        default:
            throw Error(`op ${op} inválida`);
    }
}

const alternativeStrategies: Array<(problem: Problem)=>number> = [
    ({a, b, op}) => { // variar o a
        const variationPercent = 0.1;
        const newA = Math.round(a * ((1 - variationPercent) + (Math.random()*variationPercent*2)))
        return getProblemAnswer({a: newA, b, op})
    },
    ({a, b, op}) => { // variar o b
        const variationPercent = 0.2;
        const newB = Math.round(b * ((1 - variationPercent) + (Math.random()*variationPercent*2)))
        return getProblemAnswer({a, b: newB, op})
    },
    ({a, b, op}) => { // variar o resultado
        const variationPercent = 0.2;
        const answer = getProblemAnswer({a, b, op})
        return Math.round(answer * ((1 - variationPercent) + (Math.random()*variationPercent*2)))
    },
    ({a, b, op}) => { // inverter o sinal do resultado
        return -getProblemAnswer({a, b, op})
    },
    ({a, b, op}) => { // variar nivel do operador
        let newOp = op
        if (op == '/') newOp = '-'
        if (op == '*') newOp = '+'
        if (op == '+') newOp = '*'
        if (op == '-') newOp = '/'

        return getProblemAnswer({a, b, op: newOp})
    }
]

/**
 * Generates plausible wrong answers (distractors) for a problem.
 *
 * @param problem - The problem to generate alternatives for.
 * @param amount - Target number of alternatives to generate (default: 4).
 * @returns An array of unique alternative answers.
 *
 * @remarks
 * Uses a set of strategies to create "smart" wrong answers (e.g., small variations,
 * wrong operator, sign flip). If these strategies fail to produce enough unique
 * values (capped at 100 attempts), it falls back to generating random answers
 * from completely new random problems (capped at 200 attempts) to fill the quota.
 */
export function generateAlternatives(problem: Problem, amount = 4) {
    const solution = getProblemAnswer(problem)
    let alternatives = new Set()
    let i = 0;
    while (alternatives.size < amount) {
        const strat = alternativeStrategies[Math.floor(Math.random()*alternativeStrategies.length)]
        const variatedAnswer = strat(problem)
        i++
        if (i > 100) break
        if (Math.abs(variatedAnswer - solution) < 0.1) {
            continue
        }
        alternatives.add(variatedAnswer)
        console.log("alternatives")
    }
    while (alternatives.size < amount) {
        i++
        alternatives.add(getProblemAnswer(generateProblem({})))
        console.log("alternativas aleatórias")
        if (i > 200) break
    }
    return [...alternatives]
}