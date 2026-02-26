import { reportError } from "../error";

export type Problem = {
    a: number
    op: '+' | '-' | '*' | '/'
    b: number
}

const DEFAULT_OPS: Set<Problem['op']> = new Set(['+', '-', '*', '/']);
const MAX_PROBLEM_ATTEMPTS = 100;
const MAX_RANDOM_ATTEMPTS = 200;
const VARIATION_PERCENT = 0.1;
const VARIATION_PERCENT_B = 0.2;
const VARIATION_PERCENT_RESULT = 0.2;

export function generateProblem(options: {
    max: number,
    negativeProb?: number
    ops?: Set<Problem['op']>
}): Problem {
    let usedOps: Set<Problem['op']> = DEFAULT_OPS;
    if (options.ops && [...options.ops].length > 0) {
        usedOps = options.ops;
    }
    const opsList = [...usedOps];

    const op = opsList[Math.floor(Math.random() * opsList.length)];

    let a = 1 + Math.floor(Math.random() * options.max);
    let b = 1 + Math.floor(Math.random() * options.max);
    if (options.negativeProb) {
        if (Math.random() < options.negativeProb) a = -a;
        if (Math.random() < options.negativeProb) b = -b;
    }
    if (b < 0 && (op === '-' || op === '+')) {
        b *= -1;
    }
    return {
        a,
        b,
        op
    };
}

export function getProblemAnswer(problem: Problem) {
    const { op, a, b } = problem;
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
            const e = new Error(`op ${op} inválida`);
            reportError(e, "getProblemAnswer");
            throw e;
    }
}

const alternativeStrategies: Array<(problem: Problem) => number> = [
    function varyA({ a, b, op }: Problem) {
        const newA = Math.round(a * ((1 - VARIATION_PERCENT) + (Math.random() * VARIATION_PERCENT * 2)));
        return getProblemAnswer({ a: newA, b, op });
    },
    function varyB({ a, b, op }: Problem) {
        const newB = Math.round(b * ((1 - VARIATION_PERCENT_B) + (Math.random() * VARIATION_PERCENT_B * 2)));
        return getProblemAnswer({ a, b: newB, op });
    },
    function varyResult({ a, b, op }: Problem) {
        const answer = getProblemAnswer({ a, b, op });
        return Math.round(answer * ((1 - VARIATION_PERCENT_RESULT) + (Math.random() * VARIATION_PERCENT_RESULT * 2)));
    },
    function invertResult({ a, b, op }: Problem) {
        return -getProblemAnswer({ a, b, op });
    },
    function varyOp({ a, b, op }: Problem) {
        let newOp = op;
        if (op === '/') newOp = '-';
        if (op === '*') newOp = '+';
        if (op === '+') newOp = '*';
        if (op === '-') newOp = '/';

        return getProblemAnswer({ a, b, op: newOp });
    }
];

export function generateAlternatives(problem: Problem, amount = 4) {
    const solution = getProblemAnswer(problem);
    const alternatives = new Set<number>();
    let i = 0;
    while (alternatives.size < amount) {
        const strat = alternativeStrategies[Math.floor(Math.random() * alternativeStrategies.length)];
        const variatedAnswer = strat(problem);
        i++;
        if (i > MAX_PROBLEM_ATTEMPTS) break;
        if (Math.abs(variatedAnswer - solution) < 0.1) {
            continue;
        }
        alternatives.add(variatedAnswer);
    }
    while (alternatives.size < amount) {
        i++;
        alternatives.add(getProblemAnswer(generateProblem({ max: 20 })));
        if (i > MAX_RANDOM_ATTEMPTS) break;
    }
    return [...alternatives];
}
