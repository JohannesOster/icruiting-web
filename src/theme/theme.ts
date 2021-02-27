import {colors, spacing, typography, borders, breakpoints} from './concepts';
import {animations} from './primitives';

export const theme = {
  colors: {
    // - button
    buttonPrimaryFill: colors.primary,
    buttonPrimaryText: colors.primary0,
    buttonPrimaryFillHover: colors.primary700,
    buttonPrimaryDisabledFill: colors.primary50,
    buttonPrimaryDisabledText: colors.primary400,

    buttonPrimaryDestructiveFill: colors.negative400,
    buttonPrimaryDestructiveText: colors.primary0,
    buttonPrimaryDestructiveFillHover: colors.negative300,

    buttonMinimalDisabledText: colors.primary400,

    buttonLoadingSpinnerForeground: colors.primary0,
    buttonLoadingSpinnerBackground: colors.primary500,

    buttonMinimalFill: 'transparent',
    buttonMinimalText: colors.primary700,
    buttonMinimalTextHover: colors.primary0,

    buttonDisabledFill: colors.primary50,
    buttonDisabledText: colors.primary400,

    // - inputs
    inputBorder: colors.primary100,
    inputFill: colors.primary0,
    inputBorderFocus: colors.primary500,

    inputBorderError: colors.negative400,
    inputFillErrorFocus: colors.negative50,

    inputBorderActive: colors.primary500,
    inputFillActiveError: colors.negative50,

    // - chip input
    chipBackground: colors.primary,

    // - rating group
    ratingGroupBackgroundActive: colors.primary,

    // - typography
    typographyPrimary: colors.primary800,
    typographySecondary: colors.primary600,
    typographyPrimaryError: colors.negative400,
    typographySecondaryError: colors.negative300,

    // - loadingspinner
    loadingSpinnerBackground: colors.primary300,
    loadingSpinnerForeground: colors.primary700,

    // - tables
    tableBorder: colors.primary200,
    tableHeaderFill: colors.primary100,
    tableRowFill: colors.primary50,

    // - toasters
    toasterSuccess: colors.positive,
    toasterError: colors.negative,
    toasterInfo: colors.accent,
  },
  spacing,
  typography,
  animations,
  borders,
  breakpoints,
};
