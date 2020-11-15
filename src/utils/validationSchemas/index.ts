import * as yup from 'yup';

/** ================ SINGLE FIELDS ===================== */
export const emailSchema = yup
  .string()
  .email('Bitte geben Sie eine gültige E-Mail-Addresse ein.')
  .required('E-Mail-Addresse ist verpflichtend.');

const passwordSchema = yup
  .string()
  .min(6, 'Passwort muss mindestens 6 Zeichen lang sein.')
  .test(
    'hasLowerCase',
    'Passwort muss mindestens einen Kleinbuchstaben beinhalten.',
    (value) => /[a-z]/.test(value),
  )
  .test(
    'hasUpperCase',
    'Passwort muss mindestens einen Großbuchstaben beinhalten.',
    (value) => /[A-Z]/.test(value),
  )
  .test(
    'hasSpecialCharacter',
    'Passwort muss mindestens einen Spezialzeichen (@,!,#, etc) beinhalten.',
    (value) => /[^A-Za-z0-9]/.test(value),
  )
  .required('Passwort ist verpflichtend.');

const passwordConfirmSchema = yup
  .string()
  .oneOf([yup.ref('password')], 'Passwörter stimmen nicht überein.');

/** Email verification codes for password resets, and signup  email verification. */
const confirmationCodeSchema = yup
  .number()
  .typeError(
    'Bestätigenscode ist verpflichtend und darf nur Ziffern beinhalten.',
  );

/** ===================== FORM SCHEMAS ===================== */
export const signUpFormSchema = yup.object().shape({
  tenantName: yup
    .string()
    .min(3, 'Tenantname muss  mindestens 3 Zeichen lang sein.')
    .required('Tenantname ist verpflichtend.'),
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
});

export const confirmationCodeFormSchema = yup.object().shape({
  confirmationCode: confirmationCodeSchema,
});

export const passwordResetSchema = yup.object().shape({
  confirmationCode: confirmationCodeSchema,
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
});

export const loginFormSchema = yup.object().shape({
  email: emailSchema,
  password: yup.string().required('Passwort ist verpflichtend.'),
});

export const accountCompletionFormSchema = yup.object().shape({
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
});
