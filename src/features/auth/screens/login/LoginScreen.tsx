import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { Button, Screen, Body } from "@ys-io/ui";
import { NameInput } from "@features/auth/components/inputs/NameInput";
import { EmailInput } from "@features/auth/components/inputs/EmailInput";
import { PasswordInput } from "@features/auth/components/inputs/PasswordInput";
import { PasswordStrength } from "@features/auth/components/form/PasswordStrength";
import { TermsAgreement } from "@features/auth/components/form/TermsAgreement";
import { LoginHeader } from "@features/auth/components/sections/LoginHeader";
import { LoginActions } from "@features/auth/components/sections/LoginActions";
import { SignupActions } from "@features/auth/components/sections/SignupActions";
import { useFormErrors } from "@hooks/common/useFormErrors";
import { useLoginHandler } from "@hooks/auth/useLoginHandler";
import { FOCUS_DELAY } from "@constans/time";
import type { LoginViewType } from "@app-types/auth";
import { OtpScreen } from "@features/auth/screens/otp/OtpScreen";
import { ForgotPasswordScreen } from "@features/auth/screens/password/ForgotPasswordScreen";
import { TermsScreen } from "@features/auth/screens/legal/TermsScreen";
import { PrivacyScreen } from "@features/auth/screens/legal/PrivacyScreen";
import { styles } from "./LoginScreen.styles";

export function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [view, setView] = useState<LoginViewType>("login");
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
    {
      setErrors,
      resetErrors,
      setLoading,
      setView: setView as (v: string) => void,
    },
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

  if (view === "terms") return <TermsScreen onBack={() => setView("signup")} />;
  if (view === "privacy")
    return <PrivacyScreen onBack={() => setView("signup")} />;
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
  if (view === "forgotPassword")
    return <ForgotPasswordScreen onBack={() => setView("login")} />;

  // --- Main form ---

  return (
    <Screen scroll>
      <Body centered>
        <LoginHeader />

        {view === "signup" && (
          <>
            <NameInput
              ref={nameRef}
              value={name}
              onChange={(v) => {
                setName(v);
                clearError("name");
              }}
              onSubmit={handleSubmit}
              error={errors.name}
              style={styles.fieldMargin}
            />
            <EmailInput
              ref={emailRef}
              value={email}
              onChange={(v) => {
                setEmail(v);
                clearError("email");
              }}
              onSubmit={handleSubmit}
              error={errors.email}
              style={styles.fieldMargin}
            />
            <PasswordInput
              ref={passwordRef}
              value={password}
              onChange={(v) => {
                setPassword(v);
                clearError("password");
              }}
              onSubmit={handleSubmit}
              error={errors.password}
              placeholder="8자 이상, 대문자·특수문자 포함"
              style={styles.fieldMarginSmall}
            />
            <PasswordStrength password={password} />
            <PasswordInput
              ref={passwordConfirmRef}
              value={passwordConfirm}
              onChange={(v) => {
                setPasswordConfirm(v);
                clearError("passwordConfirm");
              }}
              onSubmit={handleSubmit}
              error={errors.passwordConfirm}
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              style={styles.fieldMargin}
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
              onToggleTerms={() => {
                setAgreedTerms(!agreedTerms);
                clearError("agree");
              }}
              onTogglePrivacy={() => {
                setAgreedPrivacy(!agreedPrivacy);
                clearError("agree");
              }}
              onViewTerms={() => setView("terms")}
              onViewPrivacy={() => setView("privacy")}
              error={errors.agree}
            />
          </>
        )}

        {view === "login" && (
          <>
            <EmailInput
              ref={emailRef}
              value={email}
              onChange={(v) => {
                setEmail(v);
                clearError("email");
              }}
              onSubmit={handleSubmit}
              error={errors.email}
              style={styles.fieldMargin}
            />
            <PasswordInput
              ref={passwordRef}
              value={password}
              onChange={(v) => {
                setPassword(v);
                clearError("password");
              }}
              onSubmit={handleSubmit}
              error={errors.password}
              style={styles.fieldMargin}
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
          <SignupActions
            loading={loading}
            onBack={() => {
              setView("login");
              resetForm();
            }}
          />
        ) : (
          <LoginActions
            loading={loading}
            onForgotPassword={() => setView("forgotPassword")}
            onGoogleLogin={handleGoogleLogin}
            onSignup={() => {
              setView("signup");
              resetForm();
              setTimeout(() => nameRef.current?.focus(), FOCUS_DELAY);
            }}
          />
        )}
      </Body>
    </Screen>
  );
}
