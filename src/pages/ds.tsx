import React, {FC} from 'react';
import {Box, H5, H6, Typography} from 'components';
import styled, {useTheme} from 'styled-components';

const DisplayL = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 65px;
  letter-spacing: -0.5px;

  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    font-size: 32px;
  }
`;
const DisplayM = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 52px;

  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    font-size: 28px;
  }
`;
const DisplayS = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 37px;
  letter-spacing: 0.25px;

  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    font-size: 26px;
  }
`;

const HeadingL = styled.h4`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 26px;

  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;
const HeadingM = styled.h5`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.15px;

  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    font-size: 20px;
  }
`;
const HeadingS = styled.h6`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.15px;
  text-transform: uppercase;
`;

const TextPrimary = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 17px;
  letter-spacing: 0.5px;
`;
const TextSecondary = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  letter-spacing: 0.25px;
`;

const Impressum: FC = () => {
  const {spacing} = useTheme();

  return (
    <Box padding={spacing.scale500} display="grid" rowGap={spacing.scale300}>
      <HeadingM>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </HeadingM>
      <H6>Wähle die passensten nicht die besten Mitarbeiter:innen.</H6>
      <Typography kind="body">
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </Typography>
      <Typography kind="secondary">
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </Typography>

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
      <TextPrimary>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </TextPrimary>
      <TextSecondary>
        Wähle die passensten nicht die besten Mitarbeiter:innen.
      </TextSecondary>
    </Box>
  );
};

export default Impressum;
