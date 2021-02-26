import styled from 'styled-components';
import {LabelProps, DescriptionProps} from './types';

export const Container = styled.div`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale100};
`;

export const OptionContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
  grid-column-gap: ${({theme}) => theme.spacing.scale100};
`;

export const OptionLabel = styled.label`
  ${({theme}) => theme.typography.font100};
`;

export const Label = styled.label<LabelProps>`
  ${({theme}) => theme.typography.font200};
  color: ${({theme, error}) =>
    error
      ? theme.colors.typographyPrimaryError
      : theme.colors.typographyPrimary};
`;

export const Description = styled.span<DescriptionProps>`
  ${({theme}) => theme.typography.font100};
  color: ${({theme, error}) =>
    error
      ? theme.colors.typographySecondaryError
      : theme.colors.typographySecondary};
`;

export const Errors = styled.div`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale100};
  color: ${({theme}) => theme.colors.typographyPrimaryError};
  ${({theme}) => theme.typography.font100};
`;
