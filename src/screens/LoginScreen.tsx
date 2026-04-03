import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { signInWithGoogle } from "../lib/social-auth";
import { loginSchema, signUpSchema } from "../lib/validations";
import { apiCall, validate, showError, showSuccess } from "../lib/api";
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

  const handleSubmit = async () => {
    const schema = isSignUp ? signUpSchema : loginSchema;
    const values = isSignUp ? { name, email, password } : { email, password };

    const { errors: validationErrors } = await validate(schema, values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    if (isSignUp) {
      const { error } = await apiCall(() =>
        signUpWithEmail(email, password, name),
      );
      if (error) showError(error);
      else showSuccess("회원가입이 완료되었습니다.");
    } else {
      const { error } = await apiCall(() => signInWithEmail(email, password));
      if (error) showError(error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await apiCall(() => signInWithGoogle());
    if (error) showError(error);
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
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            onSubmitEditing={handleSubmit}
            error={errors.name}
            containerStyle={{ marginBottom: 12 }}
          />
        )}

        <TextInput
          placeholder="이메일"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={handleSubmit}
          error={errors.email}
          containerStyle={{ marginBottom: 12 }}
        />
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrors((prev) => ({ ...prev, password: "" }));
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
