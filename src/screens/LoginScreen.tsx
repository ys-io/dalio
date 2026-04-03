import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { signInWithGoogle } from "../lib/social-auth";
import { loginSchema, signUpSchema } from "../lib/validations";
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
  const [formMessage, setFormMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const handleSubmit = async () => {
    setFormMessage(null);
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
      if (error) setFormMessage({ text: error, type: "error" });
      else
        setFormMessage({
          text: "회원가입이 완료되었습니다.",
          type: "success",
        });
    } else {
      const { error } = await apiCall(() => signInWithEmail(email, password));
      if (error)
        setFormMessage({
          text: "이메일 또는 비밀번호를 확인해주세요.",
          type: "error",
        });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setFormMessage(null);
    setLoading(true);
    const { error } = await apiCall(() => signInWithGoogle());
    if (error) setFormMessage({ text: error, type: "error" });
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

        {formMessage && (
          <Text
            variant="body"
            align="center"
            color={formMessage.type === "error" ? "#ee0000" : "#22c55e"}
            style={{ marginBottom: 16, fontSize: 14 }}
          >
            {formMessage.text}
          </Text>
        )}

        {isSignUp && (
          <TextInput
            placeholder="이름"
            value={name}
            onChangeText={(v) => {
              setName(v);
              setErrors((prev) => ({ ...prev, name: "" }));
              setFormMessage(null);
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
            setFormMessage(null);
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
            setFormMessage(null);
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
            setFormMessage(null);
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
