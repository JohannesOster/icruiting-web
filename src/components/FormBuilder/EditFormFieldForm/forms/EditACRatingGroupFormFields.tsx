import React from 'react';
import {Box, H6} from 'components';
import {Button, Input, Textarea, Select, Checkbox} from 'icruiting-ui';
import {useForm, useFieldArray} from 'react-hook-form';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {yupResolver} from '@hookform/resolvers';
import {array, mixed, number, object, string} from 'yup';
import {Form} from './StyledForm.sc';
import {Trash} from 'icons';
import {useTheme} from 'styled-components';
import {FormFieldIntent} from 'services';

type FormValues = {
  label: string;
  description: string;
  /** The id of the jobRequirement the rating group should refer to */
  jobRequirementOptions: {label: string; value: string}[];
  /** The currently selected JobRequirementId */
  jobRequirementId: string;
  options: {label: string; value: string}[];
  intent: FormFieldIntent;
  required: boolean;
  defaultValue?: string;
};

type Props = {
  /** Submit handler for the form */
  onSubmit: (values: FormValues) => void;
} & FormValues;

export const EditACRatingGroupFormFields: React.FC<Props> = ({
  onSubmit,
  jobRequirementOptions,
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
        options: array().of(
          object({
            label: string().required(
              'Option ist verpflichtend auszufüllen oder zu löschen',
            ),
            value: mixed().test(
              'testOptionValue',
              'Geben sie einen eindeutigen Zahlenwert an!',
              (val) => /^\d+$/.test(val) && !!val.length,
            ),
          }),
        ),
        defaultValue: mixed().transform((val) => (val ? val : null)),
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
      <Select
        name="jobRequirementId"
        label="Anforderung"
        ref={register}
        options={jobRequirementOptions}
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
        label="Absicht"
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
              type="number"
              ref={register()}
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
