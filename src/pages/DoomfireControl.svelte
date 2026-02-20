<script lang="ts">
    import doomfireStore from '../stores/doomfire';
    let doomfireDecay: number = 256;
    doomfireStore.decay.subscribe((v) => doomfireDecay = v)
    let doomfireWind: number = 1.5;
    doomfireStore.wind.subscribe((v) => doomfireWind = v)
    $: doomfireStore.decay.set(doomfireDecay)
    $: doomfireStore.wind.set(doomfireWind)
</script>

<svelte:head>
    <title>Domínio do fogo - MathWars</title>
</svelte:head>
<section class="doomfire-control">
    <div>
        <p>Vento: </p>
        <input type='number' step="0.1" bind:value={doomfireWind}>
    </div>
    <div>
        <p>Decaimento: </p>
        <input type="number" bind:value={doomfireDecay}>
    </div>
</section>


<style>
    .doomfire-control {
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 2vh;
        opacity: .3;
        width: 100vw;
    }

    .doomfire-control div {
        max-width: 50vw;
        background-color: white;
    }

    .doomfire-control div input {
        text-align: center;
        max-width: 49vw;
        padding: 0;
    }

    .doomfire-control div p {
        text-align: center;
        margin: 0;
        color: black;
    }
    .doomfire-control:hover {
        opacity: 1;
    }


</style>