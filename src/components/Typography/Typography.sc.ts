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
      return {color: theme.colors.typographySecondary};
    case 'error':
      return {color: theme.colors.typographyPrimaryError};
  }
};

export const H1 = styled.h1`
  ${({theme}) => theme.typography.font1050}
`;

export const H2 = styled.h1`
  ${({theme}) => theme.typography.font950}
`;

export const H3 = styled.h1`
  ${({theme}) => theme.typography.font850}
`;

export const H4 = styled.h1`
  ${({theme}) => theme.typography.font850}
`;

export const H5 = styled.h1`
  ${({theme}) => theme.typography.font750}
`;

export const H6 = styled.h1`
  ${({theme}) => theme.typography.font550}
`;
