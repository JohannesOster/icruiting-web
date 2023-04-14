import React, {useRef, useState} from 'react';
import Link from 'next/link';
import {
  HeadingL,
  TColumn,
  DataTable,
  Box,
  FlexGrid,
  getDashboardLayout,
  Button,
  Dialog,
  Input,
  withAdmin,
  DialogBody,
  DialogFooter,
} from 'components';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {useToaster} from 'context';
import {useTheme} from 'styled-components';
import {API} from 'services';
import {useRouter} from 'next/router';
import config from 'config';
import {useFetch} from 'components/useFetch';
import {useForm} from 'react-hook-form';
import {TJobRequest} from '../../../services/jobs';
import {yupResolver} from '@hookform/resolvers';
import {object, string} from 'yup';

export const Jobs = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const toaster = useToaster();
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {data: jobs, error, revalidate} = useFetch('GET /jobs', API.jobs.list);

  const columns: TColumn[] = [
    {
      title: 'Stellentitel',
      cell: (row) => <Link href={`${router.pathname}/${row.jobId}`}>{row.jobTitle}</Link>,
    },
    {
      title: 'Einstellungen',
      cell: (row) => <Link href={`${router.pathname}/${row.jobId}/settings`}>Einstellungen</Link>,
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
        request.open('POST', `${config.endpoint.url}/jobs/import`);
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

  const {register, errors, handleSubmit, formState} = useForm<TJobRequest>({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: yupResolver(
      object({
        jobTitle: string()
          .min(5, 'Stellentitle muss mindestens 5 Zeichen lang sein.')
          .max(50, 'Stellentitle darf maximal 50 Zeichen lang sein.')
          .required('Stellentitel ist verpflichtend.'),
      }),
    ),
  });

  const onSubmit = async (data: TJobRequest) => {
    setStatus('submitting');
    await API.jobs
      .create(data)
      .then(() => {
        toaster.success('Stelle erfolgreich erstellt');
        setShowNewJobDialog(false);
        revalidate();
      })
      .catch((error) => {
        toaster.danger(error.message);
      });
    setStatus('idle');
  };

  return (
    <Box display="grid" rowGap={spacing.scale300}>
      {showNewJobDialog && (
        <Dialog onClose={() => setShowNewJobDialog(false)} title="Neue Stelle">
          <form>
            <DialogBody>
              <Input
                name="jobTitle"
                label="Stellentitel"
                placeholder="Stellentitel"
                description="Die Bezeichnung der Stelle."
                ref={register}
                errors={errorsFor(errors, 'jobTitle')}
                autoFocus
                required
              />
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setShowNewJobDialog(false)} kind="secondary">
                Abbrechen
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={!(formState.isValid && formState.isDirty)}
                isLoading={status === 'submitting'}
                type="submit"
              >
                Speichern
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <HeadingL>Stellen</HeadingL>
        <Button onClick={() => setShowNewJobDialog(true)}>Hinzufügen</Button>
      </Box>
      <DataTable columns={columns} data={jobs || []} isLoading={!(jobs || error)} />
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
          <Button kind="minimal" type="submit" isLoading={isUploading} disabled={!files?.length}>
            hochladen
          </Button>
        </FlexGrid>
      </form>
    </Box>
  );
};

Jobs.getLayout = getDashboardLayout;
export default withAdmin(Jobs);
