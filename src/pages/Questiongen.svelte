<script lang="ts">
  import { shuffleArray } from "../lib/shuffle";
import { generateAlternatives, generateProblem, getProblemAnswer, type Problem } from "../lib/problemgen";

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
])

function handleRightAnswer() {
    alert("Acertou")
    problem = genProblem()
}

function handleWrongAnswer() {
    alert("Errou")
    problem = genProblem()
}

</script>

<div class="mathwars-panel">

<h1>Gerador de problemas</h1>

<p>{problem.a} {problem.op} {problem.b}</p>

{#each alternatives as alternative}
    {#if alternative.right}
        <button class="mathwars-button" on:click={handleRightAnswer}>{alternative.answer}</button>
    {:else}
        <button class="mathwars-button" on:click={handleWrongAnswer}>{alternative.answer}</button>
    {/if}
{/each}


<button class="mathwars-button" on:click={() => problem = genProblem()}>Gerar outro problema</button>


</div>

<style>
    .mathwars-panel {
        text-align: center;
    }
</style>