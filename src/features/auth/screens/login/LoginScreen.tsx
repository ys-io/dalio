import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { Button, TextInput, Text, Screen, Body, Divider } from "@ys-io/ui";
import { GoogleIcon } from "@features/auth/components/icons/GoogleIcon";
import { PasswordStrength } from "@features/auth/components/form/PasswordStrength";
import { TermsAgreement } from "@features/auth/components/form/TermsAgreement";
import { useFormErrors } from "@hooks/common/useFormErrors";
import { useLoginHandler } from "@hooks/auth/useLoginHandler";
import { FOCUS_DELAY } from "@constans/time";
import { OtpScreen } from "@features/auth/screens/otp/OtpScreen";
import { ForgotPasswordScreen } from "@features/auth/screens/password/ForgotPasswordScreen";
import { TermsScreen } from "@features/auth/screens/legal/TermsScreen";
import { PrivacyScreen } from "@features/auth/screens/legal/PrivacyScreen";
import { styles } from "./LoginScreen.styles";

type ViewType = "login" | "signup" | "signupOtp" | "forgotPassword" | "terms" | "privacy";

export function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [view, setView] = useState<ViewType>("login");
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

  const handleSubmit = view === "signup" ? handleSignup : handleLogin;

  // --- Sub views ---

  if (view === "terms") {
    return <TermsScreen onBack={() => setView("signup")} />;
  }
  if (view === "privacy") {
    return <PrivacyScreen onBack={() => setView("signup")} />;
  }
  if (view === "signupOtp") {
    return (
      <OtpScreen
        email={email}
        type="signup"
        onVerified={() => {}}
        onBack={() => setView("signup")}
      />
    );
  }
  if (view === "forgotPassword") {
    return <ForgotPasswordScreen onBack={() => setView("login")} />;
  }

  // --- Main form ---

  return (
    <Screen scroll>
      <Body centered>
        <Text variant="title" align="center" style={styles.title}>
          📅 Dalio
        </Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          친구들과 일정을 공유하고{"\n"}함께 계획을 세워보세요
        </Text>

        {view === "signup" && (
          <>
            <TextInput
              ref={nameRef}
              label="이름"
              placeholder="홍길동"
              value={name}
              onChangeText={(v) => { setName(v); clearError("name"); }}
              onSubmitEditing={handleSubmit}
              error={errors.name}
              containerStyle={styles.fieldMargin}
            />
            <TextInput
              ref={emailRef}
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChangeText={(v) => { setEmail(v); clearError("email"); }}
              autoCapitalize="none"
              keyboardType="email-address"
              onSubmitEditing={handleSubmit}
              error={errors.email}
              containerStyle={styles.fieldMargin}
            />
            <TextInput
              ref={passwordRef}
              label="비밀번호"
              placeholder="8자 이상, 대문자·특수문자 포함"
              value={password}
              onChangeText={(v) => { setPassword(v); clearError("password"); }}
              secureTextEntry
              onSubmitEditing={handleSubmit}
              error={errors.password}
              containerStyle={styles.fieldMarginSmall}
            />
            <PasswordStrength password={password} />
            <TextInput
              ref={passwordConfirmRef}
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChangeText={(v) => { setPasswordConfirm(v); clearError("passwordConfirm"); }}
              secureTextEntry
              onSubmitEditing={handleSubmit}
              error={errors.passwordConfirm}
              containerStyle={styles.fieldMargin}
            />
            <TermsAgreement
              agreedTerms={agreedTerms}
              agreedPrivacy={agreedPrivacy}
              onToggleAll={() => {
                const next = !(agreedTerms && agreedPrivacy);
                setAgreedTerms(next);
                setAgreedPrivacy(next);
                clearError("agree");
              }}
              onToggleTerms={() => { setAgreedTerms(!agreedTerms); clearError("agree"); }}
              onTogglePrivacy={() => { setAgreedPrivacy(!agreedPrivacy); clearError("agree"); }}
              onViewTerms={() => setView("terms")}
              onViewPrivacy={() => setView("privacy")}
              error={errors.agree}
            />
          </>
        )}

        {view === "login" && (
          <>
            <TextInput
              ref={emailRef}
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChangeText={(v) => { setEmail(v); clearError("email"); }}
              autoCapitalize="none"
              keyboardType="email-address"
              onSubmitEditing={handleSubmit}
              error={errors.email}
              containerStyle={styles.fieldMargin}
            />
            <TextInput
              ref={passwordRef}
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={(v) => { setPassword(v); clearError("password"); }}
              secureTextEntry
              onSubmitEditing={handleSubmit}
              error={errors.password}
              containerStyle={styles.fieldMargin}
            />
          </>
        )}

        <Button
          title={view === "signup" ? "가입하기" : "로그인"}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
          style={styles.buttonMargin}
        />

        {view === "signup" ? (
          <Button
            title="로그인으로 돌아가기"
            onPress={() => { setView("login"); resetForm(); }}
            disabled={loading}
            variant="secondary"
            style={styles.buttonMarginLarge}
          />
        ) : (
          <>
            <Button
              title="비밀번호를 잊으셨나요?"
              onPress={() => setView("forgotPassword")}
              disabled={loading}
              variant="secondary"
              style={styles.buttonMargin}
            />
            <Divider label="또는" />
            <Button
              title="Google로 계속하기"
              onPress={handleGoogleLogin}
              disabled={loading}
              variant="secondary"
              icon={<GoogleIcon />}
              style={styles.buttonMargin}
            />
            <Button
              title="회원가입"
              onPress={() => {
                setView("signup");
                resetForm();
                setTimeout(() => nameRef.current?.focus(), FOCUS_DELAY);
              }}
              disabled={loading}
              variant="secondary"
              style={styles.buttonMarginLarge}
            />
          </>
        )}
      </Body>
    </Screen>
  );
}
