import styled, {css, DefaultTheme} from 'styled-components';
import {ButtonKind, BaseButtonProps} from './types';

export const BaseButton = styled.button<BaseButtonProps>`
  margin: 0;
  display: inline-flex;
  flex-direction: ${({isLoading}) => (isLoading ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  padding-top: ${({theme}) => theme.spacing.scale100};
  padding-bottom: ${({theme}) => theme.spacing.scale100};
  padding-left: ${({theme}) => theme.spacing.scale300};
  padding-right: ${({theme}) => theme.spacing.scale300};

  border: none;
  border-radius: ${({theme}) => theme.borders.radius};

  ${({theme}) => theme.typography.font200}

  transition-property: background-color;
  transition-duration: ${({theme}) => theme.animation.timing100};
  transition-timing-function: ${({theme}) => theme.animation.linearCurve};

  ${({isLoading}) =>
    isLoading &&
    css`
      pointer-events: none;
    `}

  ${({theme, kind, destructive}) =>
    getButtonStylesForKind(theme, kind, destructive)};
`;

export const LoadingSpinnerContainer = styled.div`
  position: static;
  line-height: 0;
`;

const getButtonStylesForKind = (
  theme: DefaultTheme,
  kind: ButtonKind = 'primary',
  destructive?: boolean,
) => {
  switch (kind) {
    case 'minimal':
      return css`
        background: none;
        color: ${destructive
          ? theme.colors.typographyPrimaryError
          : theme.colors.typographyPrimary};
        padding: 0;

        &:hover {
          color: ${destructive
            ? theme.colors.typographySecondaryError
            : theme.colors.typographySecondary};
        }

        &:disabled {
          cursor: not-allowed;
          color: ${({theme}) => theme.colors.buttonMinimalDisabledText};
        }
      `;
    case 'primary':
      return css`
        background-color: ${destructive
          ? theme.colors.buttonPrimaryDestructiveFill
          : theme.colors.buttonPrimaryFill};
        color: ${destructive
          ? theme.colors.buttonPrimaryDestructiveText
          : theme.colors.buttonPrimaryText};

        &:hover {
          background-color: ${destructive
            ? theme.colors.buttonPrimaryDestructiveFillHover
            : theme.colors.buttonPrimaryFillHover};
        }

        &:disabled {
          cursor: not-allowed;
          background-color: ${({theme}) =>
            theme.colors.buttonPrimaryDisabledFill};
          color: ${({theme}) => theme.colors.buttonPrimaryDisabledText};
        }
      `;
  }
};
