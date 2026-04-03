import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { signInWithGoogle } from "../lib/social-auth";
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

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert(
        "오류",
        isSignUp
          ? "이름, 이메일, 비밀번호를 모두 입력해주세요."
          : "이메일과 비밀번호를 입력해주세요.",
      );
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
        Alert.alert("완료", "회원가입이 완료되었습니다.");
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      Alert.alert("오류", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert("오류", error.message);
    } finally {
      setLoading(false);
    }
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
            onChangeText={setName}
            containerStyle={{ marginBottom: 12 }}
          />
        )}

        <TextInput
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          containerStyle={{ marginBottom: 12 }}
        />
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
          onPress={() => setIsSignUp(!isSignUp)}
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
