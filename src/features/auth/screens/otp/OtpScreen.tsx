import { TextInput as RNTextInput, View, Platform } from "react-native";
import { Button, Text, Screen, Body } from "@ys-io/ui";
import { supabase } from "@services/supabase";
import { useOtpTimer } from "@hooks/auth/useOtpTimer";
import { useOtpInput } from "@hooks/auth/useOtpInput";
import { COLORS } from "@constans/colors";
import { MSG } from "@constans/messages";
import { styles } from "./OtpScreen.styles";

interface Props {
  email: string;
  type: "signup" | "recovery";
  onVerified: () => void;
  onBack: () => void;
}

export function OtpScreen({ email, type, onVerified, onBack }: Props) {
  const { remaining, expired, formatTime, restart } = useOtpTimer();

  const submitCode = async (token: string) => {
    if (expired) {
      setError(MSG.OTP_EXPIRED);
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type === "signup" ? "signup" : "recovery",
      });

      if (verifyError) {
        setError(MSG.OTP_INVALID);
        resetCode();
      } else {
        onVerified();
      }
    } catch {
      setError(MSG.NETWORK_ERROR);
    }
  };

  const {
    code,
    error,
    setError,
    inputRefs,
    resetCode,
    handleChange,
    handleKeyPress,
  } = useOtpInput(submitCode);

  const handleResend = async () => {
    setError("");
    try {
      if (type === "signup") {
        await supabase.auth.resend({ type: "signup", email });
      } else {
        await supabase.auth.resetPasswordForEmail(email);
      }
      resetCode();
      restart();
    } catch {
      setError(MSG.RESEND_FAILED);
    }
  };

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={styles.title}>
          {MSG.OTP_TITLE}
        </Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          {email}{MSG.OTP_SUBTITLE_SUFFIX}
        </Text>

        <Text
          variant="body"
          align="center"
          color={expired ? COLORS.error : COLORS.primary}
          style={styles.timer}
        >
          {expired ? MSG.TIMER_EXPIRED : formatTime(remaining)}
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <RNTextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : null,
                error ? styles.codeInputError : null,
                Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {},
              ]}
              value={digit}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={index === 0 ? 6 : 1}
              selectTextOnFocus
              placeholderTextColor={COLORS.muted}
            />
          ))}
        </View>

        {error ? (
          <Text
            variant="caption"
            color={COLORS.error}
            align="center"
            style={styles.errorText}
          >
            {error}
          </Text>
        ) : null}

        <View style={styles.spacer} />

        {expired ? (
          <Button
            title={MSG.BTN_RESEND_OTP}
            onPress={handleResend}
            variant="primary"
            style={styles.resendButton}
          />
        ) : null}

        <Button title={MSG.BACK} onPress={onBack} variant="secondary" />
      </Body>
    </Screen>
  );
}
