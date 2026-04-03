import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { signInWithGoogle } from "../lib/social-auth";
import { signUpSchema } from "../lib/validations";
import { apiCall, validate } from "../lib/api";
import {
  Button,
  TextInput,
  Text,
  Screen,
  Body,
  Divider,
} from "../components/ui";

export function LoginScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);

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
      });
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
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
      const { error, raw } = await apiCall(() =>
        signInWithEmail(email, password),
      );
      if (error) {
        const isUserNotFound =
          raw === "Invalid login credentials" ||
          raw === "User not found" ||
          raw === "invalid_credentials";
        const isInvalidPassword =
          raw === "Invalid login credentials" && password.length > 0;

        // Supabase는 보안상 "Invalid login credentials"로 통일하므로
        // email이 비어있으면 이메일 에러, 아니면 비밀번호 에러로 처리
        if (!email) {
          setErrors({ email: "이메일을 입력해주세요." });
          emailRef.current?.focus();
        } else if (!password) {
          setErrors({ password: "비밀번호를 입력해주세요." });
          passwordRef.current?.focus();
        } else {
          // 둘 다 입력된 상태에서 실패 → 비밀번호 에러로 표시
          setErrors({ password: "이메일 또는 비밀번호가 일치하지 않습니다." });
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

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={{ marginBottom: 4 }}>
          Dalio
        </Text>
        <Text variant="subtitle" align="center" style={{ marginBottom: 32 }}>
          캘린더 & 일정 관리
        </Text>

        {isSignUp && (
          <TextInput
            placeholder="이름"
            value={name}
            onChangeText={(v) => {
              setName(v);
              clearError("name");
            }}
            onSubmitEditing={handleSubmit}
            error={errors.name}
            containerStyle={{ marginBottom: 12 }}
          />
        )}

        <TextInput
          ref={emailRef}
          placeholder="이메일"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            clearError("email");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={handleSubmit}
          error={errors.email}
          containerStyle={{ marginBottom: 12 }}
        />
        <TextInput
          ref={passwordRef}
          placeholder="비밀번호"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            clearError("password");
          }}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          error={errors.password}
          containerStyle={{ marginBottom: 12 }}
        />

        <Button
          title={isSignUp ? "회원가입" : "로그인"}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          style={{ marginBottom: 12 }}
        />

        <Button
          title={
            isSignUp
              ? "이미 계정이 있나요? 로그인"
              : "계정이 없나요? 회원가입"
          }
          onPress={() => {
            setIsSignUp(!isSignUp);
            setErrors({});
          }}
          variant="ghost"
        />

        <Divider label="또는" />

        <Button
          title="Google로 계속하기"
          onPress={handleGoogleLogin}
          disabled={loading}
          style={{ backgroundColor: "#4285F4" }}
        />
      </Body>
    </Screen>
  );
}
