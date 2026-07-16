<script lang="ts">
    const pallete = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }].map(color => `rgb(${color.r}, ${color.g}, ${color.b})`)
    import { createEventDispatcher, onMount } from 'svelte';
    export let tileSize: number = 20; // tamanho de cada item em pixels
    export let intensity: number = 35;
    export let wind: number = -0.05; // % da largura
    export let decay: number = 1.0; // x da altura pra decair tudo
    export let frame_delay: number = 70;
    /* let intensity = 80; */
    export let containerRef: HTMLDivElement | undefined = undefined;
    let refCanvas: HTMLCanvasElement | undefined;
    let requireRedraw = true;
    let stop = false;
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

    const dispatch = createEventDispatcher()

    let waitElementTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
    let renderTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

    function scheduleNextFrame() {
        if (stop) return;
        if (renderTimeout !== undefined) {
            clearTimeout(renderTimeout);
        }
        renderTimeout = setTimeout(() => {
            renderTimeout = undefined;
            requestAnimationFrame(handle_render);
        }, frame_delay);
    }

    onMount(() => {
        const handleResize = () => {
            if (!containerRef || !refCanvas) return;
            const width = containerRef.offsetWidth;
            const height = containerRef.offsetHeight;
            if (resizeTimeout) {
                clearTimeout(resizeTimeout)
            }
            resizeTimeout = setTimeout(() => {
                resizeTimeout = undefined;
                if (refCanvas) {
                    refCanvas.width = width || 2;
                    refCanvas.height = height || 2;
                }
                requireRedraw = true;
                dispatch('resize', {
                    width,
                    height
                })
            }, 1000)
        }
        const handleWaitElement = () => {
            waitElementTimeout = setTimeout(() => {
                waitElementTimeout = undefined;
                if (!containerRef) {
                    handleWaitElement()
                } else {
                    resizeObserver.observe(containerRef);
                }
            }, 1)
        }
        const resizeObserver = new ResizeObserver(handleResize)
        handleWaitElement()
        requestAnimationFrame(handle_render)
        return () => {
            stop = true;
            if (waitElementTimeout !== undefined) {
                clearTimeout(waitElementTimeout);
                waitElementTimeout = undefined;
            }
            if (resizeTimeout !== undefined) {
                clearTimeout(resizeTimeout);
                resizeTimeout = undefined;
            }
            if (renderTimeout !== undefined) {
                clearTimeout(renderTimeout);
                renderTimeout = undefined;
            }
            resizeObserver.disconnect();
        }
    })
    let fireArray = new Float32Array(0)
    function handle_render() {
        if (stop) {
            return;
        }
        if (!containerRef || !refCanvas) {
            scheduleNextFrame();
            return;
        }
        const canvasWidth = containerRef.offsetWidth;
        const canvasHeight = containerRef.offsetHeight;
        const dividerx = Math.floor(canvasWidth / tileSize);
        const dividery = Math.floor(canvasHeight / tileSize);
        // Viewport smaller than one tile → skip sim (avoids /0 → Infinity/NaN fire cells)
        if (dividerx < 1 || dividery < 1) {
            scheduleNextFrame();
            return;
        }
        const blockDecay = decay / dividery;
        const blockWind = wind / dividerx;
        dispatch('render', {
            canvasWidth,
            canvasHeight,
            dividerx,
            dividery,
            blockDecay,
            blockWind
        })
        const context = refCanvas.getContext('2d')
        if (!context) {
            scheduleNextFrame();
            return;
        }
        const cellsx = dividerx + 1
        const cellsy = dividery + 1
        if (requireRedraw) {
            clearTimeout(resizeTimeout);
            resizeTimeout = undefined;
            const arraySize = cellsx*cellsy;
            context.fillRect(0, 0, canvasWidth, canvasHeight)
            fireArray = new Float32Array(arraySize) // zerofill
            for (let i = 0; i < cellsx; i++) {
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
        for (let i = 0; i < cellsy; i++) {
            for (let j = 0; j < cellsx; j++) {
                const arrIdx = i*cellsx + j
                const colorIdx = Math.round(fireArray[arrIdx])
                const color = pallete[colorIdx]
                if (color) {
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
        scheduleNextFrame()
    }
</script>

<style>
    .canvasContainer {
        max-height: 100vh;
    }
</style>

<canvas class="canvasContainer" bind:this={refCanvas}></canvas>
