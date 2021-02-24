import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {useTheme} from 'styled-components';
import {
  Table,
  Box,
  H6,
  DataTable,
  Flexgrid,
  getDashboardLayout,
} from 'components';
import {Button, useToaster} from 'icruiting-ui';
import {API, TForm} from 'services';
import useSWR from 'swr';
import {Arrow, Edit} from 'icons';
import {useAuth} from 'context';
import {withAuth} from 'components';
import {stringToComponent} from 'lib/form-builder-utils';
import {errorsFor} from 'lib/utility';

const ApplicantDetails = () => {
  const toaster = useToaster();
  const {colors, spacing} = useTheme();
  const router = useRouter();
  const {applicantId} = router.query as {applicantId: string};
  const [showScreeningForm, setShowScreeningForm] = useState(true);

  const [status, setStatus] = useState('idle');
  const {data: applicant} = useSWR(
    ['GET /applicants/:applicantId', applicantId],
    (_key: string, applicantId: string) => API.applicants.find(applicantId),
  );

  const {currentUser} = useAuth();

  const formsKey = applicant ? [`GET /forms`, applicant.jobId] : null;
  const [forms, setForms] = useState<{[key: string]: TForm[]}>({});
  const {data} = useSWR(formsKey, (_key, jobId) => API.forms.list(jobId));

  useEffect(() => {
    if (!data) return;
    const _forms = data.reduce((acc, curr) => {
      const cat = curr.formCategory;
      acc[cat] = acc[cat] ? acc[cat].concat(curr) : [curr];
      return acc;
    }, {} as any);
    setForms(_forms);
  }, [data]);

  const screeningForms = forms.screening as TForm[];
  const screeningForm = screeningForms && screeningForms[0];

  const key =
    applicant && screeningForm
      ? [
          'GET /form-submissions/:formId/:applicantId',
          screeningForm.formId,
          applicantId,
        ]
      : null;
  const {data: submission} = useSWR(key, (_key, formId, applicantId) =>
    API.formSubmissions.find(formId, applicantId),
  );

  const {register, handleSubmit, errors, formState} = useForm({
    mode: 'onChange',
  });

  const onSubmit = (values: any) => {
    if (!screeningForm) return;
    const body = {
      ...(submission ? {formSubmissionId: submission.formSubmissionId} : {}),
      applicantId,
      formId: screeningForm.formId,
      submission: values,
    };

    const action = submission
      ? API.formSubmissions.update
      : API.formSubmissions.create;

    setStatus('submitting');
    action(body).then(() => {
      let txt = 'Assessment erfolgreich ';
      txt += submission ? 'bearbeitet' : 'hinzugefügt';

      toaster.success(txt);
      router.back();
    });
  };

  const formFields = screeningForm?.formFields.map((item) => {
    const Component = stringToComponent(item.component);
    // destructure to avoid passing unnecessary props to component
    const {
      defaultValue,
      formFieldId,
      jobRequirementId,
      deletable,
      editable,
      rowIndex,
      formId,
      ...props
    } = item;

    const _defaultValue =
      submission?.submission[item.formFieldId] || defaultValue || '';

    if (item.component === 'checkbox') {
      return (
        <Component
          ref={register({
            ...(item.required
              ? {required: 'Dieses Feld ist verpflichtend'}
              : {}),
          })}
          errors={errorsFor(errors, item.formFieldId)}
          key={item.formFieldId}
          name={item.formFieldId}
          defaultValue={(_defaultValue as string)?.split(',')}
          {...props}
        />
      );
    }

    return (
      <Component
        ref={register({
          ...(item.required ? {required: 'Dieses Feld ist verpflichtend'} : {}),
        })}
        errors={errorsFor(errors, item.formFieldId)}
        key={item.formFieldId}
        name={item.formFieldId}
        defaultValue={_defaultValue}
        {...props}
      />
    );
  });

  return (
    <Box display="grid" gridRowGap={spacing.scale600}>
      <section>
        <Flexgrid
          flexGap={spacing.scale200}
          alignItems="center"
          marginBottom={spacing.scale200}
        >
          <H6>Bewerber*innendaten</H6>
          {currentUser?.userRole === 'admin' && (
            <Edit
              style={{cursor: 'pointer'}}
              onClick={() =>
                router.push(`/dashboard/applicants/${applicantId}/edit`)
              }
            />
          )}
        </Flexgrid>
        <Table style={{width: 'auto'}}>
          <tbody>
            <tr>
              <td>Beworben am</td>
              <td>{new Date(applicant?.createdAt || '').toLocaleString()}</td>
            </tr>
            {applicant?.attributes.map((attr, idx) => (
              <tr key={idx}>
                <td style={{borderRight: '1px solid ' + colors.inputBorder}}>
                  {attr.key}
                </td>
                <td>{attr.value.toString()}</td>
              </tr>
            ))}
            {applicant?.files?.map((file, idx) => (
              <tr key={idx}>
                <td>
                  <a
                    href={file.value}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {file.key}
                  </a>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          onClick={() => setShowScreeningForm((curr) => !curr)}
          style={{cursor: 'pointer'}}
        >
          <Flexgrid alignItems="center" flexGap={spacing.scale100}>
            <H6>Screening-Formular</H6>
            <Arrow
              height={spacing.scale300}
              style={{
                transform: `rotate(${showScreeningForm ? '90deg' : '-90deg'})`,
              }}
            />
          </Flexgrid>
        </div>
        {showScreeningForm && (
          <Box
            display="grid"
            gridRowGap={spacing.scale400}
            paddingTop={spacing.scale100}
          >
            {formFields}
            {formFields?.length && (
              <Box marginTop={spacing.scale200}>
                <Button
                  type="submit"
                  isLoading={status === 'submitting'}
                  disabled={!formState.isValid}
                >
                  Speichern
                </Button>
              </Box>
            )}
            {!formFields?.length && 'Kein Screeningformular vorhanden'}
          </Box>
        )}
      </form>
      <section>
        <H6>Assessment-Formulare</H6>
        <DataTable
          data={forms.assessment || []}
          columns={[
            {
              title: 'Formular',
              cell: (row) => (
                <Link
                  href={`/dashboard/applicants/${applicant?.applicantId}/assessment?formId=${row.formId}`}
                >
                  <a>{row.formTitle}</a>
                </Link>
              ),
            },
          ]}
        />
      </section>
      <section>
        <H6>Onboarding-Formulare</H6>
        <DataTable
          data={forms.onboarding || []}
          columns={[
            {
              title: 'Formular',
              cell: (row) => (
                <Link
                  href={`/dashboard/applicants/${applicant?.applicantId}/assessment?formId=${row.formId}`}
                >
                  <a>{row.formTitle}</a>
                </Link>
              ),
            },
          ]}
        />
      </section>
    </Box>
  );
};

ApplicantDetails.getLayout = getDashboardLayout;

export default withAuth(ApplicantDetails);
