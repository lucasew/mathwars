/**
 * Represents a mathematical problem to be solved by the user.
 *
 * Used across the game loop to track the current question and validate answers.
 */
export type Problem = {
    a: number
    op: '+' | '-' | '*' | '/'
    b: number
}

/**
 * Generates a random math problem based on the provided configuration.
 *
 * It enforces that subtractions or additions with a negative `b`
 * are inverted to avoid confusing equations like `5 - -3`.
 *
 * @param options Configuration for the generation, controlling maximum numbers,
 *                probability of negative numbers, and allowed operators.
 * @returns A generated mathematical problem ready to be displayed.
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
 * Evaluates the actual answer of a given math problem.
 *
 * Useful for validating user answers or generating trick alternative answers.
 * Throws an error if the operator is not recognized, funneling invalid states.
 *
 * @param problem The math problem to be calculated.
 * @returns The exact mathematical result.
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
 * Generates a set of multiple-choice alternative answers for a given problem.
 *
 * Mixes different strategies (e.g. changing an operand, varying the result,
 * changing the sign or switching operator) to produce plausible distractors.
 * If strategies fail to find unique values, it falls back to answers from
 * completely random problems to guarantee the requested number of choices.
 *
 * @param problem The base problem to generate alternatives for.
 * @param amount Total number of alternative answers to return.
 * @returns An array of unique, trick/alternative answers.
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