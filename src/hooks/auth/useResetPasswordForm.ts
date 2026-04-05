import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { validate } from "@ys-io/utils";
import { supabase } from "@services/supabase";
import { resetPasswordSchema } from "@features/auth/lib/validations";
import { useFormErrors } from "@hooks/common/useFormErrors";

export function useResetPasswordForm(onComplete: () => void | Promise<void>) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, setErrors, clearError } = useFormErrors();

  const passwordRef = useRef<RNTextInput>(null);
  const confirmRef = useRef<RNTextInput>(null);

  const handleSubmit = async () => {
    const { errors: validationErrors } = await validate(resetPasswordSchema, {
      password,
      passwordConfirm,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.password) passwordRef.current?.focus();
      else if (validationErrors.passwordConfirm) confirmRef.current?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrors({ password: error.message });
      passwordRef.current?.focus();
    } else {
      await onComplete();
    }
    setLoading(false);
  };

  return {
    password, setPassword,
    passwordConfirm, setPasswordConfirm,
    loading,
    errors, clearError,
    passwordRef, confirmRef,
    handleSubmit,
  };
}
