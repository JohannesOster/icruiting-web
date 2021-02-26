import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import animation from './animation';

export const theme = {
  colors: {
    primary: colors.black,

    // - button
    buttonPrimaryFill: colors.black,
    buttonPrimaryText: colors.white,
    buttonPrimaryFillHover: colors.gray700,
    buttonPrimaryDisabledFill: colors.gray50,
    buttonPrimaryDisabledText: colors.gray400,

    buttonPrimaryDestructiveFill: colors.red400,
    buttonPrimaryDestructiveText: colors.white,
    buttonPrimaryDestructiveFillHover: colors.red300,

    buttonMinimalDisabledText: colors.gray400,

    buttonLoadingSpinnerForeground: colors.white,
    buttonLoadingSpinnerBackground: colors.gray500,

    // - inputs
    inputBorder: colors.gray100,
    inputFill: colors.white,
    inputBorderFocus: colors.gray500,

    inputBorderError: colors.red400,
    inputFillErrorFocus: colors.red50,

    // - typography
    typographyPrimary: colors.gray800,
    typographySecondary: colors.gray600,
    typographyPrimaryError: colors.red400,
    typographySecondaryError: colors.red300,

    // - loadingspinner
    loadingSpinnerBackground: colors.gray300,
    loadingSpinnerForeground: colors.gray700,

    buttonMinimalFill: 'transparent',
    buttonMinimalText: colors.gray700,
    buttonMinimalTextHover: colors.black,

    buttonDisabledFill: colors.gray50,
    buttonDisabledText: colors.gray400,

    // - inputs
    inputBorderActive: colors.gray500,
    inputFillActiveError: colors.red50,

    // - tables
    tableBorder: colors.gray200,
    tableHeaderFill: colors.gray100,
    tableRowFill: colors.gray50,

    // - typography
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
  animation,
};
