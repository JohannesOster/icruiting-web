import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 75px); // 75px = navbarheight
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: ${({theme}) => theme.spacing.scale400};
  color: ${({theme}) => theme.colors.typographySecondary};
  border-top: 1px solid;
  border-color: ${({theme}) => theme.colors.inputBorder};
  ${({theme}) => theme.typography.font200};

  @media (max-width: 440px) {
    display: block;
  }
`;
