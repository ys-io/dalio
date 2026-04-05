import * as yup from "yup";

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const passwordRules = yup
  .string()
  .required("비밀번호를 입력해주세요.")
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .matches(/[A-Z]/, "대문자를 포함해야 합니다.")
  .matches(SPECIAL_CHAR_REGEX, "특수문자를 포함해야 합니다.");

export const resetPasswordSchema = yup.object({
  password: passwordRules,
  passwordConfirm: yup
    .string()
    .required("비밀번호를 다시 입력해주세요.")
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
});

export const signUpSchema = yup.object({
  name: yup
    .string()
    .required("이름을 입력해주세요.")
    .min(2, "이름은 2자 이상이어야 합니다."),
  email: yup
    .string()
    .required("이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: passwordRules,
  passwordConfirm: yup
    .string()
    .required("비밀번호를 다시 입력해주세요.")
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
});
