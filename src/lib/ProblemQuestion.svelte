<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { generateAlternatives, getProblemAnswer, type Problem } from "./problemgen";
  import { shuffleArray } from "./shuffle";

  export let problem: Problem = {a: 2, b: 2, op: '+'};

  let lastAnswer: Date = new Date()
  let problemSelected = false;
  let answerTimeout: ReturnType<typeof setTimeout> | undefined;

  function clearAnswerTimeout() {
    if (answerTimeout !== undefined) {
      clearTimeout(answerTimeout)
      answerTimeout = undefined
    }
  }

  onMount(() => {
    lastAnswer = new Date()
  })

  onDestroy(clearAnswerTimeout)

  let successRiffRef: HTMLAudioElement | undefined;
  let failRiffRef: HTMLAudioElement | undefined;

  const dispatch = createEventDispatcher()

  // Parent can swap `problem` mid-feedback (e.g. "Gerar outro problema") without
  // going through handleAnswer. Drop the pending dispatch and reopen answers so
  // the new problem is not stuck selected / timed from the previous one.
  $: {
    problem.a
    problem.b
    problem.op
    clearAnswerTimeout()
    problemSelected = false
    lastAnswer = new Date()
  }

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
      // play() rejects when interrupted or blocked; same pattern as intro music in App.svelte
      if (right) {
        if (successRiffRef) {
          successRiffRef.pause()
          successRiffRef.currentTime = 0
          void successRiffRef.play().catch(() => {})
        }
      } else {
        if (failRiffRef) {
          failRiffRef.pause()
          failRiffRef.currentTime = 0
          void failRiffRef.play().catch(() => {})
        }
      }
      const submissionTime = new Date();
      const elapsed = submissionTime.getTime() - lastAnswer.getTime()
      answerTimeout = setTimeout(() => {
          answerTimeout = undefined
          problemSelected = false
          dispatch('answer', {
            right,
            time: elapsed
          })
          // If the parent keeps the same problem, start a fresh timing window.
          // When it assigns a new one, the reactive reset above wins.
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
