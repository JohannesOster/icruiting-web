import {Box, H3, getDashboardLayout} from 'components';
import {Button, Checkbox, Spinner, useToaster} from 'icruiting-ui';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {API, TForm} from 'services';
import {useTheme} from 'styled-components';
import useSWR from 'swr';

type FormValues = {reportFields: string[]};

const ReportBuilder = () => {
  const {spacing} = useTheme();
  const toaster = useToaster();
  const router = useRouter();
  const {jobId} = router.query as {jobId: string};

  const {register, handleSubmit, formState, reset} = useForm();
  const onSubmit = async (values: FormValues) => {
    if (!report) {
      await API.jobs.createReport(jobId, values.reportFields);
    } else {
      await API.jobs.updateReport(jobId, values.reportFields);
    }
    toaster.success('Gutachten erfolgreich bearbeitet');
    router.back();
  };

  const {data: forms, error: formsError} = useSWR(
    [`GET /forms`, jobId],
    (_key, jobId) => API.forms.list(jobId),
  );

  const [form, setForm] = useState<TForm | undefined>();
  useEffect(() => {
    if (!forms) return;
    const _form = forms.find(
      ({formCategory}) => formCategory === 'application',
    );
    if (!_form) toaster.danger('Missing application form');
    setForm(_form);
  }, [forms]);

  const {data: report} = useSWR(
    ['GET /jobs/:jobId/report', jobId],
    (_key, jobId) => API.jobs.retrieveReport(jobId),
  );

  useEffect(() => {
    if (!report) return;
    reset({reportFields: report.formFields});
  }, [report]);

  return (
    <Box>
      <H3>Gutachten</H3>
      {!(forms || formsError) ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="grid" rowGap={spacing.scale200}>
            <Checkbox
              name="reportFields"
              ref={register}
              options={
                form?.formFields.map(({label, formFieldId}) => ({
                  label,
                  value: formFieldId,
                })) || []
              }
            />
            <div>
              <Button type="submit" isLoading={formState.isSubmitting}>
                Speichern
              </Button>
            </div>
          </Box>
        </form>
      )}
    </Box>
  );
};

ReportBuilder.getLayout = getDashboardLayout;
export default ReportBuilder;
