import styled from 'styled-components';
import {LabelProps, DescriptionProps} from './types';

export const Container = styled.div`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale100};
`;

export const BaseSelect = styled.select`
  border: 1px solid ${({theme}) => theme.colors.inputBorder};
  border-radius: ${({theme}) => theme.borders.radius};
  background: white;
  cursor: pointer;
  outline: none;
  width: 100%;
  min-width: 50px;
  padding: ${({theme}) => theme.spacing.scale200};
  padding-right: ${({theme}) => theme.spacing.scale600};

  ${({theme}) => theme.typography.font100};

  &:focus {
    border-color: ${({theme}) => theme.colors.inputBorderFocus};
    box-shadow: 0 0 1px ${({theme}) => theme.colors.inputBorder};
  }

  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  background: url("data:image/svg+xml;utf8,<svg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z' fill='%23545454' /></svg>");
  background-repeat: no-repeat;
  background-position: right ${({theme}) => theme.spacing.scale100} top 50%;
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
