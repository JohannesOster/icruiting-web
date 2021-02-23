import {TRanking, TRankingAPI} from './types';

export const convertAPIRanking = (ranking: TRankingAPI): TRanking => {
  return (ranking.map((item) => {
    const score = parseFloat(item.score);
    const submissionsCount = parseInt(item.submissionsCount);

    return {...item, score, submissionsCount};
  }) as unknown) as TRanking;
};
