<script lang="ts">
    import DoomFire from './lib/DoomFire.svelte'
    import MathwarsLogo from './lib/MathwarsLogo.svelte'
    import ProgressBar from './lib/ProgressBar.svelte'
    import locationStore from './stores/location'
    import isUserInteractedStore from './stores/isUserInteracted'
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
    {#if currentLocation.pathname !== "/" }
        <DoomFire containerRef={doomfireContainerRef} decay={2048} wind={2} />
    {/if}
</div>
<audio bind:this={musicRef} id="audio-intro" src="/intro.m4a" loop />
<main on:click={handleUserInteraction} on:keypress={noop}>
    <section class="mathwars-page-section">
        <MathwarsLogo on:click={handleJump("/")} />
        {#if !isUserInteracted}
            <p class="mathwars-text-description">Clique em algum lugar para iniciar</p>
        {:else if currentLocation.pathname === "/"}
            <button class="mathwars-button" on:click={handleJump("/match/solo")}>Jogar sozinho</button>
            <button class="mathwars-button" on:click={handleJump("/match/multi")}>Jogar em grupo</button>
            <button class="mathwars-button" on:click={handleJump("/match/advanced")}>Avançado</button>
        {:else}
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
</style>
