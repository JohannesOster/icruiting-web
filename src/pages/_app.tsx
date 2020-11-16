import {theme} from 'theme';
import {ThemeProvider} from 'styled-components';
import Amplify from 'aws-amplify';
import config from 'amplify.config';
import {AuthProvider, useAuth} from 'context';
import {Box, Navbar} from 'components';
import {Spinner, ToasterProvider} from 'icruiting-ui';

import 'styles/normalize.css';
import 'styles/reset.locals.css';
import 'styles/typography.css';

Amplify.configure({...config, ssr: true});

const App = ({Component, pageProps}) => {
  const {isAuthenticating} = useAuth();

  const getLayout = Component.getLayout || ((page) => <>{page}</>);

  return (
    <ThemeProvider theme={theme}>
      <ToasterProvider>
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
          <>
            <Navbar />
            {getLayout(<Component {...pageProps} />)}
          </>
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
