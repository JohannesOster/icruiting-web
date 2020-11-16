import React from 'react';
import {Box, H6} from 'components';
import {Button, Input, Textarea} from 'icruiting-ui';
import {useForm, useFieldArray} from 'react-hook-form';
import {errorsFor} from 'utils/reactHookFormHelper';
import {yupResolver} from '@hookform/resolvers';
import * as yup from 'yup';
import {Form} from './StyledForm.sc';
import {Trash} from 'icons';
import {useTheme} from 'styled-components';

type FormValues = {
  label: string;
  description: string;
  options: Array<{label: string; value: string}>;
};

type Props = {
  /** Submit handler for the form */
  onSubmit: (values: FormValues) => void;
} & FormValues;

export const EditRatingGroupFormFields: React.FC<Props> = ({
  onSubmit,
  ...formValues
}) => {
  const {register, formState, errors, handleSubmit, control} = useForm<
    FormValues
  >({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: formValues,
    resolver: yupResolver(
      yup.object().shape({
        label: yup.string().required('Label ist verpflichtend'),
        options: yup.array().of(
          yup.object().shape({
            label: yup
              .string()
              .required('Option ist verpflichtend auszufüllen oder zu löschen'),
          }),
        ),
        description: yup.string(),
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
      <div>
        <Button disabled={!formState.isValid} type="submit">
          Speichern
        </Button>
      </div>
    </Form>
  );
};
