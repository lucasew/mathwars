<script lang="ts">
    import ProblemQuestion from '../lib/ProblemQuestion.svelte';
    import {generateProblem, type Problem} from '../lib/problemgen'
    import { onMount } from 'svelte';
    import { idUsuario, usernameStore } from '../lib/user';
    import { handleJump } from '../stores/location';
    import { encodeMatchState, type Match } from '../lib/match';

    const DEFAULT_MAX_NUMBER = 20
    const DEFAULT_PLAYS = 10
    const MAX_MAX_NUMBER = 999
    const MAX_PLAYS = 200

    /** Positive integer in [1, max]; non-finite / <1 → fallback. Stops NaN operands from max≤0. */
    function normalizePositiveInt(value: unknown, fallback: number, max: number): number {
        const n = typeof value === 'number' ? value : Number(value)
        if (!Number.isFinite(n) || n < 1) return fallback
        return Math.min(Math.floor(n), max)
    }

    let playing = false;
    let ops: Set<Problem['op']> = new Set([]);
    let maxNumber: number = DEFAULT_MAX_NUMBER;
    let opsTxt = '';
    let respostas: Match['plays'] = []
    let jogadas = DEFAULT_PLAYS;
    let problem: Problem = generateProblem({ max: maxNumber });

    $: ops = new Set(opsTxt.split('').filter((item) => "+-/*".includes(item))) as Set<Problem['op']>
    $: opsArg = [...ops].length == 0 ? undefined : ops

    onMount(() => {
        const url = new URL(window.location.href)
        if (url.searchParams.has('maxNumber')) {
            maxNumber = normalizePositiveInt(
                parseInt(url.searchParams.get('maxNumber') || '', 10),
                DEFAULT_MAX_NUMBER,
                MAX_MAX_NUMBER,
            )
        }
        if (url.searchParams.has('ops')) {
            opsTxt = (url.searchParams.get('ops') || "").replace(' ', '+')
        }
        if (url.searchParams.has('plays')) {
            jogadas = normalizePositiveInt(
                parseInt(url.searchParams.get('plays') || '', 10),
                DEFAULT_PLAYS,
                MAX_PLAYS,
            )
        }
    })

    function nextProblem(): Problem {
        return generateProblem({
            max: maxNumber,
            ops: opsArg
        })
    }

    function startMatch() {
        // Re-clamp form values (empty/negative number inputs → NaN problems / 0-length matches)
        maxNumber = normalizePositiveInt(maxNumber, DEFAULT_MAX_NUMBER, MAX_MAX_NUMBER)
        jogadas = normalizePositiveInt(jogadas, DEFAULT_PLAYS, MAX_PLAYS)
        respostas = []
        problem = nextProblem()
        playing = true
    }

    function handleAnswer(event: CustomEvent<{right: boolean, time: number}>) {
        respostas = [...respostas, {pergunta: problem, resposta: event.detail}]
        if (respostas.length >= jogadas) {
            const id = idUsuario || "unknown";
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
            // encodeURIComponent: base64 '+' must not become a space in the query string
            handleJump(`/play/stats?state=${encodeURIComponent(encodeMatchState(result))}`)()
            return
        }
        problem = nextProblem()
    }

    function handleCopyMatchLink(e: MouseEvent) {
        e.preventDefault()
        const max = normalizePositiveInt(maxNumber, DEFAULT_MAX_NUMBER, MAX_MAX_NUMBER)
        const plays = normalizePositiveInt(jogadas, DEFAULT_PLAYS, MAX_PLAYS)
        maxNumber = max
        jogadas = plays
        let url = new URL(window.location.href)
        url.searchParams.set('maxNumber', String(max))
        url.searchParams.set('ops', opsTxt)
        url.searchParams.set('plays', String(plays))
        void navigator.clipboard.writeText(url.toString()).then(
            () => alert('Copiado!'),
            () => alert('Não foi possível copiar o link'),
        )
    }
</script>

<svelte:head>
    <title>Jogo rápido - MathWars</title>
</svelte:head>

<section>

{#if playing}
    <ProblemQuestion problem={problem} on:answer={handleAnswer}/>
{:else}
<form on:submit|preventDefault={startMatch}>
    <h1>Configurações de partida</h1>
    <label for="ops">Operações: (escolhidas: {[...ops]})<br>Escolha entre +,-,/ e *, vazio = todas</label>
    <input type="text" name="ops" id="ops" bind:value={opsTxt} />
    <label for="maxNumber">Maior número permitido nas operações: </label>
    <input type="number" name="maxNumber" id="maxNumber" min="1" max={MAX_MAX_NUMBER} bind:value={maxNumber}/>
    <label for="plays">Jogadas: </label>
    <input type="number" name="plays" id="plays" min="1" max={MAX_PLAYS} bind:value={jogadas}/>
    <button type="submit" class='mathwars-button'>Iniciar partida</button>
    <button type="button" class='mathwars-button' on:click={handleCopyMatchLink}>Copiar link de geração de partida</button>
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
