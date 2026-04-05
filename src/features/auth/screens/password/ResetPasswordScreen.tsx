import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { PasswordStrength } from "@features/auth/components/form/PasswordStrength";
import { MSG } from "@constans/messages";
import { useResetPasswordForm } from "@hooks/auth/useResetPasswordForm";
import { styles } from "./ResetPasswordScreen.styles";

interface Props {
  onComplete: () => void | Promise<void>;
}

export function ResetPasswordScreen({ onComplete }: Props) {
  const {
    password, setPassword,
    passwordConfirm, setPasswordConfirm,
    loading,
    errors, clearError,
    passwordRef, confirmRef,
    handleSubmit,
  } = useResetPasswordForm(onComplete);

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
