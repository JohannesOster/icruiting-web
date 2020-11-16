import {FormFieldIntent} from 'services';

type KeyValuePair<T> = {[key: string]: T};

export const parseValue = (
  value: string | string[] | KeyValuePair<string>,
  intent: FormFieldIntent,
): string | string[] => {
  switch (intent) {
    case FormFieldIntent.sumUp:
      return value as string;
    case FormFieldIntent.aggregate:
      return value as string[];
    case FormFieldIntent.countDistinct:
      return Object.entries(
        (value as string[]).reduce((acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        }, {} as any),
      )
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
  }
};

export const buildRadarChart = (requirementResults: {
  [jobRequirementId: string]: {
    requirementLabel: string;
    avgJobRequirementScore: string;
    minValue: string;
  };
}): KeyValuePair<any> => {
  const requirements = Object.values(requirementResults);
  const labels = requirements.map(({requirementLabel}) => requirementLabel);
  const scores = requirements.map(
    ({avgJobRequirementScore}) => avgJobRequirementScore,
  );
  const minValues = requirements.map(({minValue}) => minValue);

  const data = {
    labels,
    datasets: [
      {
        label: 'Erzielter Wert',
        data: scores,
        backgroundColor: 'rgb(15,91,165, 0.4)',
      },
      {label: 'Mindestmaß', data: minValues},
    ],
  };

  const options = {
    pointLabelFontSize: 20,
    legend: {display: true, labels: {fontSize: 16}},
    scale: {ticks: {beginAtZero: true}, pointLabels: {fontSize: 16}},
  };

  return {data, options};
};
