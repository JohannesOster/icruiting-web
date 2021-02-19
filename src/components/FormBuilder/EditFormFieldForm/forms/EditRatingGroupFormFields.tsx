import React from 'react';
import {Box, H6} from 'components';
import {Button, Checkbox, Input, Select, Textarea} from 'icruiting-ui';
import {useForm, useFieldArray} from 'react-hook-form';
import {errorsFor} from 'lib/react-hook-form-errors-for';
import {yupResolver} from '@hookform/resolvers';
import {object, array, string, mixed, number} from 'yup';
import {Form} from './StyledForm.sc';
import {Trash} from 'icons';
import {useTheme} from 'styled-components';
import {FormFieldIntent} from 'services';

type FormValues = {
  label: string;
  description: string;
  options: Array<{label: string; value: string}>;
  intent: FormFieldIntent;
  required: boolean;
  defaultValue?: string;
};

type Props = {
  /** Submit handler for the form */
  onSubmit: (values: FormValues) => void;
} & FormValues;

export const EditRatingGroupFormFields: React.FC<Props> = ({
  onSubmit,
  ...formValues
}) => {
  const {
    register,
    formState,
    errors,
    handleSubmit,
    control,
  } = useForm<FormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: formValues,
    resolver: yupResolver(
      object({
        label: string().required('Label ist verpflichtend'),
        defaultValue: mixed().transform((val) => (val ? val : null)),
        options: array().of(
          object({
            label: string().required(
              'Option ist verpflichtend auszufüllen oder zu löschen',
            ),
            value: string()
              .typeError('Option ist verpflichtend auszufüllen oder zu löschen')
              .transform((val) => +val),
          }),
        ),
      }),
    ),
  });
  const {spacing} = useTheme();

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'options',
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
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
        name="intent"
        label="Intent"
        ref={register}
        options={[
          {label: 'count_distinct', value: FormFieldIntent.countDistinct},
          {label: 'sum_up', value: FormFieldIntent.sumUp},
        ]}
      />
      <Select
        name="defaultValue"
        label="Default"
        ref={register}
        defaultValue={'default'}
        options={[
          {label: undefined, value: null},
          ...fields.map(({label, value}) => ({
            label,
            value,
          })),
        ]}
      />
      <H6 style={{marginBottom: `-${spacing.scale200}`}}>
        Optionen (Label, Wert)
      </H6>
      {fields.map((option, idx) => {
        return (
          <Box
            display="grid"
            gridAutoFlow="column"
            gridTemplateColumns="1fr 1fr 30px"
            alignItems="center"
            columnGap={spacing.scale200}
            key={option.id}
          >
            <Input
              name={`options[${idx}].label`}
              placeholder="Label"
              defaultValue={option.label}
              ref={register()}
              errors={errorsFor(errors, `options[${idx}].label`)}
            />
            <Input
              name={`options[${idx}].value`}
              placeholder="Wert"
              defaultValue={option.value}
              ref={register()}
              type="number"
              errors={errorsFor(errors, `options[${idx}].value`)}
            />

            {/* There must be at least 2 options */}
            {idx > 1 && <Trash onClick={() => remove(idx)} />}
          </Box>
        );
      })}
      <div>
        <Button onClick={() => append({label: '', value: ''})}>
          Neues Item
        </Button>
      </div>
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
