import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useFormErrors } from "@hooks/common/useFormErrors";
import { useLoginHandler } from "@hooks/auth/useLoginHandler";
import { LOGIN_VIEW } from "@constans/views";
import type { LoginViewType } from "@app-types/auth";

export function useLoginForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [view, setView] = useState<LoginViewType>(LOGIN_VIEW.LOGIN);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, setErrors, clearError, resetErrors } = useFormErrors();

  const nameRef = useRef<RNTextInput>(null);
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const passwordConfirmRef = useRef<RNTextInput>(null);

  const { handleSignup, handleLogin, handleGoogleLogin } = useLoginHandler(
    { name, email, password, passwordConfirm, agreedTerms, agreedPrivacy },
    { nameRef, emailRef, passwordRef, passwordConfirmRef },
    { setErrors, resetErrors, setLoading, setView: setView as (v: string) => void },
  );

  const resetForm = () => {
    resetErrors();
    setName("");
    setPassword("");
    setPasswordConfirm("");
    setAgreedTerms(false);
    setAgreedPrivacy(false);
  };

  const handleSubmit = view === LOGIN_VIEW.SIGNUP ? handleSignup : handleLogin;

  return {
    // form values
    name, setName,
    email, setEmail,
    password, setPassword,
    passwordConfirm, setPasswordConfirm,
    view, setView,
    agreedTerms, setAgreedTerms,
    agreedPrivacy, setAgreedPrivacy,
    loading,

    // errors
    errors, clearError,

    // refs
    nameRef, emailRef, passwordRef, passwordConfirmRef,

    // actions
    handleSubmit, handleGoogleLogin, resetForm,
  };
}
