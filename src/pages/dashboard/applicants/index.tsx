import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Select, Button, Dialog, Input, Checkbox} from 'icruiting-ui';
import {useTheme} from 'styled-components';
import useSWR from 'swr';
import {API} from 'services';
import {useAuth} from 'context';
import {
  DataTable,
  H3,
  H6,
  Box,
  Typography,
  TColumn,
  Flexgrid,
} from 'components';
import {useForm} from 'react-hook-form';
import {Table} from 'components/Table/Table.sc';
import {withAuth} from 'components';
import {getDashboardLayout} from 'components';

const Applicants = () => {
  const router = useRouter();
  const {spacing} = useTheme();
  const {currentUser} = useAuth();
  const {offset = 0, limit = 10, filter = ''} = (router.query as unknown) as {
    offset: number;
    limit: number;
    filter: string;
  };

  const [showAssessmentsSummary, setShowAssessmentsSummary] = useState(false);

  const {data: jobs, error: jobsError} = useSWR('GET /jobs', API.jobs.list);
  const [selectedJobId, setSelectedJobId] = useState(jobs && jobs[0]?.jobId);
  const [deletingApplicantId, setDeletingApplicantId] = useState<string | null>(
    null,
  );
  const [shouldDeleteApplicantId, setShouldDeleteApplicantId] = useState<
    string | null
  >(null);

  const key = selectedJobId
    ? ['GET /applicants', selectedJobId, offset, limit, filter]
    : null;
  const {data: applicantsResponse, error: applicantsError, mutate} = useSWR(
    key,
    (_key, jobId) => API.applicants.list(jobId, {offset, limit, filter}),
  );

  useEffect(() => {
    if (!jobs?.length) return;
    setSelectedJobId(jobs[0].jobId);
  }, [jobs]);

  const isLoading =
    !(jobs || jobsError) && !(applicantsResponse || applicantsError);

  const onDelete = () => {
    if (!shouldDeleteApplicantId) return;
    setDeletingApplicantId(shouldDeleteApplicantId);
    API.applicants.del(shouldDeleteApplicantId).finally(() => {
      mutate(({applicants, totalCount}) => ({
        totalCount,
        applicants: applicants.filter(
          ({applicantId}) => applicantId !== deletingApplicantId,
        ),
      }));
      setDeletingApplicantId(null);
    });
  };

  const deleteColumn: TColumn = {
    title: 'Aktion',
    cell: ({applicantId, ...rest}) => (
      <Button
        kind="minimal"
        isLoading={deletingApplicantId === applicantId}
        onClick={() => {
          setShouldDeleteApplicantId(applicantId);
        }}
      >
        löschen
      </Button>
    ),
  };
  const columns: TColumn[] = [
    {
      title: 'Name',
      cell: ({name, applicantId}) => (
        <Link href={`${router.pathname}/${applicantId}`}>
          <a>{name}</a>
        </Link>
      ),
    },
    {title: 'E-Mail-Adresse', cell: ({email}) => email},
    ...(currentUser?.userRole === 'admin' ? [deleteColumn] : []),
    ...(showAssessmentsSummary
      ? ([
          {
            title: 'Bewertungen',
            cell: ({assessments}) => (
              <Table>
                <tbody>
                  {assessments?.map(
                    ({formTitle, formCategory, score}: any, idx: number) => (
                      <tr key={idx}>
                        <td>
                          {formTitle ||
                            (formCategory === 'screening'
                              ? 'Screening'
                              : 'Assessment')}
                        </td>
                        <td>{score}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </Table>
            ),
          },
        ] as TColumn[])
      : []),
  ];

  const getRowStyle = ({screeningExists}: {[key: string]: any}) => {
    if (!screeningExists) return {};
    return {background: '#CBCBCB'};
  };

  const {register, getValues, reset, formState, handleSubmit} = useForm();
  useEffect(() => {
    reset({filter});
  }, [reset, filter]);

  return (
    <main>
      {shouldDeleteApplicantId && (
        <Dialog
          onClose={() => {
            setShouldDeleteApplicantId(null);
          }}
        >
          <Box display="grid" rowGap={spacing.scale200}>
            <H6>Bewerber*in wirklich unwiederruflich löschen?</H6>
            <Typography>
              Sind Sie sicher, dass Sie alle Daten des*der Bewerbers*in löschen
              wollen? Dieser Vorgang kann nicht rückgängig gemacht werden.
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button
                onClick={() => {
                  onDelete();
                  setShouldDeleteApplicantId(null);
                }}
              >
                Löschen
              </Button>
              <Button
                onClick={() => {
                  setShouldDeleteApplicantId(null);
                }}
              >
                Abbrechen
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
      <Flexgrid
        justifyContent="space-between"
        alignItems="center"
        flexGap={spacing.scale200}
        marginBottom={spacing.scale200}
      >
        <H3>Bewerbungen</H3>
        <Box
          display="grid"
          gridAutoFlow="column"
          alignItems="center"
          justifyContent="start"
          columnGap={spacing.scale200}
        >
          <Box
            display="grid"
            alignItems="center"
            gridAutoFlow="column"
            columnGap={spacing.scale100}
          >
            <Checkbox
              options={[{label: 'Bewertungsübersicht', value: 'true'}]}
              onChange={() => {
                setShowAssessmentsSummary((val) => !val);
              }}
            />
          </Box>
          {jobs && (
            <Select
              options={jobs.map((job) => ({
                label: job.jobTitle,
                value: job.jobId,
              }))}
              onChange={(event) => {
                const {value} = event.target;
                setSelectedJobId(value);
              }}
            />
          )}
        </Box>
      </Flexgrid>
      <form
        onSubmit={handleSubmit(({filter}) => {
          router.push(`${router.pathname}?filter=${filter}`);
        })}
      >
        <Flexgrid
          flexGap={spacing.scale200}
          alignItems="center"
          marginBottom={spacing.scale200}
        >
          <Box flex={1}>
            <Input placeholder="Suchen" name="filter" ref={register} />
          </Box>
          <Button
            kind="minimal"
            disabled={!(getValues('filter') || formState.isDirty)}
            onClick={() => {
              reset();
              if (filter) {
                router.push(
                  `${router.pathname}?offset=${offset}&limit=${limit}`,
                );
              }
            }}
          >
            Clear
          </Button>
          <Button type="submit">Suchen</Button>
        </Flexgrid>
      </form>
      <DataTable
        columns={columns}
        data={applicantsResponse?.applicants || []}
        isLoading={isLoading}
        getRowStyle={getRowStyle}
        totalCount={applicantsResponse?.totalCount || 0}
        totalPages={Math.ceil((applicantsResponse?.totalCount || 0) / limit)}
        currentPage={Math.round(offset / limit) + 1}
        onPrev={() => {
          router.push(
            `${router.pathname}?offset=${+offset - +limit}&limit=${limit}${
              filter ? '&filter=' + filter : ''
            }`,
          );
        }}
        onNext={() => {
          router.push(
            `${router.pathname}?offset=${+offset + +limit}&limit=${limit}${
              filter ? '&filter=' + filter : ''
            }`,
          );
        }}
      />
    </main>
  );
};

Applicants.getLayout = getDashboardLayout;
export default withAuth(Applicants);
