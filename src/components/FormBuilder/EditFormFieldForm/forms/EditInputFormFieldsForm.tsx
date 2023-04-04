import React from 'react';
import {Button, Input, Textarea, Checkbox} from 'components';
import {useForm} from 'react-hook-form';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {object, string} from 'yup';
import {Form} from './StyledForm.sc';
import {yupResolver} from '@hookform/resolvers';

type FormValues = {
  label: string;
  placeholder?: string;
  type: string;
  description: string;
  required?: boolean;
};

type Props = {
  /** Submit handler for the form */
  onSubmit: (values: FormValues) => void;
} & FormValues;

export const EditInputFormFieldsForm: React.FC<Props> = ({onSubmit, ...formValues}) => {
  const {register, formState, errors, handleSubmit, trigger, control} = useForm<FormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: formValues,
    resolver: yupResolver(
      object({
        label: string().required('Label ist verpflichtend'),
        type: string().required('Typ ist verpflichtend'),
      }),
    ),
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="label"
        label="Label"
        placeholder="Label"
        ref={register}
        errors={errorsFor(errors, 'label')}
      />
      {formValues.type !== 'date' && (
        <Input
          name="placeholder"
          label="Placeholder"
          placeholder="Placeholder"
          ref={register}
          errors={errorsFor(errors, 'placeholder')}
        />
      )}
      <Textarea
        name="description"
        label="Beschreibung"
        placeholder="Beschreibung"
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
