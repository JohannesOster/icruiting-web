import {ReactNode} from 'react';
import styled from 'styled-components';

export const InputGroupContainer = styled.span`
  display: flex;
  flex-align: left;

  & > *:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  & > *:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin-inline-end: -1px;
  }
`;

export const getInputGroupContainerStyles = (Component: ReactNode) => `
    ${InputGroupContainer} &:not(:first-child) ${Component} {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  ${InputGroupContainer} &:not(:last-child) ${Component} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin-inline-end: -1px;
  }
`;
