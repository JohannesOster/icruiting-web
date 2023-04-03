import React, {FC} from 'react';
import {
  Box,
  DisplayL,
  DisplayM,
  DisplayS,
  HeadingL,
  HeadingM,
  HeadingS,
  Typography,
} from 'components';
import styled, {useTheme} from 'styled-components';

const Impressum: FC = () => {
  const {spacing} = useTheme();

  return (
    <Box padding={spacing.scale500} display="grid" rowGap={spacing.scale300}>
      <DisplayL>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </DisplayL>
      <DisplayM>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </DisplayM>
      <DisplayS>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </DisplayS>
      <HeadingL>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </HeadingL>
      <HeadingM>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </HeadingM>
      <HeadingS>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </HeadingS>
      <Typography kind="body">
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </Typography>
      <Typography kind="secondary">
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </Typography>
    </Box>
  );
};

export default Impressum;
