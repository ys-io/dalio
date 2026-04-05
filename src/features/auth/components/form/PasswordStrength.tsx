import { View } from "react-native";
import { Text } from "@ys-io/ui";
import { styles } from "./PasswordStrength.styles";

interface Props {
  password: string;
}

const rules = [
  { label: "8자 이상", test: (p: string) => p.length >= 8 },
  { label: "대문자 포함", test: (p: string) => /[A-Z]/.test(p) },
  { label: "특수문자 포함", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export function PasswordStrength({ password }: Props) {
  if (password === undefined) return null;

  return (
    <View style={styles.container}>
      <View style={styles.rules}>
        {rules.map((rule) => {
          const ok = rule.test(password);
          return (
            <View key={rule.label} style={styles.ruleRow}>
              <View style={styles.iconContainer}>
                <Text
                  variant="caption"
                  color={ok ? "#22c55e" : "#636366"}
                  style={styles.ruleText}
                >
                  {ok ? "✓" : "○"}
                </Text>
              </View>
              <Text
                variant="caption"
                color={ok ? "#22c55e" : "#636366"}
                style={styles.ruleText}
              >
                {rule.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
