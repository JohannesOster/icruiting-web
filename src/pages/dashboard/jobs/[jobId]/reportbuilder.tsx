import {Box, H3, getDashboardLayout} from 'components';
import {Button, Checkbox, Spinner, useToaster} from 'icruiting-ui';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {API, TForm} from 'services';
import {useTheme} from 'styled-components';
import useSWR from 'swr';

const ReportBuilder = () => {
  const toaster = useToaster();
  const {spacing} = useTheme();
  const router = useRouter();
  const {jobId} = router.query as {jobId: string};
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

  return (
    <Box>
      <H3>Gutachten</H3>
      {!(forms || formsError) ? (
        <Spinner />
      ) : (
        <form>
          <Box display="grid" rowGap={spacing.scale200}>
            <Checkbox
              options={
                form?.formFields.map(({label, formFieldId}) => ({
                  label,
                  value: formFieldId,
                })) || []
              }
            />
            <div>
              <Button type="submit">Speichern</Button>
            </div>
          </Box>
        </form>
      )}
    </Box>
  );
};

ReportBuilder.getLayout = getDashboardLayout;
export default ReportBuilder;
