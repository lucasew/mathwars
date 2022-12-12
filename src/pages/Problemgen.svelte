<script lang="ts">
import { generateAlternatives, generateProblem, getProblemAnswer, type Problem } from "../lib/problemgen";

function genProblem() {
    return generateProblem({
        max: 20,
        negativeProb: 0.5
    })
}

let problem: Problem = genProblem();


</script>

<svelte:head>
    <title>Gerador de Problemas - MathWars</title>
</svelte:head>

<div class="mathwars-panel">

<h1>Gerador de problemas</h1>

<p>{problem.a} {problem.op} {problem.b}</p>

<p>Resposta: {getProblemAnswer(problem)}</p>

{#each generateAlternatives(problem) as alternative}
    <p>Alternativa: {alternative}</p>
{/each}


<button class="mathwars-button" on:click={() => problem = genProblem()}>Gerar outro problema</button>


</div>

<style>
    .mathwars-panel {
        text-align: center;
    }
</style>