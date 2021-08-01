import React, {useEffect, useState} from 'react';
import {Spinner} from 'components';
import {useAuth} from 'context';
import {useRouter} from 'next/router';
import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import config from 'config';

const Login: React.FC = () => {
  const {refetchUser, currentUser} = useAuth();
  const router = useRouter();
  const {code} = router.query;

  useEffect(() => {
    if (currentUser) router.replace('/dashboard');
  }, [currentUser]);

  const signInUsingAccessCode = (code) => {
    if (!code) return;
    if (code[code.length] === '#') code = code.slice(0, -1);

    const url = config.userPoolDomain + '/oauth2/token';

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', '3n7mi9c40kr8sp0tuoo6udvfi0');
    body.append('code', code);
    body.append('redirect_uri', 'http://localhost:3000/login/callback/');

    fetch(url, {method: 'POST', headers, body, redirect: 'follow'})
      .then((response) => response.json())
      .then(({id_token, access_token, refresh_token}) => {
        const userPool = new CognitoUserPool({
          UserPoolId: config.userPoolId,
          ClientId: config.userPoolWebClientId,
        });

        const cognitoIdToken = new CognitoIdToken({
          IdToken: id_token,
        });
        const cognitoAccessToken = new CognitoAccessToken({
          AccessToken: access_token,
        });
        const cognitoRefreshToken = new CognitoRefreshToken({
          RefreshToken: refresh_token,
        });

        const username = cognitoIdToken.payload.sub;
        const user = new CognitoUser({Pool: userPool, Username: username});
        user.setSignInUserSession(
          new CognitoUserSession({
            AccessToken: cognitoAccessToken,
            IdToken: cognitoIdToken,
            RefreshToken: cognitoRefreshToken,
          }),
        );
      })
      .then(() => {
        refetchUser();
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (!code) return;
    signInUsingAccessCode(code);
  }, [code]);

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Spinner />
    </div>
  );
};

export default Login;
