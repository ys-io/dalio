import { useEffect, useRef, useState, useCallback } from "react";
import { TextInput as RNTextInput, View, Pressable, Platform } from "react-native";
import { styles } from "./LoginScreen.styles";
import { useAuth } from "../providers/AuthProvider";
import { signInWithGoogle } from "../lib/social-auth";
import { signUpSchema } from "../lib/validations";
import { apiCall, validate } from "@ys-io/utils";
import { supabase } from "../lib/supabase";
import { Button, TextInput, Text, Screen, Body, Divider } from "@ys-io/ui";
import { GoogleIcon } from "../components/GoogleIcon";
import { PasswordStrength } from "../components/PasswordStrength";
import { OtpScreen } from "./OtpScreen";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import { TermsScreen } from "./TermsScreen";
import { PrivacyScreen } from "./PrivacyScreen";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<RNTextInput>(null);
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const passwordConfirmRef = useRef<RNTextInput>(null);

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const resetForm = () => {
    setErrors({});
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
        validationErrors.agree = "이용약관과 개인정보처리방침에 동의해주세요.";
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

      setErrors({});
      setLoading(true);

      try {
        // 이미 가입된 이메일인지 체크
        const { data: exists } = await supabase.rpc("check_email_registered", {
          target_email: email,
        });
        if (exists) {
          setErrors({ email: "이미 가입된 이메일입니다." });
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
        setErrors({ email: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요." });
      }
      setLoading(false);
      return;
    }

    // login
    if (!email) {
      setErrors({ email: "이메일을 입력해주세요." });
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setErrors({ password: "비밀번호를 입력해주세요." });
      passwordRef.current?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const { error } = await apiCall(() => signInWithEmail(email, password));
      if (error) {
        const { data: exists } = await supabase.rpc("check_email_exists", {
          target_email: email,
        });
        if (!exists) {
          setErrors({ email: "존재하지 않는 계정입니다." });
          emailRef.current?.focus();
        } else {
          setErrors({ password: "비밀번호가 일치하지 않습니다." });
          passwordRef.current?.focus();
        }
      }
    } catch {
      setErrors({ email: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요." });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setErrors({});
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

  // OTP 인증 화면 (회원가입)
  if (view === "signupOtp") {
    return (
      <OtpScreen
        email={email}
        type="signup"
        onVerified={() => {
          // 인증 완료 → Supabase가 자동으로 세션 생성 → AuthProvider가 감지
        }}
        onBack={() => setView("signup")}
      />
    );
  }

  // 비밀번호 찾기
  if (view === "forgotPassword") {
    return (
      <ForgotPasswordScreen
        onBack={() => setView("login")}
      />
    );
  }

  // 로그인 / 회원가입 폼
  return (
    <Screen scroll>
      <Body centered>
        <Text
          variant="title"
          align="center"
          style={styles.title}
        >
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
                  <Text variant="caption" color="#6366f1">보기</Text>
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
                  <Text variant="caption" color="#6366f1">보기</Text>
                </FocusablePressable>
              </View>

              {errors.agree ? (
                <Text variant="caption" color="#ff453a" style={styles.errorMargin}>
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
          <>
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
          </>
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
                setTimeout(() => nameRef.current?.focus(), 100);
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

function FocusablePressable({
  onPress,
  style: baseStyle,
  focusedStyle,
  children,
}: {
  onPress: () => void;
  style: any;
  focusedStyle: any;
  children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== "web" || !ref.current) return;
    const el = ref.current as unknown as HTMLElement;
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        onPress();
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [onPress]);

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[baseStyle, focused && focusedStyle]}
    >
      {children}
    </Pressable>
  );
}

