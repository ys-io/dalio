import { View } from "react-native";
import { Text } from "@ys-io/ui";
import { PASSWORD_RULES, COLORS } from "../../../../constans";
import { styles } from "./PasswordStrength.styles";

interface Props {
  password: string;
}

export function PasswordStrength({ password }: Props) {
  if (password === undefined) return null;

  return (
    <View style={styles.container}>
      <View style={styles.rules}>
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <View key={rule.label} style={styles.ruleRow}>
              <View style={styles.iconContainer}>
                <Text
                  variant="caption"
                  color={ok ? COLORS.success : COLORS.muted}
                  style={styles.ruleText}
                >
                  {ok ? "✓" : "○"}
                </Text>
              </View>
              <Text
                variant="caption"
                color={ok ? COLORS.success : COLORS.muted}
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
