import React, {useEffect} from 'react';
import {theme} from 'theme';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import Amplify from 'aws-amplify';
import config from 'amplify.config';
import {AuthProvider, useAuth} from 'context';
import {Box, Navbar, Spinner} from 'components';
import {ToasterProvider} from 'context';
import Script from 'next/script';

import 'styles/normalize.css';
import 'styles/reset.locals.css';
import 'styles/typography.css';
import {useRouter} from 'next/router';

const SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITEKEY;
const segmentSnippet = `
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="Bpx2QBme6YNuqO7zAFHvdl1lup709Nfj";;analytics.SNIPPET_VERSION="4.15.3";
  analytics.load(${SEGMENT_WRITE_KEY});
  analytics.page();
  }}();
`;

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
        <Script
          id="segment-snippet"
          dangerouslySetInnerHTML={{__html: segmentSnippet}}
          strategy="lazyOnload"
        />
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
