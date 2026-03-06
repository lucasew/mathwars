<script lang="typescript">
    import { onMount } from 'svelte'
    export let progress = 0;
    export let color = 'white';
</script>

<div class="progress-bar" style={`width: ${progress}%; background-color: ${color}`}></div>

<style>
    .progress-bar {
        max-width: 100%;
        height: 100%;
        min-height: 5px;
    }
</style>
