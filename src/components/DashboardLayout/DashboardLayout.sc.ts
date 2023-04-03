import styled, {css} from 'styled-components';

export const SideNav = styled.aside`
  background: white;
  border-right: 1px solid ${({theme}) => theme.colors.inputBorder};
  width: 220px;
  position: fixed;
  height: 100vh;
  display: flex;
  flex-direction: column;


  box-shadow: 0px 0px 2px rgba(130, 136, 148, 0.16), 0px 4px 6px rgba(130, 136, 148, 0.16);

  a {
    text-decoration: none;
    ${({theme}) => theme.typography.body};
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

export const LogoContainer = styled.div`
  display: flex;
  padding: ${({theme}) => theme.spacing.scale500};
  cursor: pointer;
  zindex: 25;
  border-bottom: 1px solid ${({theme}) => theme.colors.borderSubdued};
`;

export const NavList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Container = styled.main`
  padding: ${({theme}) => theme.spacing.scale500};
  padding-left: 244px;
  padding-bottom: ${({theme}) => theme.spacing.scale300};
  background: ${({theme}) => theme.colors.surfaceSubdued};
  min-height: 100vh;

  ${({theme}) => css`
    @media (max-width: ${theme.breakpoints.md}) {
      margin-left: ${theme.spacing.scale500};
    }
  `};
`;
