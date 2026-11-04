export type Problem = {
    a: number
    op: '+' | '-' | '*' | '/'
    b: number
}

// Align with QuickMatch / match decode maxNumber ceiling so shared generators
// cannot emit operands past what decode will accept on a finished match.
const MAX_MAX_NUMBER = 999

/**
 * Positive integer in [1, MAX_MAX_NUMBER]. Non-finite or below 1 (empty number
 * inputs, bad callers) would otherwise yield NaN operands via
 * `1 + Math.floor(Math.random() * max)`.
 */
function normalizeMax(value: unknown): number {
    const n = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(n) || n < 1) return 1
    return Math.min(Math.floor(n), MAX_MAX_NUMBER)
}

export function generateProblem(options: {
    max: number,
    negativeProb?: number
    ops?: Set<Problem['op']>
}): Problem {
    const max = normalizeMax(options.max)
    let usedOps: Set<Problem['op']> = new Set(['+', '-', '*', '/'])
    if (options.ops && options.ops.size > 0) {
        usedOps = options.ops
    }
    const opsList = [...usedOps]

    const op = opsList[Math.floor(Math.random() * opsList.length)]

    let a: number
    let b: number
    if (op === '/') {
        // Contas de cabeça: keep both operands in 1..max and force an integer quotient.
        // Pick divisor b, then quotient q so dividend a = b * q stays ≤ max.
        b = 1 + Math.floor(Math.random() * max)
        const maxQuotient = Math.max(1, Math.floor(max / b))
        const q = 1 + Math.floor(Math.random() * maxQuotient)
        a = b * q
    } else {
        a = 1 + Math.floor(Math.random() * max)
        b = 1 + Math.floor(Math.random() * max)
    }

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

export function generateAlternatives(problem: Problem, amount = 4) {
    const solution = getProblemAnswer(problem)
    const alternatives = new Set<number>()
    let i = 0;
    while (alternatives.size < amount) {
        const strat = alternativeStrategies[Math.floor(Math.random()*alternativeStrategies.length)]
        // Mental math: operands/answers are integers; distractors must be whole numbers too
        // (varying a/b for '/' otherwise yields floats like 1.222… on the choices).
        const variatedAnswer = Math.round(strat(problem))
        i++
        if (i > 100) break
        if (!Number.isFinite(variatedAnswer) || variatedAnswer === solution) {
            continue
        }
        alternatives.add(variatedAnswer)
    }
    while (alternatives.size < amount) {
        i++
        const fallback = Math.round(getProblemAnswer(generateProblem({ max: 20 })))
        if (Number.isFinite(fallback) && fallback !== solution) {
            alternatives.add(fallback)
        }
        if (i > 200) break
    }
    return [...alternatives]
}
