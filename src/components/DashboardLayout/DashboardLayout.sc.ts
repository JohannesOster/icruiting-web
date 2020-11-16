import styled, {css} from 'styled-components';

export const SideNav = styled.aside`
  background: white;
  border-right: 1px solid ${({theme}) => theme.colors.inputBorder};
  width: 200px;
  position: absolute;
  height: 100vh;
  display: flex;

  a {
    text-decoration: none;
    ${({theme}) => theme.typography.font200};
    &:hover  {
      text-decoration: none;
    }
  }

  ${({theme}) => css`
    @media (max-width: ${theme.breakpoints.md}) {
      display: none;
    }
  `}}
`;

export const NavList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Container = styled.main`
  margin: ${({theme}) => `${theme.spacing.scale200} ${theme.spacing.scale400}`};
  margin-left: 220px;

  ${({theme}) => css`
    @media (max-width: ${theme.breakpoints.md}) {
      margin-left: ${theme.spacing.scale400};
    }
  `}
`;
