<script lang="ts">
import { shuffleArray } from "../lib/shuffle";
import { generateAlternatives, generateProblem, getProblemAnswer, type Problem } from "../lib/problemgen";
  import { writable } from "svelte/store";

let problemSelectedStore = writable(false)
let problemSelected;
problemSelectedStore.subscribe((d) => problemSelected = d)

function genProblem() {
    return generateProblem({
        max: 20,
        negativeProb: 0.5
    })
}

let problem: Problem = genProblem();

$: alternatives = shuffleArray([
    {right: true, answer: getProblemAnswer(problem)}, 
    ...(generateAlternatives(problem).map(alt => {
        return {
            right: false,
            answer: alt
        }
    }))
]).map((val, idx) => {
    return {
        ...val,
        idx
    }
})

function handleRightAnswer() {
    problemSelectedStore.set(true)
    setTimeout(() => {
        problem = genProblem()
        problemSelectedStore.set(false)
    }, 200)
}

function handleWrongAnswer() {
    problemSelectedStore.set(true)
    setTimeout(() => {
        problem = genProblem()
        problemSelectedStore.set(false)
    }, 200)
}

</script>

<!-- <div class="mathwars-panel"> -->

<!-- <h1>Gerador de problemas</h1> -->
<div>

<p class="mathwars-button mathwars-problem-title">{problem.a} {problem.op} {problem.b}</p>

{#each alternatives as alternative}
    <button
        class="mathwars-button {problemSelected ? alternative.right ? "mathwars-alternative-right" : "mathwars-alternative-wrong" : ""}"
        on:click={alternative.right ? handleRightAnswer : handleWrongAnswer}
    >{alternative.answer}</button>
{/each}


<button class="mathwars-button" on:click={() => problem = genProblem()}>Gerar outro problema</button>


</div>

<style>
    .mathwars-problem-title {
        background-color: gray;
    }
    .mathwars-alternative-right {
        background-color: green;
    }
    .mathwars-alternative-wrong {
        background-color: red;
    }
</style>