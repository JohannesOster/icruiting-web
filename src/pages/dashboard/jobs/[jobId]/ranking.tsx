import React from 'react';
import Link from 'next/link';
import {H3, DataTable, TColumn, Box, getDashboardLayout} from 'components';
import {API} from 'services';
import {useTheme} from 'styled-components';
import useSWR from 'swr';
import {withAdmin} from 'components';
import {useRouter} from 'next/router';

export const Ranking = () => {
  const router = useRouter();
  const {jobId, formCategory} = router.query as {
    jobId: string;
    formCategory: string;
  };
  const {spacing} = useTheme();

  const {
    data: applicants,
    error: applicantsError,
  } = useSWR(`GET /applicants?jobId=${jobId}`, () =>
    API.applicants.list(jobId),
  );

  const {data: ranking, error: rankingError} = useSWR(
    [
      `GET /rankings/${jobId}?formCategory=${formCategory}`,
      jobId,
      formCategory,
    ],
    (_key: string, jobId: string, formCategory: string) =>
      API.rankings.find(jobId, formCategory),
  );

  const isLoading =
    !(ranking || rankingError) || !(applicants || applicantsError);

  const columns: TColumn[] = [
    {title: 'Rang', cell: (row) => row.rank},
    {
      title: 'Name',
      cell: (row) => (
        <Link
          href={`/dashboard/applicants/${row.applicantId}/report?formCategory=${formCategory}`}
        >
          <a>{row.name}</a>
        </Link>
      ),
    },
    {title: 'Score', cell: (row) => row.score},
    {title: '#Bewertungen', cell: (row) => row.submissionsCount},
  ];

  const data = ranking?.map((row, index) => {
    const applicant = applicants?.applicants?.find(
      ({applicantId}) => applicantId === row.applicantId,
    );

    return {...applicant, ...row, index};
  });

  return (
    <Box display="grid" rowGap={spacing.scale200}>
      <H3>
        Ranking-
        {
          {
            screening: 'Screening',
            assessment: 'Assessnent',
            onboarding: 'Onboarding',
          }[formCategory]
        }
      </H3>
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </Box>
  );
};

Ranking.getLayout = getDashboardLayout;
export default withAdmin(Ranking);
