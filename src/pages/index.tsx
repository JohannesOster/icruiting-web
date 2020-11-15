import React from 'react';
import {useTheme} from 'styled-components';
import {Container, Footer} from './index.sc';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {Button} from 'icruiting-ui';
import {IcruitingLogo, Bunny} from 'icons';
import {Box, Typography} from 'components';

const LandingPage: React.FC = () => {
  const {spacing} = useTheme();
  const router = useRouter();

  return (
    <>
      <Container>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          textAlign="center"
          justifyContent="center"
          gridRowGap={spacing.scale600}
          alignItems="center"
        >
          <Box display="flex" flexDirection="column">
            <IcruitingLogo style={{margin: 0, width: '90vw'}} />
            <Typography style={{textTransform: 'uppercase', marginTop: -15}}>
              Recruit For Fit
            </Typography>
          </Box>
          <Box marginTop={spacing.scale300}>
            <Button onClick={() => router.push('/signup')}>
              Jetzt Registrieren
            </Button>
          </Box>
        </Box>
        <Footer style={{position: 'relative'}}>
          <Bunny
            style={{
              position: 'absolute',
              top: '-25px',
              right: spacing.scale400,
              transform: 'scaleX(-1)',
              height: '25px',
              width: 'auto',
            }}
          />
          <Link href="/">icruiting.at</Link>
          <Box
            display="grid"
            gridAutoFlow="column"
            columnGap={spacing.scale200}
          >
            <Link href="/impressum">Impressum</Link>
            <span>&bull;</span>
            <Link href="/privacy">Datenschutzerklärung</Link>
          </Box>
        </Footer>
      </Container>
    </>
  );
};

export default LandingPage;
