<script lang='ts'>
  import { usernameStore } from "../lib/user";
  import { handleJump } from "../stores/location";
</script>
<svelte:head>
    <title>Página Inicial - MathWars</title>
</svelte:head>
<h1 class="mathwars-text-description">Bem vindo/a, {$usernameStore}</h1>
<button class="mathwars-button" on:click={handleJump("/play/quick")}>Jogo rápido</button>
<button class="mathwars-button" on:click={handleJump("/options")}>Opções</button>
