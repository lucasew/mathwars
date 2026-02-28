<script lang="ts">
    import ProblemQuestion from '../lib/ProblemQuestion.svelte';
    import {generateProblem, type Problem} from '../lib/problemgen'
    import { onMount } from 'svelte';
    import { idUsuario, usernameStore } from '../lib/user';
    import { handleJump } from '../stores/location';
    import type { Match } from 'src/lib/match';
    let playing = false;
    let ops: Set<Problem['op']> = new Set([]);
    let maxNumber: number = 20;
    let opsTxt = '';
    let respostas: Match['plays'] = []
    let jogadas = 10;
    $: ops = new Set(opsTxt.split('').filter((item) => "+-/*".includes(item))) as Set<Problem['op']>
    $: opsArg = [...ops].length == 0 ? undefined : ops

    onMount(() => {
        const url = new URL(window.location.href)
        if (url.searchParams.has('maxNumber')) {
            const val = url.searchParams.get('maxNumber');
            if (val) {
                const n = parseInt(val)
                if (!isNaN(n)) {
                    maxNumber = n
                }
            }
        }
        if (url.searchParams.has('ops')) {
            const val = url.searchParams.get('ops');
            if (val) {
                opsTxt = val.replace(' ', '+')
            }
        }
        if (url.searchParams.has('plays')) {
            const val = url.searchParams.get('plays');
            if (val) {
                const n = parseInt(val)
                if (!isNaN(n)) {
                    jogadas = n
                }
            }
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
        console.log(respostas.length)
        if (respostas.length >= jogadas) {
            console.log('mais respostas que jogadas')
            const id = idUsuario as string;
            const name = $usernameStore;
            const result: Record<string, Match> = {
                [id]: {
                    name,
                    plays: respostas,
                    match: {
                        maxNumber,
                        ops: opsTxt,
                        plays: jogadas
                    }
                }
            }
            const resultJSON = JSON.stringify(result)
            console.log(resultJSON)
            handleJump(`/play/stats?state=${btoa(resultJSON)}`)()
        } 

        console.log(respostas)
        problem = nextProblem()
    }

    function handleCopyMatchLink(e: Event) {
        e.preventDefault()
        let url = new URL(window.location.href)
        url.searchParams.set('maxNumber', String(maxNumber))
        url.searchParams.set('ops', opsTxt)
        url.searchParams.set('plays', String(jogadas))
        navigator.clipboard.writeText(url.toString())
        alert("Copiado!")
    }
</script>

<svelte:head>
    <title>Jogo rápido - MathWars</title>
</svelte:head>

<section>

{#if playing}
    <ProblemQuestion problem={problem} on:answer={handleAnswer}/>
{:else}
<form>
    <h1>Configurações de partida</h1>
    <label for="ops">Operações: (escolhidas: {[...ops]})<br>Escolha entre +,-,/ e *, vazio = todas</label>
    <input type="text" name="ops" bind:value={opsTxt} />
    <label for="maxNumber">Maior número permitido nas operações: </label>
    <input type="number" name="maxNumber" bind:value={maxNumber}/>
    <label for="plays">Jogadas: </label>
    <input type="number" name="plays" bind:value={jogadas}/>
    <button class='mathwars-button' on:click={() => playing = true}>Inciar partida</button>
    <button class='mathwars-button' on:click={handleCopyMatchLink}>Copiar link de geração de partida</button>
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