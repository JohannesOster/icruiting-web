import React, {FC} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {errorsFor} from 'utils/reactHookFormHelper';
import {useTheme} from 'styled-components';
import * as yup from 'yup';
import {H6, Box} from 'components';
import {Button, Input, Textarea, Checkbox} from 'icruiting-ui';
import {Form} from '../StyledForm.sc';
import {yupResolver} from '@hookform/resolvers';
import {DnDOptionContainer} from './DnDOptionContainer';

type FormValues = {
  label: string;
  description: string;
  options: Array<{label: string; value: string}>;
  required?: boolean;
};

type Props = {
  /** Submit handler for the form */
  onSubmit: (values: FormValues) => void;
  acceptEmptyOption?: boolean;
} & FormValues;

export const EditOptionsFormFields: FC<Props> = ({
  onSubmit,
  acceptEmptyOption = false,
  ...formValues
}) => {
  const {register, errors, control, handleSubmit, formState} = useForm<
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
            ...(!acceptEmptyOption
              ? {
                  label: yup
                    .string()
                    .required(
                      'Option ist verpflichtend auszufüllen oder zu löschen',
                    ),
                }
              : {label: yup.string()}),
          }),
        ),
        description: yup.string(),
      }),
    ),
  });
  const {spacing} = useTheme();

  const {fields, append, remove, move} = useFieldArray({
    control,
    name: 'options',
  });

  const _onSubmit = (values: FormValues) => {
    // Add missing "value" to option
    values.options = values.options.map((option) => ({
      ...option,
      value: option.label,
    }));
    onSubmit(values);
  };

  return (
    <Form onSubmit={handleSubmit(_onSubmit)}>
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
      <Checkbox
        name="required"
        ref={register}
        options={[{label: 'Verpflichtend', value: 'required'}]}
      />
      <H6 style={{marginBottom: `-${spacing.scale200}`}}>Optionen</H6>
      <Box display="grid" rowGap={spacing.scale400}>
        {fields.map((option, idx) => {
          return (
            <DnDOptionContainer
              key={option.id}
              index={idx}
              move={move}
              onDelete={idx > 1 ? remove : undefined}
            >
              <Box flex={1}>
                <Input
                  name={`options[${idx}].label`}
                  placeholder="Item"
                  defaultValue={option.value}
                  ref={register()}
                  errors={errorsFor(errors, `options[${idx}].label`)}
                />
              </Box>
            </DnDOptionContainer>
          );
        })}
      </Box>
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
