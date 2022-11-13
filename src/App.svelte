<script lang="ts">
    import DoomFire from './lib/DoomFire.svelte'
    import MathwarsLogo from './lib/MathwarsLogo.svelte'
    import ProgressBar from './lib/ProgressBar.svelte'
    import locationStore from './stores/location.ts'
    let doomfireContainerRef;
    let musicRef;
    let currentLocation;
    locationStore.subscribe((href) => {
        currentLocation = href
        if (!musicRef) {
            return;
        }
        if (href.pathname === "/home" || href.pathname.startsWith("/match")) {
            musicRef.play()
        } else {
            musicRef.pause()
            musicRef.currentTime = 0
        }
    })
    console.log(currentLocation);
    function handleJump(route: string) {
        return () => history.pushState({}, '', route)
    }
</script>

<div class="doomfire-container" bind:this={doomfireContainerRef} on:click={handleJump("/home")}>
    {#if currentLocation.pathname !== "/" }
        <DoomFire containerRef={doomfireContainerRef} decay=2048 wind=2/>
    {/if}
</div>
<audio bind:this={musicRef} id="audio-intro" src="/intro.m4a" loop />
<main>
    <section class="mathwars-page-section">
        <MathwarsLogo on:click={handleJump("/home")} />
        {#if currentLocation.pathname === "/" }
            <button class="mathwars-button" on:click={handleJump("/home")}>Clique aqui para iniciar</button>
        {:else if currentLocation.pathname === "/home"}
            <button class="mathwars-button" on:click={handleJump("/match/solo")}>Jogar sozinho</button>
            <button class="mathwars-button" on:click={handleJump("/match/multi")}>Jogar em grupo</button>
            <button class="mathwars-button" on:click={handleJump("/match/advanced")}>Avançado</button>
        {/if}
<!--                <div class="progress-bar-container">
<ProgressBar progress="10" />
</div> -->
    </section>
</main>
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
    p {
        color: white;
        text-align: center;
        font: Cursive;
    }
    .progress-bar-container {
        height: 1rem;
        width: 100%;
        border: 1px solid white;
        box-sizing: border-box;
    }
    
    .mathwars-button {
        background-color: white;
        width: 100%;
        border: 0;
        padding: 0.5rem 0;
        margin: 0.2rem 0;
        text-align: center;
        color: inherit;
        text-decoration: none;
        font-size: 1rem;
        vertical-align: middle;
        line-height: normal;
    }
    .mathwars-page-section {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
