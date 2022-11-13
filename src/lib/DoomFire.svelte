<script lang="ts">
    const pallete = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }].map(color => `rgb(${color.r}, ${color.g}, ${color.b})`)
    console.log(pallete)
    console.log(pallete.length)
    import { onMount } from 'svelte';
    export let tileSize: number = 20; // tamanho de cada item em pixels
    export let intensity: number = 35;
    export let wind: number = -0.05; // % da largura
    export let decay: number = 1.0; // x da altura pra decair tudo
    export let frame_delay: number = 70;
    /* let intensity = 80; */
    export let containerRef;
    let refCanvas;
    let requireRedraw = true;
    let stop = false;
    let resizeTimeout = undefined
    onMount(() => {
        const handleResize = () => {
            const width = containerRef.offsetWidth;
            const height = containerRef.offsetHeight;
            if (resizeTimeout) {
                clearTimeout(resizeTimeout)
            }
            resizeTimeout = setTimeout(() => {
                refCanvas.width = width || 2;
                refCanvas.height = height || 2;
                requireRedraw = true;
            }, 1000)
            console.log("resize")

        }
        const handleWaitElement = () => {
            setTimeout(() => {
                if (!containerRef) {
                    handleWaitElement()
                } else {
                    resizeObserver.observe(containerRef);
                }
            }, 1)
        }
        const resizeObserver = new ResizeObserver(handleResize)
        handleWaitElement()
        return () => {
            resizeObserver.unobserve(containerRef);
            stop = true;
        }
    })
    onMount(() => {
        requestAnimationFrame(handle_render)
        return () => {
            stop = true;
        }
    })
    let fireArray = new Float32Array(0)
    function handle_render() {
        const canvasWidth = containerRef.offsetWidth;
        const canvasHeight = containerRef.offsetHeight;
        const dividerx = Math.floor(canvasWidth / tileSize);
        const dividery = Math.floor(canvasHeight / tileSize);
        const blockDecay = decay / dividery;
        const blockWind = wind / dividerx;
        if (stop) {
            return
        }
        const context = refCanvas.getContext('2d')
        const cellsx = dividerx + 1
        const cellsy = dividery + 1
        console.log("render", 'decay', blockDecay, "cells", cellsx, cellsy)
        if (requireRedraw) {
            clearTimeout(resizeTimeout);
            resizeTimeout = undefined;
            /* context.width = canvasWidth */
            /* context.height = canvasHeight */
            /* refCanvas.width = canvasWidth */
            /* refCanvas.height = canvasHeight */
            const arraySize = cellsx*cellsy;
            console.log("array", arraySize)
            context.fillRect(0, 0, canvasWidth, canvasHeight)
            fireArray = new Float32Array(arraySize) // zerofill
            for (let i = 0; i < cellsx; i++) {
                /* fireArray[ */
                fireArray[(cellsy*cellsx - 1) - i] = intensity;
            }
            requireRedraw=false
        }
        for (let i = (cellsy - 1)* cellsx - 1; i >= 0; i--) {
            const windOffset = Math.random()*blockWind*cellsx;
            const sourceIndex = Math.floor(i + windOffset + cellsx);
            const res = fireArray[sourceIndex] - (Math.random()*blockDecay)
            fireArray[i] = res > 0 ? res : 0;
        }
        /* fireArray[0] = 36 */
        /* fireArray[1] = 36 */
        /* fireArray[cellsx] = 36 */
        /* fireArray[cellsx + 2] = 36 */
        for (let i = 0; i < cellsy; i++) {
        /* for (let i = 0; i < 3; i++) { */
            for (let j = 0; j < cellsx; j++) {
            /* for (let j = 0; j < 3; j++) { */
                const arrIdx = i*cellsx + j
                /* console.log(arrIdx) */
                const colorIdx = Math.round(fireArray[arrIdx])
                /* console.log(colorIdx) */
                const color = pallete[colorIdx]
                /* console.log(colorIdx) */
                if (color) {
                    /* console.log(color) */
                    context.resetTransform()
                    context.fillStyle = color
                    const xi = j*tileSize
                    const yi = i*tileSize
                    const xf = (j+1)*tileSize
                    const yf = (i+1)*tileSize
                    context.fillRect(xi, yi, xf-xi, yf-yi)
                }
            }
        }
        // tick
        setTimeout(() => requestAnimationFrame(handle_render), frame_delay)
    }
</script>

<style>
    .canvasContainer {
        max-height: 100vh;
    }
</style>

<canvas class="canvasContainer" bind:this={refCanvas}/>
