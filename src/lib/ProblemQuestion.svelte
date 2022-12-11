<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { generateAlternatives, getProblemAnswer, type Problem } from "./problemgen";
  import { shuffleArray } from "./shuffle";

  export let problem: Problem = {a: 2, b: 2, op: '+'};

  let problemSelectedStore = writable(false)
  let problemSelected;
  problemSelectedStore.subscribe((d) => problemSelected = d)

  const dispatch = createEventDispatcher()

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
          problemSelectedStore.set(false)
          dispatch('rightAnswer', {})
      }, 200)
  }

  function handleWrongAnswer() {
      problemSelectedStore.set(true)
      setTimeout(() => {
          dispatch('wrongAnswer', {})
          problemSelectedStore.set(false)
      }, 200)
  }
</script>

<p class="mathwars-button mathwars-problem-title">
  {problem.a} {problem.op} {problem.b}
</p>

{#each alternatives as alternative}
    <button
        class="mathwars-button {problemSelected 
          ? alternative.right 
            ? "mathwars-alternative-right"
            : "mathwars-alternative-wrong"
          : ""
        }"
        on:click={alternative.right
          ? handleRightAnswer
          : handleWrongAnswer
        }
    >{alternative.answer}</button>
{/each}

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