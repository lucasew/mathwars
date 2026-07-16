<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { generateAlternatives, getProblemAnswer, type Problem } from "./problemgen";
  import { shuffleArray } from "./shuffle";

  export let problem: Problem = {a: 2, b: 2, op: '+'};

  let lastAnswer: Date = new Date()
  onMount(() => {
    lastAnswer = new Date()
  })

  let problemSelected = false;
  let answerTimeout: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    if (answerTimeout !== undefined) {
      clearTimeout(answerTimeout)
      answerTimeout = undefined
    }
  })

  let successRiffRef: HTMLAudioElement | undefined;
  let failRiffRef: HTMLAudioElement | undefined;

  const dispatch = createEventDispatcher()

  $: alternatives = shuffleArray([
      {right: true, answer: getProblemAnswer(problem)},
      ...generateAlternatives(problem).map((alt) => ({
          right: false,
          answer: Number(alt),
      }))
  ]).map((val, idx) => ({
      ...val,
      idx
  }))

  function handleAnswer(right: boolean) {
      // Ignore further clicks during the feedback window so one problem
      // cannot enqueue multiple match answers.
      if (problemSelected) return
      problemSelected = true
      if (right) {
        if (successRiffRef) {
          successRiffRef.pause()
          successRiffRef.currentTime = 0
          void successRiffRef.play()
        }
      } else {
        if (failRiffRef) {
          failRiffRef.pause()
          failRiffRef.currentTime = 0
          void failRiffRef.play()
        }
      }
      const submissionTime = new Date();
      answerTimeout = setTimeout(() => {
          answerTimeout = undefined
          problemSelected = false
          dispatch('answer', {
            right,
            time: submissionTime.getTime() - lastAnswer.getTime()
          })
          lastAnswer = new Date()
      }, 200)

  }
</script>

<audio bind:this={successRiffRef} id="audio-success" src="/bad-to-the-bone.mp3"></audio>
<audio bind:this={failRiffRef} id="audio-fail" src="/bad-for-the-ears.mp3"></audio>

<p class="mathwars-button mathwars-problem-title">
  {problem.a} {problem.op} {problem.b}
</p>

{#each alternatives as alternative}
    <button
        type="button"
        class="mathwars-button {problemSelected
          ? alternative.right
            ? "mathwars-alternative-right"
            : "mathwars-alternative-wrong"
          : ""
        }"
        on:click={() => handleAnswer(alternative.right)}
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
    .mathwars-button {
        width: 60vw;
        margin-right: auto;
        margin-left: auto;
    }
</style>
