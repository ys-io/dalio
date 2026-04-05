import { View } from "react-native";
import { useAuth } from "@providers/AuthProvider";
import { Text, Button, Screen, Header, Body, Footer } from "@ys-io/ui";
import { COLORS } from "@constans/colors";
import { MSG } from "@constans/messages";
import { styles } from "./HomeScreen.styles";

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <Header style={styles.headerBorder}>
        <Text variant="title" style={styles.titleMargin}>Dalio</Text>
        <Text variant="subtitle" style={styles.subtitleMargin}>
          {user?.displayName ?? user?.email ?? MSG.HOME_DEFAULT_USER}{MSG.HOME_WELCOME_SUFFIX}
        </Text>
      </Header>

      <Body>
        <View style={styles.calendarPlaceholder}>
          <Text color={COLORS.muted} style={styles.calendarText}>
            {MSG.HOME_CALENDAR_PLACEHOLDER}
          </Text>
        </View>
      </Body>

      <Footer style={styles.footerBorder}>
        <Button title={MSG.BTN_LOGOUT} onPress={signOut} variant="danger" />
      </Footer>
    </Screen>
  );
}
