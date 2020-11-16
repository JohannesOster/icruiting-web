import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';
import {
  LoginForm,
  LoginFormValues,
  AccountCompletionForm,
  AccountCompletionValues,
} from 'containers';
import {useAuth} from 'context';
import {useToaster} from 'icruiting-ui';
import {useRouter} from 'next/router';

const Login: React.FC = () => {
  const {refetchUser, currentUser} = useAuth();
  const toaster = useToaster();
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginFormValues | null>(null);

  useEffect(() => {
    if (currentUser) router.replace('/dashboard');
  }, [currentUser]);

  const handleLoginFormSubmit = async ({email, password}: LoginFormValues) => {
    await Auth.signIn(email, password)
      .then((user) => {
        // if admin creates new user he has to reset his password
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          /* save credentials for later since account completion submit
           * has to re-sign in user */
          setCredentials({email: email, password: password});
          return;
        }
        // if it isn't a new user go on to landingpage
        refetchUser();
      })
      .catch((error) => {
        toaster.danger(error.message);
      });
  };

  const handleAccountCompletionFormSubmit = async ({
    password: newPassword,
  }: AccountCompletionValues) => {
    if (!credentials?.email || !credentials.password) return;
    await Auth.signIn(credentials?.email, credentials?.password)
      .then(async (user) => {
        await Auth.completeNewPassword(user, newPassword)
          .then(() => refetchUser())
          .catch((err) => {
            throw err; // rethrow err to be catched beneath
          });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return credentials ? (
    <AccountCompletionForm onSubmit={handleAccountCompletionFormSubmit} />
  ) : (
    <LoginForm onSubmit={handleLoginFormSubmit} />
  );
};

export default Login;
