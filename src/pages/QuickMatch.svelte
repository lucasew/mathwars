<script lang="ts">
    import ProblemQuestion from '../lib/ProblemQuestion.svelte';
    import {generateProblem, type Problem} from '../lib/problemgen'
    import { onMount } from 'svelte';
    let playing = false;
    // let playing = true;
    let ops: Set<Problem['op']> = new Set([]);
    let maxNumber: number = 20;
    let opsTxt = '';
    let respostas = []
    $: ops = new Set(opsTxt.split('').filter((item) => "+-/*".includes(item))) as Set<Problem['op']>
    $: opsArg = [...ops].length == 0 ? undefined : ops

    onMount(() => {
        const url = new URL(window.location.href)
        if (url.searchParams.has('maxNumber')) {
            const n = parseInt(url.searchParams.get('maxNumber'))
            if (!isNaN(n)) {
                maxNumber = n
            }
        }
        if (url.searchParams.has('ops')) {
            opsTxt = url.searchParams.get('ops').replace(' ', '+')
        }
    })

    $: console.log(opsArg)
    let problem = nextProblem()

    function nextProblem(): Problem {
        return generateProblem({
            max: maxNumber,
            ops: opsArg
        })
    }

    function handleAnswer(event: CustomEvent<any>) {
        console.log('answer', event.detail)
        respostas.push({pergunta: problem, resposta: event.detail})
        console.log(respostas)
        problem = nextProblem()
    }
</script>

<section>

{#if playing}
    <ProblemQuestion problem={problem} on:answer={handleAnswer}/>
{:else}
<form on:submit={() => playing = true}>
    <h1>Configurações de partida</h1>
    <label for="ops">Operações: (escolhidas: {[...ops]})<br>Eescolha entre +,-,/ e *, vazio = todas</label>
    <input type="text" name="ops" bind:value={opsTxt} />
    <label for="maxNumber">Maior número permitido nas operações: </label>
    <input type="number" name="maxNumber" bind:value={maxNumber}/>
    <input class='mathwars-button' type="submit" value="Inciar partida">
</form>
{/if}

</section>

<style>
    form {
        display: flex;
        flex-direction: column;
    }
    form > * {
        margin: .1rem;
    }
</style>