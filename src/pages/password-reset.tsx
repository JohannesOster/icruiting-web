import React, {useState, useRef} from 'react';
import {Auth} from 'aws-amplify';
import {useRouter} from 'next/router';
import {EmailForm, PasswordForm, PasswordFormValues} from 'containers';
import {useTheme} from 'styled-components';
import {useToaster} from 'icruiting-ui';

const PasswordReset: React.FC = () => {
  const router = useRouter();
  const toaster = useToaster();
  const [sentCode, setSentCode] = useState<boolean>(false);
  const email = useRef<string>('');
  const {spacing} = useTheme();

  const submitMailForm = async (values: {email: string}) => {
    await Auth.forgotPassword(values.email)
      .then(() => {
        email.current = values.email;
        setSentCode(true);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const submitCodeForm = async (values: PasswordFormValues) => {
    await Auth.forgotPasswordSubmit(
      email.current,
      values.confirmationCode.toString(),
      values.password,
    )
      .then(() => {
        toaster.success('Password erfolgreich geändert!');
        router.back();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <main style={{margin: spacing.scale500}}>
      {!sentCode ? (
        <EmailForm onSubmit={submitMailForm} />
      ) : (
        <PasswordForm onSubmit={submitCodeForm} email={email.current} />
      )}
    </main>
  );
};

export default PasswordReset;
