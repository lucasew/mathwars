<script lang="ts">
    import { finiteNumberOr } from '../lib/finiteNumber';
    import { decay, wind } from '../stores/doomfire';

    /** Defaults match src/stores/doomfire.ts */
    const DEFAULT_WIND = 1.5
    const DEFAULT_DECAY = 256
    /** Wide enough for the toy page; keeps the fire sim finite. */
    const MAX_ABS_WIND = 50
    const MAX_DECAY = 10_000

    /**
     * Number inputs can push empty/cleared values (null/NaN) into the stores
     * that drive the live DoomFire background. Non-finite wind/decay yields
     * NaN cell updates; huge magnitudes thrash the sim.
     */
    function normalizeWind(value: unknown): number {
        const n = finiteNumberOr(value, DEFAULT_WIND)
        return Math.min(MAX_ABS_WIND, Math.max(-MAX_ABS_WIND, n))
    }

    function normalizeDecay(value: unknown): number {
        const n = finiteNumberOr(value, DEFAULT_DECAY)
        if (n < 0) return DEFAULT_DECAY
        return Math.min(MAX_DECAY, n)
    }

    /** Live-update while the value is finite; leave store alone mid-edit when empty. */
    function onWindInput(e: Event) {
        const el = e.currentTarget as HTMLInputElement
        if (el.value === '' || el.value === '-') return
        wind.set(normalizeWind(el.valueAsNumber))
    }

    function onDecayInput(e: Event) {
        const el = e.currentTarget as HTMLInputElement
        if (el.value === '') return
        decay.set(normalizeDecay(el.valueAsNumber))
    }

    /** Commit: empty/invalid field snaps back to a finite store value. */
    function onWindChange(e: Event) {
        const el = e.currentTarget as HTMLInputElement
        const next = normalizeWind(el.valueAsNumber)
        wind.set(next)
        el.value = String(next)
    }

    function onDecayChange(e: Event) {
        const el = e.currentTarget as HTMLInputElement
        const next = normalizeDecay(el.valueAsNumber)
        decay.set(next)
        el.value = String(next)
    }
</script>

<svelte:head>
    <title>Domínio do fogo - MathWars</title>
</svelte:head>
<section class="doomfire-control">
    <div>
        <p>Vento: </p>
        <input
            type="number"
            step="0.1"
            value={$wind}
            on:input={onWindInput}
            on:change={onWindChange}
        >
    </div>
    <div>
        <p>Decaimento: </p>
        <input
            type="number"
            min="0"
            value={$decay}
            on:input={onDecayInput}
            on:change={onDecayChange}
        >
    </div>
</section>


<style>
    .doomfire-control {
        position: absolute;
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
