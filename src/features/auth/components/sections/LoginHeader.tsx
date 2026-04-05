import { Text } from "@ys-io/ui";
import { styles } from "./LoginHeader.styles";

export function LoginHeader() {
  return (
    <>
      <Text variant="title" align="center" style={styles.title}>
        📅 Dalio
      </Text>
      <Text variant="subtitle" align="center" style={styles.subtitle}>
        친구들과 일정을 공유하고{"\n"}함께 계획을 세워보세요
      </Text>
    </>
  );
}
