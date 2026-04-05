import type { LOGIN_VIEW, FORGOT_PASSWORD_STEP } from "@constans/views";

export type AuthProviderType = "email" | "google";

export interface AuthUser {
  id: string;
  email: string | null;
  provider: AuthProviderType;
  displayName: string | null;
  avatarUrl: string | null;
}

export type LoginViewType = (typeof LOGIN_VIEW)[keyof typeof LOGIN_VIEW];

export type ForgotPasswordStep = (typeof FORGOT_PASSWORD_STEP)[keyof typeof FORGOT_PASSWORD_STEP];

export interface LoginFormState {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreedTerms: boolean;
  agreedPrivacy: boolean;
}

export interface LoginFormRefs {
  nameRef: React.RefObject<any>;
  emailRef: React.RefObject<any>;
  passwordRef: React.RefObject<any>;
  passwordConfirmRef: React.RefObject<any>;
}

export interface LoginFormHandlers {
  setErrors: (errors: Record<string, string>) => void;
  resetErrors: () => void;
  setLoading: (loading: boolean) => void;
  setView: (view: string) => void;
}
