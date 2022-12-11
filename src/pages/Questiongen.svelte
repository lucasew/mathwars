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

<div>

<ProblemQuestion
    problem={problem}
    on:rightAnswer={() => problem = genProblem()}
    on:wrongAnswer={() => problem = genProblem()}
/>

<button class="mathwars-button" on:click={() => problem = genProblem()}>Gerar outro problema</button>


</div>
