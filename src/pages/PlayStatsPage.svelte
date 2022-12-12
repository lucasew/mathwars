<script lang='ts'>
  import type { Match } from "src/lib/match";
  import { onMount } from "svelte";


let state: Record<string, Match> = {}
onMount(() => {
    const url = new URL(window.location.href)
    if (!url.searchParams.has('state')) {
        alert('Esta página não foi feita para ser usada desta forma. Indo para a página inicial...')
        history.pushState({}, '', '/')
    }
    state = JSON.parse(atob(url.searchParams.get('state')))
    console.log(state)
})

let summary: Array<{
  name: string,
  id: string,
  score: number,
  acertos: number,
  time: number
}> = [];
$: {
  Object.keys(state).forEach((key) => {
    const {name, plays} = state[key]
    let pontos = 0
    let seguido = 0
    let acertos = 0
    let time = 0
    for (let play of plays) {
      time += play.resposta.time
      if (play.resposta.right) {
        seguido++
        acertos++
      } else {
        seguido = 0
      }
      const deltaPoints = Math.floor(Math.abs((10/Math.log10(play.resposta.time/1000))*seguido)*10)
      console.log(deltaPoints)
      pontos += deltaPoints
      console.log(play)
    }
    summary.push({
      name,
      id: key,
      score: pontos,
      acertos: acertos / plays.length,
      time: time
    })
  })
  summary = summary.sort((x, y) => x.score - y.score)
  console.log(summary)
}

</script>


{#each summary as item}
<div class="mathwars-stats-container">
  <h1>{item.name}</h1>
  <p>⌛ {item.time/1000}s</p>
  <p>✔️ {Math.floor(item.acertos*100)}%</p>
  <p>🌟 {item.score}pt</p>
</div>
{/each}

<style>
  .mathwars-stats-container {
    display: flex;

    align-items: center;

  }

  .mathwars-stats-container > * {
    padding: .2rem;
  }
</style>