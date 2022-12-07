<script lang="ts">
    import DoomFire from './lib/DoomFire.svelte'
    import MathwarsLogo from './lib/MathwarsLogo.svelte'
    import locationStore from './stores/location'
    import isUserInteractedStore from './stores/isUserInteracted'
    import doomfireStore from './stores/doomfire';
    let doomfireDecay;
    doomfireStore.decay.subscribe((v) => doomfireDecay = v)
    let doomfireWind;
    doomfireStore.wind.subscribe((v) => doomfireWind = v)


    let doomfireContainerRef;
    let musicRef;

    let currentLocation;
    locationStore.subscribe(href => {currentLocation = href; handleMusicStateChange()})

    let isUserInteracted = false;
    isUserInteractedStore.subscribe((v) => {isUserInteracted = v; handleMusicStateChange()})

    console.log(currentLocation);
    function handleJump(route: string) {
        return () => history.pushState({}, '', route)
    }
    function handleMusicStateChange() {
        if (!musicRef) {
            return;
        }
        if (isUserInteracted) {
            if (currentLocation.pathname.startsWith("/play")) {
                musicRef.pause()
                musicRef.currentTime = 0
            } else {
                musicRef.play()
            }
        }
    }
    function handleUserInteraction() {
        $isUserInteractedStore = true
    }
    function noop() {}
</script>

<div class="doomfire-container" bind:this={doomfireContainerRef} on:click={handleJump("/")} on:keypress={noop}>
    {#if isUserInteracted }
        <DoomFire containerRef={doomfireContainerRef} decay={doomfireDecay} wind={doomfireWind} />
    {/if}
</div>
<audio bind:this={musicRef} id="audio-intro" src="/intro.m4a" loop />
<main on:click={handleUserInteraction} on:tap={handleUserInteraction} on:keypress={noop}>
    <section class="mathwars-page-section">
        {#if !isUserInteracted}
            <MathwarsLogo on:click={handleJump("/")} />
            <p class="mathwars-text-description">Clique em algum lugar para iniciar</p>
        {:else if currentLocation.pathname === "/"}
            <MathwarsLogo on:click={handleJump("/")} />
            <button class="mathwars-button" on:click={handleJump("/match/solo")}>Jogar sozinho</button>
            <button class="mathwars-button" on:click={handleJump("/match/multi")}>Jogar em grupo</button>
            <button class="mathwars-button" on:click={handleJump("/match/advanced")}>Avançado</button>
        {:else if currentLocation.pathname === "/doomfire"}
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
        {:else}
            <MathwarsLogo on:click={handleJump("/")} />
            <p class="mathwars-text-description">* Rota não encontrada *</p>
        {/if}

    </section>
</main>
<!--
<div class="progress-bar-container">
    <ProgressBar progress={10} />
</div>
-->
<style>
    .doomfire-container {
        width: 100vw;
        min-height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        background-color: black;
    }
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }
    .progress-bar-container {
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
    }

    .doomfire-control {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        opacity: .3;
    }

    .doomfire-control div {
        max-width: 50vw;
    }

    .doomfire-control div input {
        text-align: center;
        max-width: 49vw;
        padding: 0;
    }

    .doomfire-control div p {
        text-align: center;
        margin: 0;
    }

</style>
