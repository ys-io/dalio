export type AuthProviderType = "email" | "google";

export interface AuthUser {
  id: string;
  email: string | null;
  provider: AuthProviderType;
  displayName: string | null;
  avatarUrl: string | null;
}

export type LoginViewType =
  | "login"
  | "signup"
  | "signupOtp"
  | "forgotPassword"
  | "terms"
  | "privacy";

export type ForgotPasswordStep = "email" | "otp" | "reset" | "done";

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
