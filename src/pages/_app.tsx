import React, {useEffect} from 'react';
import {theme} from 'theme';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import Amplify from 'aws-amplify';
import config from 'amplify.config';
import {AuthProvider, useAuth} from 'context';
import {Box, Navbar, Spinner} from 'components';
import {ToasterProvider} from 'context';

import 'styles/normalize.css';
import 'styles/reset.locals.css';
import 'styles/typography.css';
import {useRouter} from 'next/router';

Amplify.configure({...config, ssr: true});

const GlobalStyles = createGlobalStyle`
  body {
    ${({theme}) => theme.typography.body};
    color: ${({theme}) => theme.colors.textDefault};
  };
`;

const App = ({Component, pageProps}) => {
  const {isAuthenticating} = useAuth();
  const router = useRouter();

  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <Navbar />
        {page}
      </>
    ));

  useEffect(() => {
    if (typeof window !== 'undefined' && window.analytics) {
      const handleRouteChange = () => {
        analytics.page();
      };

      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <ToasterProvider>
        <GlobalStyles />
        {/* <Navbar /> */}
        {isAuthenticating ? (
          <Box
            height="100vh"
            width="100vw"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </Box>
        ) : (
          getLayout(<Component {...pageProps} />)
        )}
      </ToasterProvider>
    </ThemeProvider>
  );
};

const AuthWrapper = (props) => {
  return (
    <AuthProvider>
      <App {...props} />
    </AuthProvider>
  );
};

export default AuthWrapper;
