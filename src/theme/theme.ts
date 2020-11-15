import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import {theme as baseTheme} from 'icruiting-ui';

export const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: colors.black,

    // - button
    buttonPrimaryFill: colors.black,
    buttonPrimaryText: colors.white,
    buttonPrimaryFillHover: colors.gray700,

    buttonMinimalFill: 'transparent',
    buttonMinimalText: colors.gray700,
    buttonMinimalTextHover: colors.black,

    buttonDisabledFill: colors.gray50,
    buttonDisabledText: colors.gray400,

    // - inputs
    inputBorder: colors.gray100,
    inputFill: colors.white,
    inputBorderActive: colors.gray500,
    inputBorderError: colors.red300,
    inputFillActiveError: colors.red50,

    // - tables
    tableBorder: colors.gray200,
    tableHeaderFill: colors.gray100,
    tableRowFill: colors.gray50,

    // - typography
    typographyPrimary: colors.gray800,
    typographySecondary: colors.gray600,
    typographyError: colors.red300,
  },
  borders: {radius: '2px'},
  spacing,
  typography,
  breakpoints: {
    sm: '568px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};
