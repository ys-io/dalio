import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useAuth } from "@providers/AuthProvider";
import { supabase } from "@services/supabase";
import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { useAutoFocus } from "@hooks/common/useAutoFocus";
import { MSG } from "@constans/messages";
import type { ForgotPasswordStep } from "@app-types/auth";
import { OtpScreen } from "@features/auth/screens/otp/OtpScreen";
import { ResetPasswordScreen } from "./ResetPasswordScreen";

interface Props {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: Props) {
  const { pauseAuthListener, resumeAuthListener, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<ForgotPasswordStep>("email");
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
      const { data: exists } = await supabase.rpc("check_email_exists", {
        target_email: email,
      });

      if (!exists) {
        setError(MSG.ACCOUNT_NOT_FOUND);
        emailRef.current?.focus();
        setLoading(false);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
      );
      if (resetError) {
        setError(resetError.message);
        emailRef.current?.focus();
      } else {
        pauseAuthListener();
        setStep("otp");
      }
    } catch {
      setError(MSG.NETWORK_ERROR);
    }
    setLoading(false);
  };

  if (step === "otp") {
    return (
      <OtpScreen
        email={email}
        type="recovery"
        onVerified={() => setStep("reset")}
        onBack={async () => {
          try { await signOut(); } catch {}
          resumeAuthListener();
          setStep("email");
        }}
      />
    );
  }

  if (step === "reset") {
    return (
      <ResetPasswordScreen
        onComplete={async () => {
          try { await signOut(); } catch {}
          resumeAuthListener();
          setStep("done");
        }}
      />
    );
  }

  if (step === "done") {
    return (
      <Screen>
        <Body centered>
          <Text variant="title" align="center" style={{ marginBottom: 16 }}>
            {MSG.PASSWORD_CHANGED_TITLE}
          </Text>
          <Text
            variant="subtitle"
            align="center"
            style={{ marginBottom: 40, lineHeight: 24 }}
          >
            {MSG.PASSWORD_CHANGED_SUBTITLE}
          </Text>
          <Button
            title={MSG.BACK_TO_LOGIN}
            onPress={onBack}
            variant="primary"
          />
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={{ marginBottom: 8 }}>
          {MSG.FORGOT_PASSWORD_TITLE}
        </Text>
        <Text
          variant="subtitle"
          align="center"
          style={{ marginBottom: 40, lineHeight: 24 }}
        >
          {MSG.FORGOT_PASSWORD_SUBTITLE}
        </Text>

        <TextInput
          ref={emailRef}
          label={MSG.LABEL_EMAIL}
          placeholder={MSG.PLACEHOLDER_EMAIL}
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={handleSubmit}
          error={error}
          containerStyle={{ marginBottom: 32 }}
        />

        <Button
          title={MSG.BTN_SEND_OTP}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
          style={{ marginBottom: 12 }}
        />

        <Button
          title={MSG.BACK_TO_LOGIN}
          onPress={onBack}
          variant="secondary"
        />
      </Body>
    </Screen>
  );
}
