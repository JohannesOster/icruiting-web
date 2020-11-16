import React from 'react';
import Link from 'next/link';
import {H3, DataTable, TColumn, Box, getDashboardLayout} from 'components';
import {API} from 'services';
import {useTheme} from 'styled-components';
import useSWR from 'swr';
import {withAdmin} from 'requireAuth';
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
    isValidating: isValidatingApplicants,
  } = useSWR(`GET /applicants?jobId=${jobId}`, () =>
    API.applicants.list(jobId),
  );

  const {data: ranking = [], isValidating: isValidatingRanking} = useSWR(
    [
      `GET /rankings/${jobId}?formCategory=${formCategory}`,
      jobId,
      formCategory,
    ],
    (_key: string, jobId: string, formCategory: string) =>
      API.rankings.find(jobId, formCategory),
  );

  const isLoading = isValidatingApplicants || isValidatingRanking;

  const columns: Array<TColumn> = [
    {title: 'Rang', cell: (row) => row.rank},
    {
      title: 'Name',
      cell: (row) => (
        <Link
          href={`/dashboard/applicants/${row.applicantId}/report?formCategory=${formCategory}`}
        >
          {row.name}
        </Link>
      ),
    },
    {title: 'Standardabweichung', cell: (row) => row.standardDeviation},
    {title: 'Score', cell: (row) => row.score},
    {title: '#Bewertungen', cell: (row) => row.submissionsCount},
  ];

  const data = ranking.map((row, index) => {
    const applicant = applicants?.applicants?.find(
      ({applicantId}) => applicantId === row.applicantId,
    );

    return {...applicant, ...row, index};
  });

  return (
    <Box display="grid" rowGap={spacing.scale200}>
      <H3>
        Ranking - {formCategory === 'screening' ? 'Screening' : 'Assessment'}
      </H3>
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </Box>
  );
};

Ranking.getLayout = getDashboardLayout;
export default withAdmin(Ranking);