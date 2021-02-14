import React, {FC} from 'react';
import {Box, H3} from 'components';
import {useTheme} from 'styled-components';

const Contact: FC = () => {
  const {spacing} = useTheme();

  return (
    <Box padding={spacing.scale400} display="grid" rowGap={spacing.scale100}>
      <H3>Kontakt</H3>
      Bitte kontaktieren Sie den Betreiber dieser Website unter der folgenden
      E-Mail-Adresse:
      <a href="mailto:johannes.oster@icruiting.at">
        johannes.oster@icruiting.at
      </a>
    </Box>
  );
};

export default Contact;
