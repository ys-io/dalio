export const OTP_DURATION = 180;
export const OTP_LENGTH = 6;
export const FOCUS_DELAY = 100;
export const PASSWORD_MIN_LENGTH = 8;

export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const PASSWORD_RULES = [
  { label: "8자 이상", test: (p: string) => p.length >= PASSWORD_MIN_LENGTH },
  { label: "대문자 포함", test: (p: string) => /[A-Z]/.test(p) },
  { label: "특수문자 포함", test: (p: string) => SPECIAL_CHAR_REGEX.test(p) },
];

export const COLORS = {
  success: "#22c55e",
  error: "#ff453a",
  primary: "#6366f1",
  muted: "#636366",
} as const;
