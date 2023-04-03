import React, {FC} from 'react';
import {Box, HeadingL} from 'components';
import {useTheme} from 'styled-components';

const Contact: FC = () => {
  const {spacing} = useTheme();

  return (
    <Box padding={spacing.scale500} display="grid" rowGap={spacing.scale200}>
      <HeadingL>Kontakt</HeadingL>
      Bitte kontaktieren Sie den Betreiber dieser Website unter der folgenden
      E-Mail-Adresse:
      <a href="mailto:johannes.oster@icruiting.at">
        johannes.oster@icruiting.at
      </a>
    </Box>
  );
};

export default Contact;
