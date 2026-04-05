import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useAuth } from "@providers/AuthProvider";
import { supabase } from "@services/supabase";
import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { useAutoFocus } from "@hooks/common/useAutoFocus";
import { MSG } from "@constans/messages";
import { OtpScreen } from "@features/auth/screens/otp/OtpScreen";
import { ResetPasswordScreen } from "./ResetPasswordScreen";

interface Props {
  onBack: () => void;
}

type Step = "email" | "otp" | "reset" | "done";

export function ForgotPasswordScreen({ onBack }: Props) {
  const { pauseAuthListener, resumeAuthListener, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("email");
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
            비밀번호가 변경되었습니다!
          </Text>
          <Text
            variant="subtitle"
            align="center"
            style={{ marginBottom: 40, lineHeight: 24 }}
          >
            새 비밀번호로 로그인해주세요.
          </Text>
          <Button
            title="로그인으로 돌아가기"
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
          비밀번호 찾기
        </Text>
        <Text
          variant="subtitle"
          align="center"
          style={{ marginBottom: 40, lineHeight: 24 }}
        >
          가입한 이메일을 입력하시면{"\n"}인증 코드를 보내드립니다.
        </Text>

        <TextInput
          ref={emailRef}
          label="이메일"
          placeholder="example@email.com"
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
          title="인증 코드 보내기"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
          style={{ marginBottom: 12 }}
        />

        <Button
          title="로그인으로 돌아가기"
          onPress={onBack}
          variant="secondary"
        />
      </Body>
    </Screen>
  );
}
