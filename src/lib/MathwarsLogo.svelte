<button type="button" class="mathwars-logo-button" on:click>
  <img class="mathwars-logo" src="/mathwars.png" alt="MathWars" />
</button>

<svelte:head>
  <link rel="prefetch" href="/mathwars.png" />
</svelte:head>

<style>
  .mathwars-logo-button {
    background: none;
    border: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: block;
    line-height: 0;
  }

  .mathwars-logo {
    max-width: 80vw;
    display: block;
  }
</style>
