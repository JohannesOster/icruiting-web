import React, {FC} from 'react';
import {Box, H3, H6, Typography} from 'components';
import {useTheme} from 'styled-components';

const Impressum: FC = () => {
  const {spacing} = useTheme();

  return (
    <Box padding={spacing.scale400} display="grid" rowGap={spacing.scale200}>
      <H3 style={{margin: 0}}>Impressum</H3>
      <H6>Kontakt</H6>
      <Box display="grid" gridRowGap={spacing.scale200}>
        <Typography>
          Name: Johannes Oster
          <br />
          Anschrift: Bendlgasse 31 Top 18, 1120 Wien
        </Typography>
        <Typography>
          <br />
          E-Mail-Adresse: johannes.oster@icruiting.at
        </Typography>
      </Box>

      <H6>Haftungshinweis</H6>
      <Typography>
        <strong>Haftung für externe Links</strong>
        <br />
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
        Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
        Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
        verantwortlich.
        <br />
        <br />
        <strong>Haftung für Inhalte</strong>
        <br />
        Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt,
        und weiterentwickelt. Dennoch können wir wir keine Haftung für die
        Korrektheit aller Inhalte auf dieser Webseite übernehmen. Sollten Ihnen
        problematische oder rechtswidrige Inhalte auffallen kontaktieren Sie
        bitte die oben angegebenen Kontaktdaten.
      </Typography>
    </Box>
  );
};

export default Impressum;
