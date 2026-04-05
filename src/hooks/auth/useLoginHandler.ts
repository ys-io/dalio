import { useCallback } from "react";
import { useAuth } from "@providers/AuthProvider";
import { signInWithGoogle } from "@features/auth/lib/social-auth";
import { signUpSchema } from "@features/auth/lib/validations";
import { apiCall, validate } from "@ys-io/utils";
import { supabase } from "@services/supabase";
import { MSG } from "@constans/messages";

interface Refs {
  nameRef: React.RefObject<any>;
  emailRef: React.RefObject<any>;
  passwordRef: React.RefObject<any>;
  passwordConfirmRef: React.RefObject<any>;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreedTerms: boolean;
  agreedPrivacy: boolean;
}

interface Handlers {
  setErrors: (errors: Record<string, string>) => void;
  resetErrors: () => void;
  setLoading: (loading: boolean) => void;
  setView: (view: string) => void;
}

export function useLoginHandler(
  form: FormState,
  refs: Refs,
  handlers: Handlers,
) {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const handleSignup = useCallback(async () => {
    const { errors: validationErrors } = await validate(signUpSchema, {
      name: form.name,
      email: form.email,
      password: form.password,
      passwordConfirm: form.passwordConfirm,
    });
    if (!form.agreedTerms || !form.agreedPrivacy) {
      validationErrors.agree = MSG.AGREE_REQUIRED;
    }

    if (Object.keys(validationErrors).length > 0) {
      handlers.setErrors(validationErrors);
      if (validationErrors.name) refs.nameRef.current?.focus();
      else if (validationErrors.email) refs.emailRef.current?.focus();
      else if (validationErrors.password) refs.passwordRef.current?.focus();
      else if (validationErrors.passwordConfirm)
        refs.passwordConfirmRef.current?.focus();
      return;
    }

    handlers.resetErrors();
    handlers.setLoading(true);

    try {
      const { data: exists } = await supabase.rpc("check_email_registered", {
        target_email: form.email,
      });
      if (exists) {
        handlers.setErrors({ email: MSG.EMAIL_ALREADY_REGISTERED });
        refs.emailRef.current?.focus();
        handlers.setLoading(false);
        return;
      }

      const { error } = await apiCall(() =>
        signUpWithEmail(form.email, form.password, form.name),
      );
      if (error) {
        handlers.setErrors({ email: error });
        refs.emailRef.current?.focus();
      } else {
        handlers.setView("signupOtp");
      }
    } catch {
      handlers.setErrors({ email: MSG.NETWORK_ERROR });
    }
    handlers.setLoading(false);
  }, [form, refs, handlers, signUpWithEmail]);

  const handleLogin = useCallback(async () => {
    if (!form.email) {
      handlers.setErrors({ email: MSG.EMAIL_REQUIRED });
      refs.emailRef.current?.focus();
      return;
    }
    if (!form.password) {
      handlers.setErrors({ password: MSG.PASSWORD_REQUIRED });
      refs.passwordRef.current?.focus();
      return;
    }

    handlers.resetErrors();
    handlers.setLoading(true);
    try {
      const { error } = await apiCall(() =>
        signInWithEmail(form.email, form.password),
      );
      if (error) {
        const { data: exists } = await supabase.rpc("check_email_exists", {
          target_email: form.email,
        });
        if (!exists) {
          handlers.setErrors({ email: MSG.ACCOUNT_NOT_FOUND });
          refs.emailRef.current?.focus();
        } else {
          handlers.setErrors({ password: MSG.PASSWORD_WRONG });
          refs.passwordRef.current?.focus();
        }
      }
    } catch {
      handlers.setErrors({ email: MSG.NETWORK_ERROR });
    }
    handlers.setLoading(false);
  }, [form, refs, handlers, signInWithEmail]);

  const handleGoogleLogin = useCallback(async () => {
    handlers.resetErrors();
    handlers.setLoading(true);
    const { error } = await apiCall(() => signInWithGoogle());
    if (error) {
      handlers.setErrors({ email: error });
      refs.emailRef.current?.focus();
    }
    handlers.setLoading(false);
  }, [refs, handlers]);

  return { handleSignup, handleLogin, handleGoogleLogin };
}
