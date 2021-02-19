import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import styled from 'styled-components';
import {Button, useToaster} from 'icruiting-ui';
import useSWR from 'swr';
import {H3, Box, getDashboardLayout} from 'components';
import {API, TForm} from 'services';
import {useRouter} from 'next/router';
import {withAuth} from 'components';
import {stringToComponent} from 'lib/form-builder-utils';
import {errorsFor} from 'lib/utility';

const Form = styled.form`
  display: grid;
  row-gap: ${({theme}) => theme.spacing.scale400};
`;

const ApplicantAssessment = () => {
  const toaster = useToaster();
  const router = useRouter();
  const {applicantId, formId} = router.query as {
    applicantId: string;
    formId: string;
  };
  const [status, setStatus] = useState('idle');
  const {data: applicant} = useSWR(
    ['GET /applicants/:applicantId', applicantId],
    (_key, applicantId) => API.applicants.find(applicantId),
  );
  const key = applicant
    ? ['GET /form-submissions/:formId/:applicantId', formId, applicantId]
    : null;
  const {data: submission} = useSWR(key, (_key, formId, applicantId) =>
    API.formSubmissions.find(formId, applicantId),
  );

  const formsKey = applicant ? ['GET /forms', applicant.jobId] : null;
  const [form, setForm] = useState<TForm | undefined>(undefined);
  const {data} = useSWR(formsKey, (_key, jobId) => API.forms.list(jobId));

  useEffect(() => {
    if (!data) return;
    const _form = data.find((form) => form.formId === formId);
    setForm(_form);
  }, [data, formId]);

  const {register, handleSubmit, errors, formState} = useForm({
    mode: 'onChange',
  });

  const onSubmit = (values: any) => {
    const body = {
      ...(submission ? {formSubmissionId: submission.formSubmissionId} : {}),
      formId,
      applicantId: applicantId,
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
  const formFields = form?.formFields.map((item) => {
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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <H3>
        {applicant?.name}: {form?.formTitle}
      </H3>
      {formFields}
      <Box marginTop={20}>
        <Button
          type="submit"
          isLoading={status === 'submitting'}
          disabled={!formState.isValid}
        >
          Speichern
        </Button>
      </Box>
    </Form>
  );
};

ApplicantAssessment.getLayout = getDashboardLayout;

export default withAuth(ApplicantAssessment);
