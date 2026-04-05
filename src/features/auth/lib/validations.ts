import * as yup from "yup";
import { MSG } from "@constans/messages";
import { SPECIAL_CHAR_REGEX, PASSWORD_MIN_LENGTH } from "@constans/password";

export const passwordRules = yup
  .string()
  .required(MSG.V_PASSWORD_REQUIRED)
  .min(PASSWORD_MIN_LENGTH, MSG.V_PASSWORD_MIN)
  .matches(/[A-Z]/, MSG.V_PASSWORD_UPPERCASE)
  .matches(SPECIAL_CHAR_REGEX, MSG.V_PASSWORD_SPECIAL);

export const resetPasswordSchema = yup.object({
  password: passwordRules,
  passwordConfirm: yup
    .string()
    .required(MSG.V_PASSWORD_CONFIRM_REQUIRED)
    .oneOf([yup.ref("password")], MSG.V_PASSWORD_CONFIRM_MATCH),
});

export const signUpSchema = yup.object({
  name: yup
    .string()
    .required(MSG.V_NAME_REQUIRED)
    .min(2, MSG.V_NAME_MIN),
  email: yup
    .string()
    .required(MSG.V_EMAIL_REQUIRED)
    .email(MSG.V_EMAIL_INVALID),
  password: passwordRules,
  passwordConfirm: yup
    .string()
    .required(MSG.V_PASSWORD_CONFIRM_REQUIRED)
    .oneOf([yup.ref("password")], MSG.V_PASSWORD_CONFIRM_MATCH),
});
