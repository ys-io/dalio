import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { supabase } from "../lib/supabase";

interface Props {
  onComplete: () => void;
}

export function ResetPasswordScreen({ onComplete }: Props) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<RNTextInput>(null);
  const confirmRef = useRef<RNTextInput>(null);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "대문자를 포함해야 합니다.";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      newErrors.password = "특수문자를 포함해야 합니다.";
    }

    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호를 다시 입력해주세요.";
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.password) passwordRef.current?.focus();
      else if (newErrors.passwordConfirm) confirmRef.current?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrors({ password: error.message });
      passwordRef.current?.focus();
    } else {
      onComplete();
    }
    setLoading(false);
  };

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={{ marginBottom: 8 }}>
          새 비밀번호 설정
        </Text>
        <Text
          variant="subtitle"
          align="center"
          style={{ marginBottom: 40, lineHeight: 24 }}
        >
          새로운 비밀번호를 입력해주세요.
        </Text>

        <TextInput
          ref={passwordRef}
          label="새 비밀번호"
          placeholder="8자 이상, 대문자·특수문자 포함"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrors((prev) => {
              const next = { ...prev };
              delete next.password;
              return next;
            });
          }}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          error={errors.password}
          containerStyle={{ marginBottom: 16 }}
        />

        <TextInput
          ref={confirmRef}
          label="새 비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          value={passwordConfirm}
          onChangeText={(v) => {
            setPasswordConfirm(v);
            setErrors((prev) => {
              const next = { ...prev };
              delete next.passwordConfirm;
              return next;
            });
          }}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          error={errors.passwordConfirm}
          containerStyle={{ marginBottom: 32 }}
        />

        <Button
          title="비밀번호 변경"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
        />
      </Body>
    </Screen>
  );
}
