import React, {useEffect, useReducer, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useTheme} from 'styled-components';
import useSWR from 'swr';
import {useForm} from 'react-hook-form';
import {API} from 'services';
import {useAuth} from 'context';
import {
  DataTable,
  Table,
  TColumn,
  H3,
  H6,
  Box,
  Typography,
  Flexgrid,
  getDashboardLayout,
  Select,
  Button,
  Dialog,
  Input,
  Checkbox,
  withAuth,
} from 'components';

const Applicants = () => {
  const router = useRouter();
  type Query = {offset: number; limit: number; filter: string};
  const query = (router.query as unknown) as Query;
  const {offset = 0, limit = 10, filter = ''} = query;
  const {spacing} = useTheme();
  const {currentUser} = useAuth();

  const {data: jobs, error: jobsError} = useSWR('GET /jobs', API.jobs.list);
  const [selectedJobId, setSelectedJobId] = useState(jobs && jobs[0]?.jobId);

  const key = selectedJobId
    ? ['GET /applicants', selectedJobId, offset, limit, filter]
    : null;
  const {
    data: applicantsResponse,
    error: applicantsError,
    revalidate,
  } = useSWR(key, (_key, jobId) =>
    API.applicants.list(jobId, {offset, limit, filter}),
  );

  useEffect(() => {
    if (!jobs?.length) return;
    setSelectedJobId(jobs[0].jobId);
  }, [jobs]);

  const loadingJob = !(jobs || jobsError);
  const loadingApplicants = !(applicantsResponse || applicantsError);
  const isLoading = loadingJob || loadingApplicants;

  enum BulkAction {
    delete = 'delete',
  }
  type State = {
    bulkAction?: BulkAction;
    bulkActionIndices?: number[];
    bulkActionStatus?: 'pending' | 'requestConfirmation';
    currentJobId?: string;
    status: 'idle' | 'loading';
  };
  type ActionType =
    | 'requestBulkActionConfirmation'
    | 'cancelBulkAction'
    | 'confirmBulkAction'
    | 'resetBulkAction';
  type Action = {type: ActionType; payload?: any};

  const bulkDelete = async (indices: number[]) => {
    const promises = indices.map((index) => {
      const applicant = applicantsResponse.applicants[index];
      return API.applicants.del(applicant.applicantId);
    });

    await Promise.all(promises);
    await revalidate();
    dispatch({type: 'resetBulkAction'});
  };

  const [state, dispatch] = useReducer(
    (state: State, action: Action): State => {
      switch (action.type) {
        case 'requestBulkActionConfirmation': {
          const {bulkAction, bulkActionIndices} = action.payload;
          return {
            ...state,
            bulkAction,
            bulkActionIndices,
            bulkActionStatus: 'requestConfirmation',
          };
        }
        case 'resetBulkAction':
        case 'cancelBulkAction': {
          const _state = {...state};
          delete _state.bulkAction;
          delete _state.bulkActionIndices;
          delete _state.bulkActionStatus;
          return _state;
        }
        case 'confirmBulkAction': {
          switch (state.bulkAction) {
            case BulkAction.delete: {
              bulkDelete(state.bulkActionIndices);
            }
          }
          return {...state, bulkActionStatus: 'pending'};
        }
      }
    },
    {status: 'idle'},
  );

  const [showAssessmentsSummary, setShowAssessmentsSummary] = useState(
    localStorage.getItem('assessmentOverview') ? true : false,
  );

  const columns: TColumn[] = [
    ...(applicantsResponse?.applicants[0]?.attributes.map(({key}) => ({
      title: key,
      cell: (row) => {
        const attr = row.attributes.find(({key: _key}) => key === _key);
        if (attr?.value !== row.name) return attr?.value || '';
        return (
          <Link href={`${router.pathname}/${row.applicantId}`}>
            <a>{row.name}</a>
          </Link>
        );
      },
    })) || []),
    ...(showAssessmentsSummary
      ? ([
          {
            title: 'Bewertungen',
            cell: ({assessments}) => (
              <Table>
                <tbody>
                  {assessments?.map(({formTitle, formCategory, score}, idx) => (
                    <tr key={idx}>
                      <td>
                        {formTitle ||
                          {
                            screening: 'Screening',
                            assessment: 'Assessment',
                            onboarding: 'Onboarding',
                          }[formCategory]}
                      </td>
                      <td>{score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ),
          },
        ] as TColumn[])
      : []),
    {
      title: 'Bestätigt',
      cell: ({confirmed}) => <span>{confirmed ? 'Ja' : '-'} </span>,
    },
  ];

  const {register, getValues, reset, formState, handleSubmit} = useForm();
  useEffect(() => {
    reset({filter});
  }, [reset, filter]);

  const bulkActions = [{label: 'löschen', value: BulkAction.delete}];
  const onBulkAction = (
    bulkAction: BulkAction,
    bulkActionIndices: number[],
  ) => {
    switch (bulkAction) {
      case BulkAction.delete: {
        dispatch({
          type: 'requestBulkActionConfirmation',
          payload: {bulkAction, bulkActionIndices},
        });
      }
    }
  };

  const routeFor = (offset: number, limit: number, filter: string) => {
    const _filter = filter ? '&filter=' + filter : '';
    return `${router.pathname}?offset=${offset}&limit=${limit}${_filter}`;
  };

  return (
    <main>
      {state.bulkActionStatus && (
        <Dialog
          onClose={() => {
            if (state.bulkActionStatus === 'pending') return;
            dispatch({type: 'cancelBulkAction'});
          }}
        >
          <Box display="grid" rowGap={spacing.scale300}>
            <H6>Bewerber*innen wirklich unwiderruflich löschen?</H6>
            <Typography>
              Sind Sie sicher, dass Sie alle Daten der ausgewählten
              Bewerbers*innen löschen wollen? Dieser Vorgang kann nicht
              rückgängig gemacht werden.
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button
                onClick={() => dispatch({type: 'confirmBulkAction'})}
                isLoading={state.bulkActionStatus === 'pending'}
              >
                Löschen
              </Button>
              <Button
                onClick={() => dispatch({type: 'cancelBulkAction'})}
                disabled={state.bulkActionStatus === 'pending'}
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
        flexGap={spacing.scale300}
        marginBottom={spacing.scale300}
      >
        <H3>Bewerbungen</H3>
        <Box
          display="grid"
          gridAutoFlow="column"
          alignItems="center"
          justifyContent="start"
          columnGap={spacing.scale300}
        >
          <Box
            display="grid"
            alignItems="center"
            gridAutoFlow="column"
            columnGap={spacing.scale200}
          >
            <Checkbox
              value={showAssessmentsSummary ? ['true'] : []}
              options={[{label: 'Bewertungsübersicht', value: 'true'}]}
              onChange={() => {
                if (!showAssessmentsSummary)
                  localStorage.setItem('assessmentOverview', 'true');
                if (showAssessmentsSummary)
                  localStorage.removeItem('assessmentOverview');

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
          router.push(routeFor(0, limit, filter));
        })}
      >
        <Flexgrid
          flexGap={spacing.scale300}
          alignItems="center"
          marginBottom={spacing.scale300}
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
            löschen
          </Button>
          <Button type="submit">Suchen</Button>
        </Flexgrid>
      </form>
      <DataTable
        id="applicants-dt"
        columns={columns}
        data={applicantsResponse?.applicants || []}
        isLoading={isLoading}
        totalCount={applicantsResponse?.totalCount || 0}
        totalPages={Math.ceil((applicantsResponse?.totalCount || 0) / limit)}
        currentPage={Math.round(offset / limit) + 1}
        onPrev={() => router.push(routeFor(+offset - +limit, limit, filter))}
        onNext={() => router.push(routeFor(+offset + +limit, limit, filter))}
        onRowsPerPageChange={(rows) => {
          router.push(routeFor(0, rows, filter));
        }}
        rowsPerPage={limit}
        actions={currentUser.userRole === 'admin' ? bulkActions : undefined}
        onAction={onBulkAction}
      />
    </main>
  );
};

Applicants.getLayout = getDashboardLayout;
export default withAuth(Applicants);
