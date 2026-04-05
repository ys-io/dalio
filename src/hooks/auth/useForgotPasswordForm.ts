import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useAuth } from "@providers/AuthProvider";
import { supabase } from "@services/supabase";
import { useAutoFocus } from "@hooks/common/useAutoFocus";
import { MSG } from "@constans/messages";
import { FORGOT_PASSWORD_STEP } from "@constans/views";
import { RPC } from "@constans/rpc";
import type { ForgotPasswordStep } from "@app-types/auth";

export function useForgotPasswordForm() {
  const { pauseAuthListener, resumeAuthListener, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<ForgotPasswordStep>(FORGOT_PASSWORD_STEP.EMAIL);
  const emailRef = useRef<RNTextInput>(null);

  useAutoFocus(emailRef);

  const handleSubmit = async () => {
    if (!email) {
      setError(MSG.EMAIL_REQUIRED);
      emailRef.current?.focus();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data: exists } = await supabase.rpc(RPC.CHECK_EMAIL_EXISTS, {
        target_email: email,
      });

      if (!exists) {
        setError(MSG.ACCOUNT_NOT_FOUND);
        emailRef.current?.focus();
        setLoading(false);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) {
        setError(resetError.message);
        emailRef.current?.focus();
      } else {
        pauseAuthListener();
        setStep(FORGOT_PASSWORD_STEP.OTP);
      }
    } catch {
      setError(MSG.NETWORK_ERROR);
    }
    setLoading(false);
  };

  const goToOtp = () => setStep(FORGOT_PASSWORD_STEP.OTP);
  const goToReset = () => setStep(FORGOT_PASSWORD_STEP.RESET);
  const goToDone = () => setStep(FORGOT_PASSWORD_STEP.DONE);
  const goToEmail = () => setStep(FORGOT_PASSWORD_STEP.EMAIL);

  const handleOtpBack = async () => {
    try { await signOut(); } catch {}
    resumeAuthListener();
    goToEmail();
  };

  const handleResetComplete = async () => {
    try { await signOut(); } catch {}
    resumeAuthListener();
    goToDone();
  };

  return {
    email, setEmail,
    loading, error, setError,
    step,
    emailRef,
    handleSubmit,
    goToReset,
    handleOtpBack,
    handleResetComplete,
  };
}
