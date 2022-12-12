<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { generateAlternatives, getProblemAnswer, type Problem } from "./problemgen";
  import { shuffleArray } from "./shuffle";

  export let problem: Problem = {a: 2, b: 2, op: '+'};

  let lastAnswer: Date = new Date()
  onMount(() => {
    lastAnswer = new Date()
  })

  let problemSelectedStore = writable(false)
  let problemSelected;
  problemSelectedStore.subscribe((d) => problemSelected = d)

  let successRiffRef;
  let failRiffRef;

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

  function handleAnswer(right: boolean) {
      problemSelectedStore.set(true)
      if (right) {
        successRiffRef.pause()
        successRiffRef.currentTime = 0
        successRiffRef.play()
      } else {
        failRiffRef.pause()
        failRiffRef.currentTime = 0
        failRiffRef.play()

      }
      const submissionTime = new Date();
      setTimeout(() => {
          problemSelectedStore.set(false)
          dispatch('answer', {
            right,
            time: submissionTime - lastAnswer
          })
          lastAnswer = new Date()
      }, 200)

  }
</script>

<audio bind:this={successRiffRef} id="audio-success" src="/bad-to-the-bone.mp3" />
<audio bind:this={failRiffRef} id="audio-fail" src="/bad-for-the-ears.mp3" />

<p class="mathwars-button mathwars-problem-title">
  {problem.a} {problem.op} {problem.b}
</p>

{#each alternatives as alternative}
    <p
        class="mathwars-button {problemSelected 
          ? alternative.right 
            ? "mathwars-alternative-right"
            : "mathwars-alternative-wrong"
          : ""
        }"
        on:click={alternative.right
          ? () => handleAnswer(true)
          : () => handleAnswer(false)
        }
    >{alternative.answer}</p>
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
    .mathwars-button {
        width: 60vw;
        margin-right: auto;
        margin-left: auto;
    }
</style>