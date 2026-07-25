<script lang='ts'>
  import { decodeMatchState, encodeMatchState, scorePlays, type Match } from "../lib/match";
  import { onMount } from "svelte";

  type PlayerSummary = {
    name: string
    id: string
    score: number
    acertos: number
    time: number
  }

  let state: Record<string, Match> = {}

  onMount(() => {
    const url = new URL(window.location.href)
    const raw = url.searchParams.get('state')
    if (raw === null || raw === '') {
      alert('Esta página não foi feita para ser usada desta forma. Indo para a página inicial...')
      history.pushState({}, '', '/')
      return
    }
    try {
      // searchParams.get already URI-decodes; decodeMatchState handles UTF-8 base64
      state = decodeMatchState(raw)
    } catch {
      alert('Estado da partida inválido. Indo para a página inicial...')
      history.pushState({}, '', '/')
    }
  })

  function summarizePlayers(matchState: Record<string, Match>): PlayerSummary[] {
    const rows: PlayerSummary[] = []
    for (const [key, { name, plays }] of Object.entries(matchState)) {
      let acertos = 0
      let time = 0
      for (const play of plays) {
        time += play.resposta.time
        if (play.resposta.right) acertos++
      }
      rows.push({
        name,
        id: key,
        score: scorePlays(plays),
        acertos: plays.length ? acertos / plays.length : 0,
        time,
      })
    }
    // Highest score first (leaderboard order)
    return rows.sort((x, y) => y.score - x.score)
  }

  $: summary = summarizePlayers(state)

  function handleCopyResultLink() {
    const url = new URL(window.location.href)
    // searchParams.set URI-encodes, so base64 '+' survives the round-trip
    url.searchParams.set('state', encodeMatchState(state))
    // Same pattern as QuickMatch: do not alert success on clipboard denial
    void navigator.clipboard.writeText(url.toString()).then(
      () => alert("Copiado!"),
      () => alert("Não foi possível copiar o link"),
    )
  }

  function handleTryAgain() {
    const first = Object.values(state)[0]
    if (!first) return
    const { maxNumber, ops, plays } = first.match
    const url = new URL(window.location.href)
    url.pathname = '/play/quick'
    url.searchParams.set('maxNumber', String(maxNumber))
    url.searchParams.set('ops', String(ops))
    url.searchParams.set('plays', String(plays))
    url.searchParams.delete('state')
    history.replaceState({}, '', url.toString())
  }
</script>

<svelte:head>
  <title>Resultado da partida - MathWars</title>
</svelte:head>

{#each summary as item}
<div class="mathwars-stats-container">
  <h1>{item.name}</h1>
  <p>⌛ {item.time/1000}s</p>
  <p>✔️ {Math.floor(item.acertos*100)}%</p>
  <p>🌟 {item.score}pt</p>
</div>
{/each}

<button class='mathwars-button' on:click={handleCopyResultLink}>Copiar link do resultado</button>
<button class='mathwars-button' on:click={handleTryAgain}>Tentar superar</button>
<style>
  .mathwars-stats-container {
    display: flex;

    align-items: center;

  }

  .mathwars-stats-container > * {
    padding: .2rem;
  }
</style>
