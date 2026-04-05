import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";
import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { validate } from "@ys-io/utils";
import { supabase } from "@services/supabase";
import { resetPasswordSchema } from "@features/auth/lib/validations";
import { useFormErrors } from "@hooks/common/useFormErrors";
import { PasswordStrength } from "@features/auth/components/form/PasswordStrength";
import { MSG } from "@constans/messages";
import { styles } from "./ResetPasswordScreen.styles";

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
        <Text variant="title" align="center" style={styles.title}>
          {MSG.RESET_PASSWORD_TITLE}
        </Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          {MSG.RESET_PASSWORD_SUBTITLE}
        </Text>

        <TextInput
          ref={passwordRef}
          label={MSG.LABEL_NEW_PASSWORD}
          placeholder={MSG.PLACEHOLDER_PASSWORD_SIGNUP}
          value={password}
          onChangeText={(v) => { setPassword(v); clearError("password"); }}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          error={errors.password}
          containerStyle={styles.fieldMarginSmall}
        />

        <PasswordStrength password={password} />

        <TextInput
          ref={confirmRef}
          label={MSG.LABEL_NEW_PASSWORD_CONFIRM}
          placeholder={MSG.PLACEHOLDER_PASSWORD_CONFIRM}
          value={passwordConfirm}
          onChangeText={(v) => { setPasswordConfirm(v); clearError("passwordConfirm"); }}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          error={errors.passwordConfirm}
          containerStyle={styles.fieldMargin}
        />

        <Button
          title={MSG.BTN_CHANGE_PASSWORD}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
        />
      </Body>
    </Screen>
  );
}
