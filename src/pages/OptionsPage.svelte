<script lang='ts'>
  import { handleJump } from "../stores/location";
  import { changeName, usernameStore } from "../lib/user";


    let username: string = '';
    usernameStore.subscribe(u => username = u)

</script>


<svelte:head>
    <title>Opções - MathWars</title>
</svelte:head>

<h1 class="mathwars-text-description">Opções</h1>
<button class="mathwars-button" on:click={changeName}>Alterar seu nome (atual: '{username}')</button>
<button class="mathwars-button" on:click={handleJump("/doomfire")}>Brincar com fogo</button>
<button class="mathwars-button" on:click={handleJump("/play/problemgen")}>Gerar problemas</button>
<button class="mathwars-button" on:click={handleJump("/play/questiongen")}>Questões infinitas</button>
