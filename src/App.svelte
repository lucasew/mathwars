<script lang="ts">
    import DoomFire from './lib/DoomFire.svelte'
    import MathwarsLogo from './lib/MathwarsLogo.svelte'
    import locationStore from './stores/location'
    import isUserInteractedStore from './stores/isUserInteracted'
    import doomfireStore from './stores/doomfire';
    import { onMount } from 'svelte';
    import { changeName, idUsuario, usernameStore } from './lib/user';
    import Problemgen from './pages/Problemgen.svelte';
    import Questiongen from './pages/Questiongen.svelte';
    import QuickMatch from './pages/QuickMatch.svelte';

    let username;
    usernameStore.subscribe(u => username = u)

    let doomfireDecay;
    doomfireStore.decay.subscribe((v) => doomfireDecay = v)
    let doomfireWind;
    doomfireStore.wind.subscribe((v) => doomfireWind = v)

    console.log('idUsuario', idUsuario)

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
            <button class="mathwars-button" on:click={handleJump("/play/quick")}>Jogo rápido</button>
            <button class="mathwars-button" on:click={handleJump("/match/setup")}>Customizar partida</button>
            <button class="mathwars-button" on:click={handleJump("/match/track")}>Acompanhar partida</button>
            <button class="mathwars-button" on:click={handleJump("/options")}>Opções</button>
        {:else if currentLocation.pathname === "/options"}
            <h1 class="mathwars-text-description">Opções</h1>
            <button class="mathwars-button" on:click={changeName}>Alterar seu nome (atual: '{username}')</button>
            <button class="mathwars-button" on:click={handleJump("/doomfire")}>Brincar com fogo</button>
            <button class="mathwars-button" on:click={handleJump("/play/problemgen")}>Gerar problemas</button>
            <button class="mathwars-button" on:click={handleJump("/play/questiongen")}>Questões infinitas</button>
        {:else if currentLocation.pathname === '/play/quick'}
            <QuickMatch/>
        {:else if currentLocation.pathname === '/play/problemgen'}
            <Problemgen/>
        {:else if currentLocation.pathname === '/play/questiongen'}
            <Questiongen/>
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
    }

</style>
