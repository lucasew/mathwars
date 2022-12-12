export type Problem = {
    a: number
    op: '+' | '-' | '*' | '/'
    b: number
}

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