import { Button, TextInput, Text, Screen, Body } from "@ys-io/ui";
import { MSG } from "@constans/messages";
import { FORGOT_PASSWORD_STEP, OTP_TYPE } from "@constans/views";
import { useForgotPasswordForm } from "@hooks/auth/useForgotPasswordForm";
import { OtpScreen } from "@features/auth/screens/otp/OtpScreen";
import { ResetPasswordScreen } from "./ResetPasswordScreen";
import { styles } from "./ForgotPasswordScreen.styles";

interface Props {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: Props) {
  const {
    email, setEmail,
    loading, error, setError,
    step,
    emailRef,
    handleSubmit,
    goToReset,
    handleOtpBack,
    handleResetComplete,
  } = useForgotPasswordForm();

  if (step === FORGOT_PASSWORD_STEP.OTP) {
    return (
      <OtpScreen
        email={email}
        type={OTP_TYPE.RECOVERY}
        onVerified={goToReset}
        onBack={handleOtpBack}
      />
    );
  }

  if (step === FORGOT_PASSWORD_STEP.RESET) {
    return <ResetPasswordScreen onComplete={handleResetComplete} />;
  }

  if (step === FORGOT_PASSWORD_STEP.DONE) {
    return (
      <Screen>
        <Body centered>
          <Text variant="title" align="center" style={styles.doneTitle}>
            {MSG.PASSWORD_CHANGED_TITLE}
          </Text>
          <Text variant="subtitle" align="center" style={styles.doneSubtitle}>
            {MSG.PASSWORD_CHANGED_SUBTITLE}
          </Text>
          <Button title={MSG.BACK_TO_LOGIN} onPress={onBack} variant="primary" />
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={styles.title}>
          {MSG.FORGOT_PASSWORD_TITLE}
        </Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          {MSG.FORGOT_PASSWORD_SUBTITLE}
        </Text>

        <TextInput
          ref={emailRef}
          label={MSG.LABEL_EMAIL}
          placeholder={MSG.PLACEHOLDER_EMAIL}
          value={email}
          onChangeText={(v) => { setEmail(v); setError(""); }}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={handleSubmit}
          error={error}
          containerStyle={styles.fieldMargin}
        />

        <Button
          title={MSG.BTN_SEND_OTP}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
          style={styles.buttonMargin}
        />

        <Button title={MSG.BACK_TO_LOGIN} onPress={onBack} variant="secondary" />
      </Body>
    </Screen>
  );
}
