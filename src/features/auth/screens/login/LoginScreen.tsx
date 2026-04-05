import { useRef, useState } from "react";
import { TextInput as RNTextInput, View } from "react-native";
import { useAuth } from "@providers/AuthProvider";
import { signInWithGoogle } from "@features/auth/lib/social-auth";
import { signUpSchema } from "@features/auth/lib/validations";
import { apiCall, validate } from "@ys-io/utils";
import { supabase } from "@services/supabase";
import { Button, TextInput, Text, Screen, Body, Divider } from "@ys-io/ui";
import { GoogleIcon } from "@features/auth/components/icons/GoogleIcon";
import { PasswordStrength } from "@features/auth/components/form/PasswordStrength";
import { FocusablePressable } from "@components/common/FocusablePressable";
import { useFormErrors } from "@hooks/common/useFormErrors";
import { FOCUS_DELAY } from "@constans/time";
import { COLORS } from "@constans/colors";
import { MSG } from "@constans/messages";
import { OtpScreen } from "@features/auth/screens/otp/OtpScreen";
import { ForgotPasswordScreen } from "@features/auth/screens/password/ForgotPasswordScreen";
import { TermsScreen } from "@features/auth/screens/legal/TermsScreen";
import { PrivacyScreen } from "@features/auth/screens/legal/PrivacyScreen";
import { styles } from "./LoginScreen.styles";

type ViewType = "login" | "signup" | "signupOtp" | "forgotPassword" | "terms" | "privacy";

export function LoginScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
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

  const resetForm = () => {
    resetErrors();
    setName("");
    setPassword("");
    setPasswordConfirm("");
    setAgreedTerms(false);
    setAgreedPrivacy(false);
  };

  const handleSubmit = async () => {
    if (view === "signup") {
      const { errors: validationErrors } = await validate(signUpSchema, {
        name,
        email,
        password,
        passwordConfirm,
      });
      if (!agreedTerms || !agreedPrivacy) {
        validationErrors.agree = MSG.AGREE_REQUIRED;
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        if (validationErrors.name) nameRef.current?.focus();
        else if (validationErrors.email) emailRef.current?.focus();
        else if (validationErrors.password) passwordRef.current?.focus();
        else if (validationErrors.passwordConfirm)
          passwordConfirmRef.current?.focus();
        return;
      }

      resetErrors();
      setLoading(true);

      try {
        const { data: exists } = await supabase.rpc("check_email_registered", {
          target_email: email,
        });
        if (exists) {
          setErrors({ email: MSG.EMAIL_ALREADY_REGISTERED });
          emailRef.current?.focus();
          setLoading(false);
          return;
        }

        const { error } = await apiCall(() =>
          signUpWithEmail(email, password, name),
        );
        if (error) {
          setErrors({ email: error });
          emailRef.current?.focus();
        } else {
          setView("signupOtp");
        }
      } catch {
        setErrors({ email: MSG.NETWORK_ERROR });
      }
      setLoading(false);
      return;
    }

    // login
    if (!email) {
      setErrors({ email: MSG.EMAIL_REQUIRED });
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setErrors({ password: MSG.PASSWORD_REQUIRED });
      passwordRef.current?.focus();
      return;
    }

    resetErrors();
    setLoading(true);
    try {
      const { error } = await apiCall(() => signInWithEmail(email, password));
      if (error) {
        const { data: exists } = await supabase.rpc("check_email_exists", {
          target_email: email,
        });
        if (!exists) {
          setErrors({ email: MSG.ACCOUNT_NOT_FOUND });
          emailRef.current?.focus();
        } else {
          setErrors({ password: MSG.PASSWORD_WRONG });
          passwordRef.current?.focus();
        }
      }
    } catch {
      setErrors({ email: MSG.NETWORK_ERROR });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    resetErrors();
    setLoading(true);
    const { error } = await apiCall(() => signInWithGoogle());
    if (error) {
      setErrors({ email: error });
      emailRef.current?.focus();
    }
    setLoading(false);
  };

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
              onChangeText={(v) => {
                setName(v);
                clearError("name");
              }}
              onSubmitEditing={handleSubmit}
              error={errors.name}
              containerStyle={styles.fieldMargin}
            />

            <TextInput
              ref={emailRef}
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                clearError("email");
              }}
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
              onChangeText={(v) => {
                setPassword(v);
                clearError("password");
              }}
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
              onChangeText={(v) => {
                setPasswordConfirm(v);
                clearError("passwordConfirm");
              }}
              secureTextEntry
              onSubmitEditing={handleSubmit}
              error={errors.passwordConfirm}
              containerStyle={styles.fieldMargin}
            />

            <View style={styles.checkboxGroup}>
              <FocusablePressable
                style={styles.checkboxInline}
                focusedStyle={styles.checkboxRowFocused}
                onPress={() => {
                  const next = !(agreedTerms && agreedPrivacy);
                  setAgreedTerms(next);
                  setAgreedPrivacy(next);
                  clearError("agree");
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreedTerms && agreedPrivacy && styles.checkboxChecked,
                  ]}
                >
                  {agreedTerms && agreedPrivacy && (
                    <Text variant="caption" color="#fff">✓</Text>
                  )}
                </View>
                <Text variant="body" style={styles.allAgreeText}>
                  전체 동의
                </Text>
              </FocusablePressable>

              <View style={styles.dividerThin} />

              <View style={styles.checkboxRow}>
                <FocusablePressable
                  style={styles.checkboxInline}
                  focusedStyle={styles.checkboxRowFocused}
                  onPress={() => {
                    setAgreedTerms(!agreedTerms);
                    clearError("agree");
                  }}
                >
                  <View
                    style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}
                  >
                    {agreedTerms && (
                      <Text variant="caption" color="#fff">✓</Text>
                    )}
                  </View>
                  <Text variant="caption">이용약관 동의 (필수)</Text>
                </FocusablePressable>
                <FocusablePressable
                  style={styles.linkButton}
                  focusedStyle={styles.linkButtonFocused}
                  onPress={() => setView("terms")}
                >
                  <Text variant="caption" color={COLORS.primary}>보기</Text>
                </FocusablePressable>
              </View>

              <View style={styles.checkboxRow}>
                <FocusablePressable
                  style={styles.checkboxInline}
                  focusedStyle={styles.checkboxRowFocused}
                  onPress={() => {
                    setAgreedPrivacy(!agreedPrivacy);
                    clearError("agree");
                  }}
                >
                  <View
                    style={[styles.checkbox, agreedPrivacy && styles.checkboxChecked]}
                  >
                    {agreedPrivacy && (
                      <Text variant="caption" color="#fff">✓</Text>
                    )}
                  </View>
                  <Text variant="caption">개인정보처리방침 동의 (필수)</Text>
                </FocusablePressable>
                <FocusablePressable
                  style={styles.linkButton}
                  focusedStyle={styles.linkButtonFocused}
                  onPress={() => setView("privacy")}
                >
                  <Text variant="caption" color={COLORS.primary}>보기</Text>
                </FocusablePressable>
              </View>

              {errors.agree ? (
                <Text variant="caption" color={COLORS.error} style={styles.errorMargin}>
                  {errors.agree}
                </Text>
              ) : null}
            </View>
          </>
        )}

        {view === "login" && (
          <>
            <TextInput
              ref={emailRef}
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                clearError("email");
              }}
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
              onChangeText={(v) => {
                setPassword(v);
                clearError("password");
              }}
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
            onPress={() => {
              setView("login");
              resetForm();
            }}
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
