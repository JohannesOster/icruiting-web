import styled, {DefaultTheme} from 'styled-components';

type TKind = 'body' | 'secondary';
type TColor = 'primary' | 'secondary' | 'error';

export const Typography = styled.span<{kind?: TKind; color?: TColor}>`
  ${({theme, kind}) => getStylesForKind(theme, kind)};
  color: ${({theme, color}) => getColor(theme, color)};
`;

const getStylesForKind = (theme: DefaultTheme, kind?: TKind) => {
  switch (kind) {
    case 'secondary':
      return {
        ...theme.typography.font100,
        color: theme.colors.typographySecondary,
      };
    default:
      return {
        ...theme.typography.font200,
        color: theme.colors.typographyPrimary,
      };
  }
};

export const getColor = (theme: DefaultTheme, color?: TColor) => {
  switch (color) {
    case 'secondary':
      return theme.colors.typographySecondary;
    case 'error':
      return theme.colors.typographyPrimaryError;
  }
};

export const DisplayL = styled.h1`
  ${({theme}) => theme._typography.displayL}
  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    ${({theme}) => theme._typography.mDisplayL}
  }
`;

export const DisplayM = styled.h2`
  ${({theme}) => theme._typography.displayM}
  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    ${({theme}) => theme._typography.mDisplayM}
  }
`;

export const DisplayS = styled.h3`
  ${({theme}) => theme._typography.displayS}
  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    ${({theme}) => theme._typography.mDisplayS}
  }
`;

export const HeadingL = styled.h4`
  ${({theme}) => theme._typography.headingL}
  @media (max-width: ${({theme}) => theme.breakpoints.md}) {
    ${({theme}) => theme._typography.mHeadingL}
  }
`;

export const H5 = styled.h1`
  ${({theme}) => theme.typography.font750}
`;

export const H6 = styled.h1`
  ${({theme}) => theme.typography.font550}
`;
