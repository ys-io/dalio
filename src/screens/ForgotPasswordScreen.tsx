import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { apiCall } from "@ys-io/utils";
import { supabase } from "../lib/supabase";
import {
  Button,
  TextInput,
  Text,
  Screen,
  Body,
} from "@ys-io/ui";

interface Props {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const emailRef = useRef<RNTextInput>(null);

  const handleSubmit = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      emailRef.current?.focus();
      return;
    }

    setError("");
    setLoading(true);
    const { error: apiError } = await apiCall(() =>
      supabase.auth.resetPasswordForEmail(email),
    );
    if (apiError) {
      setError(apiError);
      emailRef.current?.focus();
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <Screen>
        <Body centered>
          <Text
            variant="title"
            align="center"
            style={{ marginBottom: 16 }}
          >
            이메일을 확인해주세요
          </Text>
          <Text
            variant="subtitle"
            align="center"
            style={{ marginBottom: 40, lineHeight: 24 }}
          >
            {email}으로{"\n"}비밀번호 재설정 링크를 보냈습니다.
          </Text>
          <Button
            title="로그인으로 돌아가기"
            onPress={onBack}
          />
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <Body centered>
        <Text
          variant="title"
          align="center"
          style={{ marginBottom: 8 }}
        >
          비밀번호 찾기
        </Text>
        <Text
          variant="subtitle"
          align="center"
          style={{ marginBottom: 40, lineHeight: 24 }}
        >
          가입한 이메일을 입력하시면{"\n"}비밀번호 재설정 링크를 보내드립니다.
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
          title="재설정 링크 보내기"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          style={{ marginBottom: 16 }}
        />

        <Button
          title="로그인으로 돌아가기"
          onPress={onBack}
          variant="ghost"
        />
      </Body>
    </Screen>
  );
}
