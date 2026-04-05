import { useEffect, useRef, useState } from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import { Button, Text, Screen, Body } from "@ys-io/ui";
import { supabase } from "../lib/supabase";

interface Props {
  email: string;
  type: "signup" | "recovery";
  onVerified: () => void;
  onBack: () => void;
}

const OTP_DURATION = 180; // 3분

export function OtpScreen({ email, type, onVerified, onBack }: Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(OTP_DURATION);
  const [expired, setExpired] = useState(false);
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  useEffect(() => {
    if (remaining <= 0) {
      setExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      // 붙여넣기
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
    setLoading(false);
  };

  const handleResend = async () => {
    setError("");
    setCode(["", "", "", "", "", ""]);
    setExpired(false);
    setRemaining(OTP_DURATION);

    if (type === "signup") {
      await supabase.auth.resend({ type: "signup", email });
    } else {
      await supabase.auth.resetPasswordForEmail(email);
    }

    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={{ marginBottom: 8 }}>
          인증 코드 입력
        </Text>
        <Text
          variant="subtitle"
          align="center"
          style={{ marginBottom: 8, lineHeight: 24 }}
        >
          {email}으로{"\n"}6자리 코드를 보냈습니다.
        </Text>

        <Text
          variant="body"
          align="center"
          color={expired ? "#ff453a" : "#6366f1"}
          style={{ marginBottom: 32, fontSize: 20, fontWeight: "bold" }}
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
            style={{ marginBottom: 16 }}
          >
            {error}
          </Text>
        ) : null}

        <View style={{ marginBottom: 32 }} />

        {expired ? (
          <Button
            title="코드 재전송"
            onPress={handleResend}
            variant="primary"
            style={{ marginBottom: 12 }}
          />
        ) : null}

        <Button
          title="돌아가기"
          onPress={onBack}
          variant="secondary"
          disabled={loading}
        />
      </Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  codeInputFilled: {
    borderColor: "#6366f1",
  },
  codeInputError: {
    borderColor: "#ff453a",
  },
});
