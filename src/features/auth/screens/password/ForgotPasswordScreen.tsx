import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useAuth } from "@providers/AuthProvider";
import { supabase } from "@services/supabase";
import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { useAutoFocus } from "@hooks/common/useAutoFocus";
import { MSG } from "@constans/messages";
import { FORGOT_PASSWORD_STEP, OTP_TYPE } from "@constans/views";
import { RPC } from "@constans/rpc";
import type { ForgotPasswordStep } from "@app-types/auth";
import { OtpScreen } from "@features/auth/screens/otp/OtpScreen";
import { ResetPasswordScreen } from "./ResetPasswordScreen";
import { styles } from "./ForgotPasswordScreen.styles";

interface Props {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: Props) {
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

  if (step === FORGOT_PASSWORD_STEP.OTP) {
    return (
      <OtpScreen
        email={email}
        type={OTP_TYPE.RECOVERY}
        onVerified={() => setStep(FORGOT_PASSWORD_STEP.RESET)}
        onBack={async () => {
          try { await signOut(); } catch {}
          resumeAuthListener();
          setStep(FORGOT_PASSWORD_STEP.EMAIL);
        }}
      />
    );
  }

  if (step === FORGOT_PASSWORD_STEP.RESET) {
    return (
      <ResetPasswordScreen
        onComplete={async () => {
          try { await signOut(); } catch {}
          resumeAuthListener();
          setStep(FORGOT_PASSWORD_STEP.DONE);
        }}
      />
    );
  }

  if (step === FORGOT_PASSWORD_STEP.DONE) {
    return (
      <Screen>
        <Body centered>
          <Text variant="title" align="center" style={styles.doneTitle}>
            {MSG.PASSWORD_CHANGED_TITLE}
          </Text>
          <Text variant="subtitle" align="center" style={styles.doneSubtitle}>
            {MSG.PASSWORD_CHANGED_SUBTITLE}
          </Text>
          <Button title={MSG.BACK_TO_LOGIN} onPress={onBack} variant="primary" />
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={styles.title}>
          {MSG.FORGOT_PASSWORD_TITLE}
        </Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          {MSG.FORGOT_PASSWORD_SUBTITLE}
        </Text>

        <TextInput
          ref={emailRef}
          label={MSG.LABEL_EMAIL}
          placeholder={MSG.PLACEHOLDER_EMAIL}
          value={email}
          onChangeText={(v) => { setEmail(v); setError(""); }}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={handleSubmit}
          error={error}
          containerStyle={styles.fieldMargin}
        />

        <Button
          title={MSG.BTN_SEND_OTP}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
          style={styles.buttonMargin}
        />

        <Button title={MSG.BACK_TO_LOGIN} onPress={onBack} variant="secondary" />
      </Body>
    </Screen>
  );
}
