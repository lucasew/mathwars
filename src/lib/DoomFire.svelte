<script lang="ts">
    const pallete = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }].map(color => `rgb(${color.r}, ${color.g}, ${color.b})`)
    console.log(pallete)
    console.log(pallete.length)
    import { onMount } from 'svelte';
    export let dividerx: number = 64;
    export let dividery: number = 64;
    export let intensity: number = 35;
    export let wind: number = 0.01;
    export let decay: number = 4;
    export let frame_delay: number = 70;
    let canvasWidth;
    let canvasHeight;
    /* let intensity = 80; */
    let refCanvasContainer;
    let refCanvas;
    let requireRedraw = true;
    let stop = false;
    onMount(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries.at(0);
            const { width, height } = entry.contentRect;
            console.log(entry.contentRect)
            canvasWidth = width;
            canvasHeight = height;
        })
        resizeObserver.observe(refCanvasContainer);
        return () => {
            resizeObserver.unobserve(refCanvasContainer);
            stop = true;
        }
    })
    onMount(() => {
        requestAnimationFrame(handle_render)
        return () => {
            stop = true;
        }
    })
    let fireArray = new Uint8Array(0)
    function handle_render() {
        if (stop) {
            return
        }
        console.log("render")
        const context = refCanvas.getContext('2d')
        const gridWidth = Math.floor(canvasWidth/dividerx)
        const gridHeight = Math.floor(canvasHeight/dividery)
        const cellsx = dividerx + 1
        const cellsy = dividerx + 1
        if (requireRedraw) {
            /* context.width = canvasWidth */
            /* context.height = canvasHeight */
            /* refCanvas.width = canvasWidth */
            /* refCanvas.height = canvasHeight */
            const arraySize = cellsx*cellsy;
            console.log("array", arraySize)
            context.fillRect(0, 0, canvasWidth, canvasHeight)
            fireArray = new Uint8Array(arraySize) // zerofill
            for (let i = 0; i < cellsx; i++) {
                /* fireArray[ */
                fireArray[(cellsy*cellsx - 1) - i] = intensity;
            }
            requireRedraw=false
        }
        for (let i = (cellsy - 1)* cellsx - 1; i >= 0; i--) {
            const windOffset = Math.round(Math.random()*wind*cellsx);
            const sourceIndex = i + windOffset + cellsx;
            /* const sourceIndex = (i - (Math.round(gridWidth * wind*Math.random()))) % gridWidth; */
            const res = Math.round(fireArray[sourceIndex] - (Math.random()*decay))
            fireArray[i] = res > 0 ? res : 0;
        }
        /* fireArray[0] = 36 */
        /* fireArray[1] = 36 */
        /* fireArray[cellsx] = 36 */
        /* fireArray[cellsx + 2] = 36 */
        for (let i = 0; i < cellsx; i++) {
        /* for (let i = 0; i < 3; i++) { */
            for (let j = 0; j < cellsy; j++) {
            /* for (let j = 0; j < 3; j++) { */
                const arrIdx = i*cellsx + j
                /* console.log(arrIdx) */
                const colorIdx = fireArray[arrIdx]
                const color = pallete[colorIdx]
                /* console.log(colorIdx) */
                if (color) {
                    /* console.log(color) */
                    context.resetTransform()
                    context.fillStyle = color
                    const xi = j*gridWidth
                    const yi = i*gridHeight
                    const xf = (j+1)*gridWidth
                    const yf = (i+1)*gridHeight
                    context.fillRect(xi, yi, xf-xi, yf-yi)
                }
            }
        }
        context.fillRect(0, canvasHeight, canvasWidth, -gridHeight)
        // tick
        setTimeout(() => requestAnimationFrame(handle_render), frame_delay)
    }
    /* $: console.log(canvasWidth, canvasHeight) */
    $: requestAnimationFrame(() => {
        refCanvas.width = canvasWidth || 1;
        refCanvas.height = canvasHeight || 1;
        requireRedraw = true;
        console.log("resize")
        // redraw
    })
    /* }) */
</script>

<style>
    #canvasContainer {
        width: 100%;
        height: 100%;
        max-height: 100vh;
    }
</style>

<div id="canvasContainer" bind:this={refCanvasContainer}>
    <canvas id="canvasContainer" bind:this={refCanvas}/>
</div>
