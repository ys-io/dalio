import { Text } from "@ys-io/ui";
import { MSG } from "@constans/messages";
import { styles } from "./LoginHeader.styles";

export function LoginHeader() {
  return (
    <>
      <Text variant="title" align="center" style={styles.title}>
        {MSG.APP_TITLE}
      </Text>
      <Text variant="subtitle" align="center" style={styles.subtitle}>
        {MSG.APP_SUBTITLE}
      </Text>
    </>
  );
}
