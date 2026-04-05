import { View } from "react-native";
import { useAuth } from "@ys-io/auth-kit";
import { Text, Button, Screen, Header, Body, Footer } from "@ys-io/ui";
import { COLORS } from "@constans/colors";
import { HOME_MSG } from "../constans";
import { styles } from "./HomeScreen.styles";

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <Header style={styles.headerBorder}>
        <Text variant="title" style={styles.titleMargin}>Dalio</Text>
        <Text variant="subtitle" style={styles.subtitleMargin}>
          {user?.displayName ?? user?.email ?? HOME_MSG.DEFAULT_USER}{HOME_MSG.WELCOME_SUFFIX}
        </Text>
      </Header>

      <Body>
        <View style={styles.calendarPlaceholder}>
          <Text color={COLORS.muted} style={styles.calendarText}>
            {HOME_MSG.CALENDAR_PLACEHOLDER}
          </Text>
        </View>
      </Body>

      <Footer style={styles.footerBorder}>
        <Button title={HOME_MSG.BTN_LOGOUT} onPress={signOut} variant="danger" />
      </Footer>
    </Screen>
  );
}
