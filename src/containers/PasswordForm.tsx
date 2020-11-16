import React from 'react';
import {useForm} from 'react-hook-form';
import {Button, Input} from 'icruiting-ui';
import {AuthForm, Typography} from 'components';
import {passwordResetSchema} from 'utils/validationSchemas';
import {errorsFor} from 'utils/reactHookFormHelper';
import {yupResolver} from '@hookform/resolvers';

export type PasswordFormValues = {
  confirmationCode: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type Props = {
  onSubmit: (values: PasswordFormValues) => void;
  email: string;
};

export const PasswordForm: React.FC<Props> = ({onSubmit, email}) => {
  const {register, errors, formState, handleSubmit} = useForm<
    PasswordFormValues
  >({
    mode: 'onChange',
    resolver: yupResolver(passwordResetSchema),
    criteriaMode: 'all',
  });

  return (
    <AuthForm title="Bestätigenscode" onSubmit={handleSubmit(onSubmit)}>
      <Typography style={{opacity: 0.7}}>
        Wir haben den Bestätigenscode {email} gesendet.
        <br />
        (Kontrollieren Sie auch den Spam-Ordner)
      </Typography>
      <Input
        autoFocus
        label="Bestätigenscode"
        placeholder="Bestätigenscode"
        type="text"
        name="confirmationCode"
        ref={register}
        errors={errorsFor(errors, 'confirmationCode')}
      />
      <Input
        type="password"
        name="password"
        label="Passwort"
        placeholder="Passwort"
        ref={register}
        errors={errorsFor(errors, 'password')}
      />
      <Input
        type="password"
        name="passwordConfirm"
        label="Passwort bestätigen"
        placeholder="Passwort bestätigen"
        ref={register}
        errors={errorsFor(errors, 'passwordConfirm')}
      />
      <span style={{margin: '0 auto'}}>
        <Button
          disabled={
            !formState.isValid || !Object.keys(formState.touched).length
          }
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Password zurücksetzen
        </Button>
      </span>
    </AuthForm>
  );
};
