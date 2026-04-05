import { MSG } from "./messages";

export const PASSWORD_MIN_LENGTH = 8;

export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const PASSWORD_RULES = [
  { label: MSG.PW_RULE_MIN, test: (p: string) => p.length >= PASSWORD_MIN_LENGTH },
  { label: MSG.PW_RULE_UPPERCASE, test: (p: string) => /[A-Z]/.test(p) },
  { label: MSG.PW_RULE_SPECIAL, test: (p: string) => SPECIAL_CHAR_REGEX.test(p) },
];
