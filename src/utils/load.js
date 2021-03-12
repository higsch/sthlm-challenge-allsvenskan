import { csv } from 'd3';
import { clubColors } from '../inputs/clubColors';

export const loadData = async (dataPath) => {
  const data = await csv(dataPath, d => {
    return {
      rank: +d.Rank,
      club: d.Club,
      goals_scored: +d['Goals scored'],
      goals_conceded: +d['Goals conceded'],
      played_games: +d['Played games'],
      victories: +d.Victories,
      points: +d.Points
    };
  });

  const dataSuppl = data
    .slice(0, 12)
    .map(d => {
      const { colors } = clubColors.find(c => c.club === d.club) || {};
      return {
        ...d,
        colors
      };
    });

  return dataSuppl;
};
