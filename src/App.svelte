<script lang="ts">
    import DoomFire from './lib/DoomFire.svelte'
    import MathwarsLogo from './lib/MathwarsLogo.svelte'
    import locationStore, { handleJump } from './stores/location'
    import isUserInteractedStore from './stores/isUserInteracted'
    import doomfireStore from './stores/doomfire';
    import { idUsuario, usernameStore } from './lib/user';
    import Problemgen from './pages/Problemgen.svelte';
    import Questiongen from './pages/Questiongen.svelte';
    import QuickMatch from './pages/QuickMatch.svelte';
    import PlayStatsPage from './pages/PlayStatsPage.svelte';
    import DoomfireControl from './pages/DoomfireControl.svelte';
    import OptionsPage from './pages/OptionsPage.svelte';
    import MainPage from './pages/MainPage.svelte';

    console.log('idUsuario', idUsuario)

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
    
    function handleMusicStateChange() {
        if (!musicRef) {
            return;
        }
        if (isUserInteracted) {
            if (currentLocation.pathname.startsWith("/play")) {
                let i = 0
                const interval = setInterval(() => {
                    if (i >= 100) {
                        clearInterval(interval)
                        musicRef.pause()
                        musicRef.currentTime = 0
                    }
                    if (musicRef) {
                        musicRef.volume = (100 - i)*0.01
                        i++
                    }

                }, 10)
            } else {
                musicRef.volume = 1
                musicRef.play()
            }
        }
    }
    function handleUserInteraction() {
        $isUserInteractedStore = true
    }
    function noop() {}
</script>

<svelte:head>
    <title>Página inicial - MathWars</title>
    <link rel="prefetch" href="/intro.m4a" />
    <link rel="prefetch" href="/bad-to-the-bone.mp3" />
    <link rel="prefetch" href="/bad-for-the-ears.mp3" />
</svelte:head>

<div class="doomfire-container" bind:this={doomfireContainerRef} on:click={handleJump("/")} on:keypress={noop}>
    <!-- {#if isUserInteracted } -->
        <DoomFire
            on:render={() => console.log('doomfire render')}
            on:resize={() => console.log('doomfire resize')}
            containerRef={doomfireContainerRef}
            decay={doomfireDecay}
            wind={doomfireWind}
        />
    <!-- {/if} -->
</div>
<audio bind:this={musicRef} id="audio-intro" src="/intro.m4a" loop />
<main on:click={handleUserInteraction} on:tap={handleUserInteraction} on:keypress={noop}>
    <section class="mathwars-page-section">
        <MathwarsLogo on:click={handleJump("/")} />
        {#if !isUserInteracted}
            <p class="mathwars-text-description">Clique em algum lugar para iniciar</p>
        {:else if currentLocation.pathname === "/"}
            <MainPage/>
        {:else if currentLocation.pathname === "/options"}
            <OptionsPage/>
        {:else if currentLocation.pathname === '/play/quick'}
            <QuickMatch/>
        {:else if currentLocation.pathname === '/play/problemgen'}
            <Problemgen/>
        {:else if currentLocation.pathname === '/play/stats'}
            <PlayStatsPage/>
        {:else if currentLocation.pathname === '/play/questiongen'}
            <Questiongen/>
        {:else if currentLocation.pathname === "/doomfire"}
            <DoomfireControl />
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
