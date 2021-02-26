import styled, {css} from 'styled-components';
import {BaseInputProps, LabelProps, DescriptionProps} from './types';

export const Container = styled.div`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale100};
`;

export const BaseInput = styled.input<BaseInputProps>`
  border: 1px solid;
  border-color: ${({theme}) => theme.colors.inputBorder};
  border-radius: ${({theme}) => theme.borders.radius};
  background: ${({theme}) => theme.colors.inputFill};
  padding: ${({theme}) => theme.spacing.scale200};
  ${({theme}) => theme.typography.font100};

  &:focus {
    outline: none !important;
    border-color: ${({theme}) => theme.colors.inputBorderFocus};
  }

  ${({theme, error}) =>
    error &&
    css`
      border-color: ${theme.colors.inputBorderError};
      background-color: ${theme.colors.inputFillErrorFocus};

      &:focus {
        border-color: ${theme.colors.inputBorderError};
        background-color: ${theme.colors.inputFill};
      }
    `}

  ${({theme, type, error}) =>
    type === 'file' &&
    css`
      border: none;
      padding: 0;
      background-color: transparent;
      ${error && {color: theme.colors.typographyPrimaryError}}
    `};
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
