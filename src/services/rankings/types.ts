import {FormFieldIntent} from 'services';

export type TRanking = Array<{
  applicantId: string;
  score: number;
  rank: number;
  standardDeviation: number;
  submissions: Array<any>;
  result: {
    [formFieldId: string]: {
      label: string;
      intent: FormFieldIntent;
      value: string | string[] | number;
    };
  };
}>;

export type TRankingAPI = Array<{
  applicantId: string;
  score: string;
  rank: string;
  standardDeviation: string;
  submissionsCount: string;
  submissions: Array<any>;
  result: {
    [formFieldId: string]: {
      label: string;
      intent: FormFieldIntent;
      value: string;
    };
  };
}>;