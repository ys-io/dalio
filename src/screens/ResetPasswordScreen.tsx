import { useRef } from "react";
import { TextInput as RNTextInput } from "react-native";
import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { validate } from "@ys-io/utils";
import { supabase } from "../lib/supabase";
import { resetPasswordSchema } from "../lib/validations";
import { useFormErrors } from "../hooks/useFormErrors";
import { PasswordStrength } from "../components/PasswordStrength";
import { useState } from "react";

interface Props {
  onComplete: () => void | Promise<void>;
}

export function ResetPasswordScreen({ onComplete }: Props) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, setErrors, clearError } = useFormErrors();

  const passwordRef = useRef<RNTextInput>(null);
  const confirmRef = useRef<RNTextInput>(null);

  const handleSubmit = async () => {
    const { errors: validationErrors } = await validate(resetPasswordSchema, {
      password,
      passwordConfirm,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.password) passwordRef.current?.focus();
      else if (validationErrors.passwordConfirm) confirmRef.current?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrors({ password: error.message });
      passwordRef.current?.focus();
    } else {
      await onComplete();
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
            clearError("password");
          }}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          error={errors.password}
          containerStyle={{ marginBottom: 4 }}
        />

        <PasswordStrength password={password} />

        <TextInput
          ref={confirmRef}
          label="새 비밀번호 확인"
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
