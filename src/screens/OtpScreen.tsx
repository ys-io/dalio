import { useEffect, useRef, useState, useCallback } from "react";
import { TextInput as RNTextInput, View, Platform } from "react-native";
import { Button, Text, Screen, Body } from "@ys-io/ui";
import { supabase } from "../lib/supabase";
import { styles } from "./OtpScreen.styles";

interface Props {
  email: string;
  type: "signup" | "recovery";
  onVerified: () => void;
  onBack: () => void;
}

const OTP_DURATION = 180;

export function OtpScreen({ email, type, onVerified, onBack }: Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [remaining, setRemaining] = useState(OTP_DURATION);
  const [expired, setExpired] = useState(false);
  const inputRefs = useRef<(RNTextInput | null)[]>(Array(6).fill(null));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      digits.forEach((d, i) => {
        if (i < 6) newCode[i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();

      if (digits.length === 6) {
        submitCode(newCode.join(""));
      }
      return;
    }

    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d) && newCode.join("").length === 6) {
      submitCode(newCode.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitCode = async (token: string) => {
    if (expired) {
      setError("인증 코드가 만료되었습니다. 다시 요청해주세요.");
      return;
    }

    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type === "signup" ? "signup" : "recovery",
      });

      if (verifyError) {
        setError("인증 코드가 올바르지 않습니다.");
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        onVerified();
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      if (type === "signup") {
        await supabase.auth.resend({ type: "signup", email });
      } else {
        await supabase.auth.resetPasswordForEmail(email);
      }

      setCode(["", "", "", "", "", ""]);
      setExpired(false);
      setRemaining(OTP_DURATION);
      startTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError("재전송에 실패했습니다. 인터넷 연결을 확인해주세요.");
    }
    setResending(false);
  };

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={styles.title}>
          인증 코드 입력
        </Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          {email}으로{"\n"}6자리 코드를 보냈습니다.
        </Text>

        <Text
          variant="body"
          align="center"
          color={expired ? "#ff453a" : "#6366f1"}
          style={styles.timer}
        >
          {expired ? "만료됨" : formatTime(remaining)}
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
              placeholderTextColor="#636366"
            />
          ))}
        </View>

        {error ? (
          <Text
            variant="caption"
            color="#ff453a"
            align="center"
            style={styles.errorText}
          >
            {error}
          </Text>
        ) : null}

        <View style={styles.spacer} />

        {expired ? (
          <Button
            title="코드 재전송"
            onPress={handleResend}
            variant="primary"
            loading={resending}
            disabled={resending}
            style={styles.resendButton}
          />
        ) : null}

        <Button
          title="돌아가기"
          onPress={onBack}
          variant="secondary"
          disabled={loading || resending}
        />
      </Body>
    </Screen>
  );
}
