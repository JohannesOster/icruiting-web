import React from 'react';
import {Button, Input} from 'icruiting-ui';
import {AuthForm, Typography} from 'components';
import Link from 'next/link';
import {signUpFormSchema} from 'utils/validationSchemas';
import {useForm} from 'react-hook-form';
import {errorsFor} from 'utils/reactHookFormHelper';
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
      resolver: yupResolver(signUpFormSchema),
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
        ref={register}
        errors={errorsFor(errors, 'tenantName')}
        required
      />
      <Input
        type="email"
        name="email"
        label="Email-Mail-Addresse"
        placeholder="E-Mail-Addresse"
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
          marginTop: spacing.scale400,
          justifyContent: 'space-between',
          columnGap: spacing.scale100,
        }}
      >
        <Typography kind="secondary">
          <span style={{marginRight: spacing.scale100}}>
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