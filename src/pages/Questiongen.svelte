<script lang="ts">
import { generateProblem, type Problem } from "../lib/problemgen";
import ProblemQuestion from "../lib/ProblemQuestion.svelte";

function genProblem() {
    return generateProblem({
        max: 20,
        negativeProb: 0.5
    })
}

let problem: Problem = genProblem();

</script>

<svelte:head>
    <title>Questionário infinito de teste - MathWars</title>
</svelte:head>

<div>
<ProblemQuestion
    problem={problem}
    on:answer={() => problem = genProblem()}
/>

<button class="mathwars-button" on:click={() => problem = genProblem()}>Gerar outro problema</button>


</div>
