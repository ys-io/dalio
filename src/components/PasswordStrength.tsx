import { View, StyleSheet } from "react-native";
import { Text } from "@ys-io/ui";

interface Props {
  password: string;
}

const rules = [
  { label: "8자 이상", test: (p: string) => p.length >= 8 },
  { label: "대문자 포함", test: (p: string) => /[A-Z]/.test(p) },
  { label: "특수문자 포함", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export function PasswordStrength({ password }: Props) {
  if (!password) return null;

  const passed = rules.filter((r) => r.test(password)).length;
  const barColor =
    passed === 3 ? "#22c55e" : passed === 2 ? "#eab308" : "#ff453a";

  return (
    <View style={styles.container}>
      <View style={styles.rules}>
        {rules.map((rule) => {
          const ok = rule.test(password);
          return (
            <Text
              key={rule.label}
              variant="caption"
              color={ok ? "#22c55e" : "#636366"}
              style={{ fontSize: 12 }}
            >
              {ok ? "✓" : "○"} {rule.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  barContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  rules: {
    gap: 4,
  },
});
