import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { signInWithGoogle } from "../lib/social-auth";
import { signUpSchema } from "../lib/validations";
import { apiCall, validate } from "@ys-io/utils";
import { supabase } from "../lib/supabase";
import { Button, TextInput, Text, Screen, Body, Divider } from "@ys-io/ui";
import { GoogleIcon } from "../components/GoogleIcon";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";

export function LoginScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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

  const handleSubmit = async () => {
    if (isSignUp) {
      const { errors: validationErrors } = await validate(signUpSchema, {
        name,
        email,
        password,
        passwordConfirm,
      });
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        if (validationErrors.name) nameRef.current?.focus();
        else if (validationErrors.email) emailRef.current?.focus();
        else if (validationErrors.password) passwordRef.current?.focus();
        else if (validationErrors.passwordConfirm)
          passwordConfirmRef.current?.focus();
        return;
      }
    }

    if (!email) {
      setErrors({ email: "이메일을 입력해주세요." });
      emailRef.current?.focus();
      return;
    }
    if (!isSignUp && !password) {
      setErrors({ password: "비밀번호를 입력해주세요." });
      passwordRef.current?.focus();
      return;
    }

    setErrors({});
    setLoading(true);

    if (isSignUp) {
      const { error } = await apiCall(() =>
        signUpWithEmail(email, password, name),
      );
      if (error) {
        setErrors({ email: error });
        emailRef.current?.focus();
      }
    } else {
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

  if (isForgotPassword) {
    return <ForgotPasswordScreen onBack={() => setIsForgotPassword(false)} />;
  }

  return (
    <Screen>
      <Body centered scroll>
        {isSignUp && (
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
              containerStyle={{ marginBottom: 16 }}
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
              containerStyle={{ marginBottom: 16 }}
            />

            <TextInput
              ref={passwordRef}
              label="비밀번호"
              placeholder="8자 이상 입력하세요"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                clearError("password");
              }}
              secureTextEntry
              onSubmitEditing={handleSubmit}
              error={errors.password}
              containerStyle={{ marginBottom: 16 }}
            />

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
              containerStyle={{ marginBottom: 32 }}
            />
          </>
        )}

        {!isSignUp && (
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
              containerStyle={{ marginBottom: 16 }}
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
              containerStyle={{ marginBottom: 32 }}
            />
          </>
        )}

        <Button
          title={isSignUp ? "가입하기" : "로그인"}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
          style={{ marginBottom: 12 }}
        />

        {isSignUp ? (
          <>
            <Button
              title="로그인으로 돌아가기"
              onPress={() => {
                setIsSignUp(false);
                setErrors({});
                setName("");
                setPassword("");
                setPasswordConfirm("");
              }}
              variant="secondary"
              style={{ marginBottom: 16 }}
            />

            <Text variant="caption" align="center" style={{ marginBottom: 24 }}>
              가입하면 이용약관 및 개인정보처리방침에 동의하게 됩니다
            </Text>
          </>
        ) : (
          <>
            <Button
              title="비밀번호를 잊으셨나요?"
              onPress={() => setIsForgotPassword(true)}
              variant="secondary"
              style={{ marginBottom: 12 }}
            />

            <Divider label="또는" />

            <Button
              title="Google로 계속하기"
              onPress={handleGoogleLogin}
              disabled={loading}
              variant="secondary"
              icon={<GoogleIcon />}
              style={{ marginBottom: 12 }}
            />

            <Button
              title="회원가입"
              onPress={() => {
                setIsSignUp(true);
                setErrors({});
                setPassword("");
                setPasswordConfirm("");
              }}
              variant="secondary"
              style={{ marginBottom: 16 }}
            />
          </>
        )}
      </Body>
    </Screen>
  );
}
