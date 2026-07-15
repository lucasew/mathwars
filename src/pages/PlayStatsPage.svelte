<script lang='ts'>
  import type { Match } from "../lib/match";
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
    if (!url.searchParams.has('state')) {
      alert('Esta página não foi feita para ser usada desta forma. Indo para a página inicial...')
      history.pushState({}, '', '/')
      return
    }
    try {
      state = JSON.parse(atob(url.searchParams.get('state') || ""))
    } catch {
      alert('Estado da partida inválido. Indo para a página inicial...')
      history.pushState({}, '', '/')
    }
  })

  function summarizePlayers(matchState: Record<string, Match>): PlayerSummary[] {
    const rows: PlayerSummary[] = []
    for (const [key, { name, plays }] of Object.entries(matchState)) {
      let pontos = 0
      let seguido = 0
      let acertos = 0
      let time = 0
      for (const play of plays) {
        time += play.resposta.time
        if (play.resposta.right) {
          seguido++
          acertos++
        } else {
          seguido = 0
        }
        const deltaPoints = Math.floor(
          Math.abs((10 / Math.log10(play.resposta.time / 1000)) * seguido) * 10
        )
        pontos += deltaPoints
      }
      rows.push({
        name,
        id: key,
        score: pontos,
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
    url.searchParams.set('state', btoa(JSON.stringify(state)))
    navigator.clipboard.writeText(url.toString())
    alert("Copiado!")
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
