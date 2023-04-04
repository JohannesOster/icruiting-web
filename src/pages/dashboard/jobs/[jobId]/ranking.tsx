import React from 'react';
import Link from 'next/link';
import {
  HeadingL,
  DataTable,
  TColumn,
  Box,
  getDashboardLayout,
} from 'components';
import {API} from 'services';
import {useTheme} from 'styled-components';
import {withAdmin} from 'components';
import {useRouter} from 'next/router';
import {useFetch} from 'components/useFetch';

export const Ranking = () => {
  const router = useRouter();
  const {jobId, formCategory} = router.query as {
    jobId: string;
    formCategory: string;
  };
  const {spacing} = useTheme();

  const {data: applicants, error: applicantsError} = useFetch(
    `GET /applicants?jobId=${jobId}`,
    () => API.applicants.list(jobId),
  );

  const {data: ranking, error: rankingError} = useFetch(
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
          {row.name}
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
    <Box display="grid" rowGap={spacing.scale300}>
      <HeadingL>
        Ranking-
        {
          {
            screening: 'Screening',
            assessment: 'Assessment',
            onboarding: 'Onboarding',
          }[formCategory]
        }
      </HeadingL>
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </Box>
  );
};

Ranking.getLayout = getDashboardLayout;
export default withAdmin(Ranking);
