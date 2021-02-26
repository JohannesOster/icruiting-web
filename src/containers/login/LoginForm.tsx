import React from 'react';
import {Button, Input} from 'components';
import {AuthForm, Typography} from 'components';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {email} from 'utils/form-validation';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {useTheme} from 'styled-components';
import {yupResolver} from '@hookform/resolvers';
import {object, string} from 'yup';

export type LoginFormValues = {
  email: string;
  password: string;
};

type Props = {
  onSubmit: (values: LoginFormValues) => void;
};

export const LoginForm: React.FC<Props> = ({onSubmit}) => {
  const {spacing} = useTheme();
  const {register, errors, formState, handleSubmit} = useForm<LoginFormValues>({
    mode: 'onChange',
    resolver: yupResolver(
      object({
        email,
        password: string().required('Passwort ist verpflichtend.'),
      }),
    ),
    criteriaMode: 'all',
  });

  return (
    <AuthForm title="Anmelden" onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoFocus
        label="E-Mail-Adresse"
        placeholder="E-Mail-Adresse"
        type="email"
        name="email"
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
      <Typography kind="secondary">
        <span style={{marginRight: spacing.scale100}}>Passwort vergessen?</span>
        <Link href="/password-reset">
          <a>Passwort zurücksetzen?</a>
        </Link>
      </Typography>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: spacing.scale400,
          justifyContent: 'space-between',
          columnGap: spacing.scale100,
        }}
      >
        <Typography kind="secondary">
          <span style={{marginRight: spacing.scale100}}>
            Noch keinen Account?
          </span>
          <Link href="/signup">
            <a>Registrieren</a>
          </Link>
        </Typography>
        <Button
          disabled={
            !formState.isValid || !Object.keys(formState.touched).length
          }
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Anmelden
        </Button>
      </div>
    </AuthForm>
  );
};
