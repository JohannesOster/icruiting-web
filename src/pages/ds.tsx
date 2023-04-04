import React, {FC, useRef, useState} from 'react';
import {
  Box,
  Button,
  CommandPalette,
  DisplayL,
  DisplayM,
  DisplayS,
  HeadingL,
  HeadingM,
  HeadingS,
  Spinner,
  Typography,
} from 'components';
import styled, {useTheme} from 'styled-components';
import {getSourceFormFields} from 'components/FormBuilder/sourceFormFields';
import {randString} from 'components/FormBuilder/utils';

const Impressum: FC = () => {
  const {spacing} = useTheme();
  const [showCmdPalette, setShowCmdPalette] = useState(true);

  const commands = getSourceFormFields('application').map((field) => ({
    id: randString(),
    label: field.label,
    value: field.label,
    icon: field.icon,
  }));

  const onCmd = (cmd) => {
    if (!cmd) {
      setShowCmdPalette(false);
      return;
    }
    console.log('received cmd', cmd);
  };

  return (
    <Box padding={spacing.scale500} display="grid" rowGap={spacing.scale300}>
      {showCmdPalette && <CommandPalette commands={commands} onSelect={onCmd} />}
      <Button kind="secondary" onClick={() => setShowCmdPalette(true)}>
        Show Command Palette
      </Button>
      <DisplayL>Wähle die passensten nicht die besten Mitarbeiter:innen.</DisplayL>
      <DisplayM>Wähle die passensten nicht die besten Mitarbeiter:innen.</DisplayM>
      <DisplayS>Wähle die passensten nicht die besten Mitarbeiter:innen.</DisplayS>
      <HeadingL>Wähle die passensten nicht die besten Mitarbeiter:innen.</HeadingL>
      <HeadingM>Wähle die passensten nicht die besten Mitarbeiter:innen.</HeadingM>
      <HeadingS>Wähle die passensten nicht die besten Mitarbeiter:innen.</HeadingS>
      <Typography kind="body">Wähle die passensten nicht die besten Mitarbeiter:innen.</Typography>
      <Typography kind="secondary">
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </Typography>
      <Box></Box>
      <Spinner></Spinner>
    </Box>
  );
};

export default Impressum;
