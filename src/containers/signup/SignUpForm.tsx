import React from 'react';
import {Button, Input} from 'components';
import {AuthForm, Typography} from 'components';
import Link from 'next/link';
import {
  tenantName,
  email,
  password,
  passwordConfirm,
} from 'utils/form-validation';
import {object} from 'yup';
import {useForm} from 'react-hook-form';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {yupResolver} from '@hookform/resolvers';
import {useTheme} from 'styled-components';

export type SignUpFormValues = {
  tenantName: string;
  email: string;
  password: string;
};

type Props = {
  onSubmit: (values: SignUpFormValues) => void;
  submitting: boolean;
};

export const SignUpForm: React.FC<Props> = ({onSubmit, submitting}) => {
  const {spacing} = useTheme();
  const {register, errors, formState, handleSubmit} = useForm<SignUpFormValues>(
    {
      mode: 'onChange',
      resolver: yupResolver(
        object({tenantName, email, password, passwordConfirm}),
      ),
      criteriaMode: 'all',
    },
  );

  return (
    <AuthForm title="Registrieren" onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoFocus
        name="tenantName"
        label="Tenantname"
        placeholder="Tenantname"
        description="Der Name deiner Organisation, deiner Abteilung, deines Teams, etc. Er erscheint unteranderem in der Bewerbungsbestätigungs-E-mail"
        ref={register}
        errors={errorsFor(errors, 'tenantName')}
        required
      />
      <Input
        type="email"
        name="email"
        label="Email-Mail-Addresse"
        placeholder="E-Mail-Adresse"
        ref={register}
        errors={errorsFor(errors, 'email')}
        required
      />
      <Input
        type="password"
        name="password"
        label="Passwort"
        placeholder="Passwort"
        ref={register}
        errors={errorsFor(errors, 'password')}
        required
      />
      <Input
        type="password"
        name="passwordConfirm"
        label="Passwort bestätigen"
        placeholder="Passwort bestätigen"
        ref={register}
        errors={errorsFor(errors, 'passwordConfirm')}
        required
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: spacing.scale500,
          justifyContent: 'space-between',
          columnGap: spacing.scale200,
        }}
      >
        <Typography kind="secondary">
          <span style={{marginRight: spacing.scale200}}>
            Bereits einen Account?
          </span>
          <Link href="/login">Anmelden</Link>
        </Typography>
        <Button
          disabled={
            !formState.isValid || !Object.keys(formState.touched).length
          }
          isLoading={submitting}
          type="submit"
        >
          Registrieren
        </Button>
      </div>
    </AuthForm>
  );
};
