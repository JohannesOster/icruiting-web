import React from 'react';
import {emailSchema} from 'utils/validationSchemas';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {Button, Input} from 'icruiting-ui';
import {AuthForm} from 'components';
import {errorsFor} from 'utils/reactHookFormHelper';
import {yupResolver} from '@hookform/resolvers';

type EmailFormValues = {
  email: string;
};

type Props = {
  onSubmit: (values: EmailFormValues) => void;
};

export const EmailForm: React.FC<Props> = ({onSubmit}) => {
  const {register, errors, formState, handleSubmit} = useForm<EmailFormValues>({
    mode: 'onChange',
    resolver: yupResolver(yup.object().shape({email: emailSchema})),
    criteriaMode: 'all',
  });

  return (
    <AuthForm title="Password Reset" onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoFocus
        label="E-Mail-Addresse"
        placeholder="E-Mail-Addresse"
        type="email"
        name="email"
        ref={register}
        errors={errorsFor(errors, 'email')}
      />
      <span style={{margin: '0 auto'}}>
        <Button
          disabled={
            !formState.isValid || !Object.keys(formState.touched).length
          }
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Code Senden
        </Button>
      </span>
    </AuthForm>
  );
};
