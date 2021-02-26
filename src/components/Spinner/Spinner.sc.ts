import styled from 'styled-components';
import {SpinnerProps} from './types';

export const Spinner = styled.span<SpinnerProps>`
  height: ${({size, theme}) => size || theme.spacing.scale400};
  width: ${({size, theme}) => size || theme.spacing.scale400};
  border-radius: 50%;
  border: 3px solid;
  box-sizing: border-box;

  border-color: ${({theme, background}) =>
    background || theme.colors.loadingSpinnerBackground};
  border-top-color: ${({theme, foreground}) =>
    foreground || theme.colors.loadingSpinnerForeground};

  @keyframes spinnerAnimation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  display: inline-block;
  animation-duration: ${({theme}) => theme.animation.timing800};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-name: spinnerAnimation;
`;
