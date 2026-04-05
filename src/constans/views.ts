export const LOGIN_VIEW = {
  LOGIN: "login",
  SIGNUP: "signup",
  SIGNUP_OTP: "signupOtp",
  FORGOT_PASSWORD: "forgotPassword",
  TERMS: "terms",
  PRIVACY: "privacy",
} as const;

export const FORGOT_PASSWORD_STEP = {
  EMAIL: "email",
  OTP: "otp",
  RESET: "reset",
  DONE: "done",
} as const;

export const OTP_TYPE = {
  SIGNUP: "signup",
  RECOVERY: "recovery",
} as const;
