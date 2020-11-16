import React, {useState} from 'react';
import Link from 'next/link';
import {H3, H6, Typography, TColumn, DataTable, Box} from 'components';
import {Button, Dialog} from 'icruiting-ui';
import {useTheme} from 'styled-components';
import useSWR from 'swr';
import {API} from 'services';
import {withAdmin} from 'components';
import {getDashboardLayout} from 'components';
import {useRouter} from 'next/router';

export const Jobs = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [shouldDeleteJobId, setShouldDeleteJobId] = useState<string | null>(
    null,
  );

  const {data: jobs, isValidating, mutate} = useSWR('GET /jobs', API.jobs.list);

  const onDelete = () => {
    if (!shouldDeleteJobId) return;
    setDeletingJobId(shouldDeleteJobId);
    API.jobs.del(shouldDeleteJobId).finally(() => {
      mutate((data) => {
        return data.filter(({jobId}) => jobId !== deletingJobId);
      });
      setDeletingJobId(null);
    });
  };

  const columns: Array<TColumn> = [
    {
      title: 'Bezeichnung',
      cell: (row) => (
        <Link href={`${router.pathname}/${row.jobId}`}>{row.jobTitle}</Link>
      ),
    },
    {
      title: 'Aktion',
      cell: (row) => (
        <Link href={`${router.pathname}/${row.jobId}/edit`}>bearbeiten</Link>
      ),
    },
    {
      title: 'Aktion',
      cell: ({jobId}) => (
        <Button
          kind="minimal"
          isLoading={deletingJobId === jobId}
          onClick={() => {
            setShouldDeleteJobId(jobId);
          }}
        >
          löschen
        </Button>
      ),
    },
  ];

  return (
    <main>
      {shouldDeleteJobId && (
        <Dialog
          onClose={() => {
            setShouldDeleteJobId(null);
          }}
        >
          <Box display="grid" rowGap={spacing.scale200}>
            <H6>Stelle wirklich unwiederruflich löschen?</H6>
            <Typography>
              Sind Sie sicher, dass Sie die alle mit dieser Stelle in Verbingung
              stehenden Daten löschen wollen? Das inkludiert auch{' '}
              <b>alle Bewerber*innen</b> die sich über das Bewerbungsformular
              dieser stelle beworben haben! Dieser Vorgang kann nicht rückgängig
              gemacht werden.
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button
                onClick={() => {
                  onDelete();
                  setShouldDeleteJobId(null);
                }}
              >
                Löschen
              </Button>
              <Button
                onClick={() => {
                  setShouldDeleteJobId(null);
                }}
              >
                Abbrechen
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={spacing.scale300}
      >
        <H3>Stellen</H3>
        <Button onClick={() => router.push(`${router.pathname}/create`)}>
          Hinzufügen
        </Button>
      </Box>
      <DataTable columns={columns} data={jobs || []} isLoading={isValidating} />
    </main>
  );
};

Jobs.getLayout = getDashboardLayout;
export default withAdmin(Jobs);
