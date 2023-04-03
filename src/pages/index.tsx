import React, {useRef, useState} from 'react';
import {useTheme} from 'styled-components';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  DisplayL,
  HeadingM,
  Input,
  Textarea,
  Typography,
} from 'components';
import {Bunny} from 'icons';
import {useForm} from 'react-hook-form';

import styled, {css} from 'styled-components';
import config from 'config';
import {useToaster} from 'context';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 75px); // 75px = navbarheight;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: ${({theme}) => theme.spacing.scale500};
  color: ${({theme}) => theme.colors.typographySecondary};
  border-top: 1px solid;
  border-color: ${({theme}) => theme.colors.inputBorder};
  ${({theme}) => theme.typography.font200};

  @media (max-width: ${({theme}) => theme.breakpoints.xs}) {
    display: block;
  }
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({theme}) => theme.spacing.scale600};
  height: calc(100vh - 80px);
  max-width: 790px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({theme}) => theme.spacing.scale600};

  ${({theme}) => css`
    @media (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: 1fr;
    }
  `}
`;

const LandingPage: React.FC = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>();
  const {success, danger} = useToaster();
  const [loading, setLoading] = useState(false);

  const {handleSubmit, register, formState} = useForm({mode: 'onChange'});

  const _onSubmit = (values) => {
    setLoading(true);
    const msg = `*${values.name} (${values.email}) wrote:*\n${values.message}`;
    fetch(config.discordContactWebHook, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({content: msg}),
    })
      .then(() => {
        success('Nachricht erfolgreich gesendet!');
        formRef.current.reset();
      })
      .catch(() => {
        danger('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const features = [
    {
      title: 'Bewerber:innenmanagement',
      description: 'Hinfort mit E-Mail, Google Drive und co. husch, husch!',
    },
    {
      title: 'Bewertungsformulare',
      description:
        'Gib deinen Interviews die nötige Struktur halte die Wahrnehmungen deiens Teams über individuelle Formulare fest.',
    },
    {
      title: 'Rankings & Gutachten ',
      description: 'Du bringts die Augen und Ohren, wir die Mathematik.',
    },
    {
      title: 'Cookies 🍪',
      description:
        'icruiting verwendet zwar keine Cookies, wenn du uns aber in Wien besuchst, kaufen wir dir welche.',
    },
  ];

  return (
    <>
      <Container>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          paddingBottom={96}
          paddingLeft={spacing.scale400}
          paddingRight={spacing.scale400}
          maxWidth={1280}
          width="100%"
          margin="0 auto"
        >
          {/* HERO */}
          <Hero>
            <Box display="flex" flexDirection="column" gap={spacing.scale200}>
              <DisplayL>
                Wähle die <b>passensten</b> nicht die besten Mitarbeiter:innen.
              </DisplayL>
              <Typography kind="body" color="secondary">
                Eine Plattform, die Euch dabei unterstützt, kollaborativ und
                anforderungsgetrieben Hiring-Entscheidungen zu treffen.
              </Typography>
            </Box>
            <Box>
              <Button onClick={() => router.push('/signup')}>
                Registrieren
              </Button>
            </Box>
          </Hero>
          {/* FEATURES */}
          {/* <Box
            display="flex"
            flexDirection="column"
            gap={spacing.scale600}
            marginTop={-200}
          >
            <Box>
              <HeadingM>Was kann icruiting?</HeadingM>
              <Typography color="secondary">Cha-Cha-Cha 2, 3 🕺</Typography>
            </Box>
            <FeaturesGrid>
              {features.map(({title, description}, idx) => (
                <Box
                  padding={spacing.scale400}
                  boxShadow="1px 1px 5px 0px rgba(64, 64, 64, 0.3)"
                  borderRadius={4}
                  key={idx}
                >
                  <H6 style={{wordBreak: 'break-all'}}>{title}</H6>
                  <Typography>{description}</Typography>
                </Box>
              ))}
            </FeaturesGrid>
          </Box>
          {/*  */}
          {/*<Box display="flex" flexDirection="column" gap={spacing.scale600}>
            <HeadingM>FAQ</HeadingM>
            <Box>
              <H6>Ist icruiting für mich?</H6>{' '}
              <Typography color="secondary">
                Probieren geht über studieren. Du kannst (glaub ich) wenig
                kaputt machen. 👉 <Link href="/signup">Registrieren</Link>
              </Typography>
            </Box>
            <Box>
              <H6>Was kostet der Spaß? 💸</H6>
              <Typography>
                <b>60€ / Monat</b>. <br />
                Gegenvorschläge? Wir feilschen gerne.
              </Typography>
            </Box>
          </Box> */}
          {/* CONTACT */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="start"
            gap={spacing.scale600}
          >
            <Box>
              <HeadingM>Kontakt</HeadingM>
              <Typography color="secondary">
                Wir antworten schnell 🏃
              </Typography>
            </Box>
            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.scale400,
                width: '100%',
              }}
              ref={formRef}
              onSubmit={handleSubmit(_onSubmit)}
            >
              <Input
                label="Name"
                placeholder="Name"
                name="name"
                ref={register({required: true})}
              />
              <Input
                label="E-Mail-Adresse"
                placeholder="E-Mail-Adresse"
                name="email"
                ref={register({required: true})}
                type="email"
              />
              <Textarea
                label="Nachricht"
                placeholder="Nachricht"
                name="message"
                ref={register({required: true})}
              />
              <Box>
                <Button
                  type="submit"
                  disabled={!(formState.isDirty && formState.isValid)}
                  isLoading={loading}
                >
                  Senden
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
        <Footer style={{position: 'relative'}}>
          <Bunny
            style={{
              position: 'absolute',
              top: '-25px',
              right: spacing.scale500,
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
            columnGap={spacing.scale300}
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
