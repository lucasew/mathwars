import type { Match } from "./match";

export interface MatchScore {
  name: string;
  id: string;
  score: number;
  acertos: number;
  time: number;
}

export function calculateMatchScores(state: Record<string, Match>): MatchScore[] {
  const summary: MatchScore[] = [];

  Object.keys(state).forEach((key) => {
    const { name, plays } = state[key];
    let pontos = 0;
    let seguido = 0;
    let acertos = 0;
    let time = 0;

    for (let play of plays) {
      time += play.resposta.time;
      if (play.resposta.right) {
        seguido++;
        acertos++;
      } else {
        seguido = 0;
      }
      const deltaPoints = Math.floor(Math.abs((10 / Math.log10(play.resposta.time / 1000)) * seguido) * 10);
      pontos += deltaPoints;
    }

    summary.push({
      name,
      id: key,
      score: pontos,
      acertos: acertos / plays.length,
      time: time
    });
  });

  return summary.sort((x, y) => x.score - y.score);
}
