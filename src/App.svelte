<script lang="ts">
    import { onDestroy } from 'svelte'
    import DoomFire from './lib/DoomFire.svelte'
    import MathwarsLogo from './lib/MathwarsLogo.svelte'
    import locationStore, { handleJump } from './stores/location'
    import isUserInteractedStore from './stores/isUserInteracted'
    import { decay, wind } from './stores/doomfire';
    import Problemgen from './pages/Problemgen.svelte';
    import Questiongen from './pages/Questiongen.svelte';
    import QuickMatch from './pages/QuickMatch.svelte';
    import PlayStatsPage from './pages/PlayStatsPage.svelte';
    import DoomfireControl from './pages/DoomfireControl.svelte';
    import OptionsPage from './pages/OptionsPage.svelte';
    import MainPage from './pages/MainPage.svelte';

    let doomfireContainerRef: HTMLDivElement | undefined;
    let musicRef: HTMLAudioElement | undefined;
    let musicFadeInterval: ReturnType<typeof setInterval> | undefined;

    function clearMusicFade() {
        if (musicFadeInterval !== undefined) {
            clearInterval(musicFadeInterval)
            musicFadeInterval = undefined
        }
    }

    onDestroy(clearMusicFade)

    $: {
        $locationStore;
        $isUserInteractedStore;
        handleMusicStateChange();
    }

    function handleMusicStateChange() {
        if (!musicRef) {
            return;
        }
        // Always cancel a previous fade so reactive re-runs cannot stack intervals.
        clearMusicFade()
        if ($isUserInteractedStore) {
            if ($locationStore.pathname.startsWith("/play")) {
                let i = 0
                musicFadeInterval = setInterval(() => {
                    if (!musicRef) {
                        clearMusicFade()
                        return
                    }
                    if (i >= 100) {
                        clearMusicFade()
                        musicRef.pause()
                        musicRef.currentTime = 0
                        return
                    }
                    musicRef.volume = (100 - i) * 0.01
                    i++
                }, 10)
            } else {
                musicRef.volume = 1
                // play() rejects when interrupted or blocked; do not surface unhandled rejections
                void musicRef.play().catch(() => {})
            }
        }
    }
    function handleUserInteraction() {
        if ($isUserInteractedStore) return
        $isUserInteractedStore = true
    }
</script>

<svelte:head>
    <title>Página inicial - MathWars</title>
    <link rel="prefetch" href="/intro.m4a" />
    <link rel="prefetch" href="/bad-to-the-bone.mp3" />
    <link rel="prefetch" href="/bad-for-the-ears.mp3" />
</svelte:head>

<!-- First gesture unlocks audio for keyboard and pointer users (not a static click trap). -->
<svelte:window on:pointerdown={handleUserInteraction} on:keydown={handleUserInteraction} />

<!-- Decorative background only (z-index: -1); home navigation is the logo button. -->
<div class="doomfire-container" bind:this={doomfireContainerRef}>
    <DoomFire
        containerRef={doomfireContainerRef}
        decay={$decay}
        wind={$wind}
    />
</div>
<audio bind:this={musicRef} id="audio-intro" src="/intro.m4a" loop></audio>
<main>
    <section class="mathwars-page-section">
        <MathwarsLogo on:click={handleJump("/")} />
        {#if !$isUserInteractedStore}
            <p class="mathwars-text-description">Clique ou pressione uma tecla para iniciar</p>
        {:else if $locationStore.pathname === "/"}
            <MainPage/>
        {:else if $locationStore.pathname === "/options"}
            <OptionsPage/>
        {:else if $locationStore.pathname === '/play/quick'}
            <QuickMatch/>
        {:else if $locationStore.pathname === '/play/problemgen'}
            <Problemgen/>
        {:else if $locationStore.pathname === '/play/stats'}
            <PlayStatsPage/>
        {:else if $locationStore.pathname === '/play/questiongen'}
            <Questiongen/>
        {:else if $locationStore.pathname === "/doomfire"}
            <DoomfireControl />
        {:else}
            <p class="mathwars-text-description">* Rota não encontrada *</p>
        {/if}

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
</style>
