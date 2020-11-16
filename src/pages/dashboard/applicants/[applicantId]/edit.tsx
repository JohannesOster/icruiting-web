import React, {useCallback, useEffect, useState} from 'react';
import {Button} from 'icruiting-ui';
import {useTheme} from 'styled-components';
import {useForm} from 'react-hook-form';
import config from 'amplify.config';
import {Auth} from 'aws-amplify';
import useSWR from 'swr';
import {API, TForm} from 'services';
import {H3, Box, Flexgrid, getDashboardLayout} from 'components';
import {stringToComponent} from 'lib/form-builder-utils';
import {useToaster} from 'icruiting-ui';
import {withAdmin} from 'requireAuth';
import {useRouter} from 'next/router';

export const EditApplicant = () => {
  const {spacing} = useTheme();
  const toaster = useToaster();

  const router = useRouter();
  const {applicantId} = router.query as {applicantId: string};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {data: applicant} = useSWR(
    [`GET /applicants/${applicantId}`, applicantId],
    (_key, applicantId) => API.applicants.find(applicantId),
  );

  const formsKey = applicant ? [`GET /forms`, applicant.jobId] : null;
  const [form, setForm] = useState<TForm | undefined>(undefined);
  const {data} = useSWR(formsKey, (_key, jobId) => API.forms.list(jobId));

  useEffect(() => {
    if (!data) return;
    const _form = data.find(({jobId, formCategory}) => {
      return jobId === applicant?.jobId && formCategory === 'application';
    });
    setForm(_form);
  }, [data, applicant]);

  const {reset, register, getValues} = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const Form = form?.formFields.map((formField) => {
    const Component = stringToComponent(formField.component);
    const props = {
      ...formField.props,
      description: formField.description,
      label: formField.label,
      name: formField.formFieldId,
      placeholder: formField.placeholder,
      defaultValue: formField.defaultValue,
      options: formField.options,
      required: !!formField.required,
    };

    return <Component key={formField.formFieldId} {...props} ref={register} />;
  });

  const buildVals = useCallback(() => {
    if (!applicant || !form) return;

    return applicant.attributes.reduce((acc, {key, value}) => {
      const field = form.formFields.find(({label}) => label === key);
      if (!field) return acc;

      if (field.component === 'checkbox') {
        acc[field?.formFieldId] = value.split(',');
      } else acc[field?.formFieldId] = value;

      return acc;
    }, {} as any);
  }, [applicant, form]);

  useEffect(() => {
    if (!(applicant && form)) return;
    const vals = buildVals();
    reset(vals);
  }, [applicant, form, buildVals, reset]);

  const onSave = async () => {
    setIsSubmitting(true);
    const values = getValues();

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const str = (value as string[]).join(',');
        formData.append(key, str);
      } else if (typeof value === 'string') {
        formData.append(key, value as string);
      } else if (typeof value === 'object' /* = Filelist */) {
        const files = value as FileList;
        if (!files.length || !files[0]) return;
        const file = files[0];
        formData.append(key, file);
      }
    });

    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();

    const request = new XMLHttpRequest();
    request.open(
      'PUT',
      `${config.API.endpoints[0].endpoint}/applicants/${applicantId}`,
    );
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        setIsSubmitting(false);
        if (request.status !== 200) {
          alert(request.responseText);
          return;
        }
        toaster.success('Bewerber*in erfolgreich bearbeitet');
        router.back();
      }
    };
    request.send(formData);
  };

  return (
    <Box display="grid" rowGap={spacing.scale300}>
      <Flexgrid
        flexGap={spacing.scale200}
        justifyContent="space-between"
        marginBottom={spacing.scale200}
      >
        <H3>Bewerber*in bearbeiten</H3>
        <Box display="grid" gridAutoFlow="column" columnGap={spacing.scale400}>
          <Button isLoading={isSubmitting} onClick={onSave}>
            Speichern
          </Button>
          <Button onClick={() => router.back()}>Abbrechen</Button>
        </Box>
      </Flexgrid>
      {Form}
      <input
        hidden
        ref={register}
        value={form?.formId || ''}
        onChange={() => {}}
        name="formId"
      />
    </Box>
  );
};

EditApplicant.getLayout = getDashboardLayout;

export default withAdmin(EditApplicant);