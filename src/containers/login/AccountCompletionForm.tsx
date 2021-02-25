import React from 'react';
import {Button, Input} from 'icruiting-ui';
import {AuthForm} from 'components';
import {useForm} from 'react-hook-form';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {yupResolver} from '@hookform/resolvers';
import {password, passwordConfirm} from 'utils/form-validation';
import {object} from 'yup';

export type AccountCompletionValues = {
  password: string;
};

type Props = {
  onSubmit: (values: AccountCompletionValues) => void;
};

export const AccountCompletionForm: React.FC<Props> = ({onSubmit}) => {
  const {
    register,
    errors,
    formState,
    handleSubmit,
  } = useForm<AccountCompletionValues>({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: yupResolver(object({password, passwordConfirm})),
  });

  return (
    <AuthForm
      title="Neues Passwort erstellen"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Passwort"
        placeholder="Passwort"
        type="password"
        name="password"
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
      <div style={{marginLeft: 'auto'}}>
        <Button
          disabled={
            !formState.isValid || !Object.keys(formState.touched).length
          }
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Bestätigen
        </Button>
      </div>
    </AuthForm>
  );
};
