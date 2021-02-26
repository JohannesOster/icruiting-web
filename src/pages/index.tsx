import React from 'react';
import {useTheme} from 'styled-components';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {Button} from 'components';
import {IcruitingLogo, Bunny} from 'icons';
import {Box, Typography} from 'components';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 75px); // 75px = navbarheight
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: ${({theme}) => theme.spacing.scale400};
  color: ${({theme}) => theme.colors.typographySecondary};
  border-top: 1px solid;
  border-color: ${({theme}) => theme.colors.inputBorder};
  ${({theme}) => theme.typography.font200};

  @media (max-width: 440px) {
    display: block;
  }
`;

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
            <IcruitingLogo style={{width: '90vw'}} />
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
          <Link href="/">
            <a>icruiting.at</a>
          </Link>
          <Box
            display="grid"
            gridAutoFlow="column"
            columnGap={spacing.scale200}
          >
            <Link href="/impressum">
              <a>Impressum</a>
            </Link>
            <span>&bull;</span>
            <Link href="/privacy">
              <a>Datenschutzerklärung</a>
            </Link>
          </Box>
        </Footer>
      </Container>
    </>
  );
};

export default LandingPage;
