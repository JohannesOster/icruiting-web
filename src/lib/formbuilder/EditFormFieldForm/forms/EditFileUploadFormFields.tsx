import React from 'react';
import {Input, Button, Textarea, Select, Checkbox} from 'icruiting-ui';
import {useForm} from 'react-hook-form';
import {errorsFor} from 'utils/reactHookFormHelper';
import * as yup from 'yup';
import {Form} from './StyledForm.sc';
import {yupResolver} from '@hookform/resolvers';

type FormValues = {
  label: string;
  description: string;
  accept: string;
  required?: boolean;
};

type Props = {
  /** Submit handler for the form */
  onSubmit: (values: FormValues) => void;
} & FormValues;

export const EditFileUploadFormFields: React.FC<Props> = ({
  onSubmit,
  ...formValues
}) => {
  const {register, formState, errors, handleSubmit} = useForm<FormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: formValues,
    resolver: yupResolver(
      yup.object().shape({
        label: yup.string().required('Label ist verpflichtend'),
        //accept: yup.string().required('Accept is required'),
        description: yup.string(),
      }),
    ),
  });

  const acceptMap = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
  };

  const acceptOptions = Object.entries(acceptMap).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="label"
        label="Label"
        placeholder="Label"
        ref={register}
        errors={errorsFor(errors, 'label')}
      />
      <Textarea
        name="description"
        label="Beschreibung"
        placeholder="Beschreibung"
        ref={register}
        errors={errorsFor(errors, 'description')}
      />
      <Select
        name="accept"
        label="Accept"
        options={acceptOptions}
        ref={register}
        errors={errorsFor(errors, 'description')}
      />
      <Checkbox
        name="required"
        ref={register}
        options={[{label: 'Verpflichtend', value: 'required'}]}
      />
      <div>
        <Button disabled={!formState.isValid} type="submit">
          Speichern
        </Button>
      </div>
    </Form>
  );
};
