import React, {useRef, useState} from 'react';
import Link from 'next/link';
import {
  H3,
  H6,
  Typography,
  TColumn,
  DataTable,
  Box,
  FlexGrid,
  getDashboardLayout,
  Button,
  Dialog,
  Input,
  withAdmin,
} from 'components';
import {useToaster} from 'context';
import {useTheme} from 'styled-components';
import useSWR from 'swr';
import {API} from 'services';
import {useRouter} from 'next/router';
import config from 'amplify.config';

export const Jobs = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const toaster = useToaster();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [shouldDeleteJobId, setShouldDeleteJobId] = useState<string | null>(
    null,
  );
  const [exportingJobId, setExportingJobId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {data: jobs, error, revalidate} = useSWR('GET /jobs', API.jobs.list);

  const onDelete = () => {
    if (!shouldDeleteJobId) return;
    setDeletingJobId(shouldDeleteJobId);
    API.jobs.del(shouldDeleteJobId).finally(() => {
      revalidate().then(() => setDeletingJobId(null));
    });
  };

  const columns: TColumn[] = [
    {
      title: 'Bezeichnung',
      cell: (row) => (
        <Link href={`${router.pathname}/${row.jobId}`}>
          <a>{row.jobTitle}</a>
        </Link>
      ),
    },
    {
      title: 'Aktion',
      cell: (row) => (
        <Link href={`${router.pathname}/${row.jobId}/edit`}>
          <a>bearbeiten</a>
        </Link>
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
    {
      title: 'JSON Export',
      cell: ({jobId}) => (
        <Button
          kind="minimal"
          isLoading={exportingJobId === jobId}
          onClick={async () => {
            setExportingJobId(jobId);
            await API.jobs.exportJSON(jobId);
            setExportingJobId(null);
          }}
        >
          JSON Export
        </Button>
      ),
    },
  ];

  const uploadJob = async () => {
    setIsUploading(true);
    await new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        if (!files) throw new Error('Datei fehlt.');
        if (!files.length || !files[0]) return;
        const file = files[0];
        formData.append('job', file);

        const token = await API.auth.token();
        const request = new XMLHttpRequest();
        request.open('POST', `${config.API.endpoints[0].endpoint}/jobs/import`);
        request.setRequestHeader('Authorization', `Bearer ${token}`);
        request.onreadystatechange = () => {
          try {
            if (request.readyState === 4) {
              if (request.status !== 201) throw new Error(request.responseText);
              resolve({});
            }
          } catch (error) {
            reject(error);
          }
        };

        request.send(formData);
      } catch (error) {
        toaster.danger(error.message);
      }
    })
      .then(async () => {
        await revalidate();
        toaster.success('Stelle erfolgreich importiert');
      })
      .catch((error) => toaster.danger(error.message))
      .finally(() => setIsUploading(false));
  };

  return (
    <Box display="grid" rowGap={spacing.scale300}>
      {shouldDeleteJobId && (
        <Dialog
          onClose={() => {
            setShouldDeleteJobId(null);
          }}
        >
          <Box display="grid" rowGap={spacing.scale300}>
            <H6>Stelle wirklich unwiderruflich löschen?</H6>
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <H3>Stellen</H3>
        <Button onClick={() => router.push(`${router.pathname}/create`)}>
          Hinzufügen
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={jobs || []}
        isLoading={!(jobs || error)}
      />
      <form
        ref={formRef}
        onSubmit={async (event) => {
          event.preventDefault();
          await uploadJob();
          formRef?.current?.reset();
        }}
      >
        <FlexGrid flexGap={spacing.scale300}>
          <Box maxWidth="200px" overflow="hidden">
            <Input
              type="file"
              accept=".json"
              onChange={(event) => {
                const {files} = event.target;
                setFiles(files);
              }}
            />
          </Box>
          <Button
            kind="minimal"
            type="submit"
            isLoading={isUploading}
            disabled={!files?.length}
          >
            hochladen
          </Button>
        </FlexGrid>
      </form>
    </Box>
  );
};

Jobs.getLayout = getDashboardLayout;
export default withAdmin(Jobs);
