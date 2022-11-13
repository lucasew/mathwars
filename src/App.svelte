<script lang="ts">
    import HomePage from './pages/HomePage.svelte'
    import DoomFire from './lib/DoomFire.svelte'
    let doomfireContainerRef;
</script>

<div class="doomfire-container" bind:this={doomfireContainerRef}>
    <DoomFire containerRef={doomfireContainerRef} decay=2048 wind=2/>
</div>
<HomePage/>
<style>
    .doomfire-container {
        width: 100vw;
        min-height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
    }
</style>
