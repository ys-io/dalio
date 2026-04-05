import { View } from "react-native";
import { useAuth } from "../../../providers/AuthProvider";
import { Text, Button, Screen, Header, Body, Footer } from "@ys-io/ui";
import { styles } from "./HomeScreen.styles";

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <Header style={styles.headerBorder}>
        <Text variant="title" style={styles.titleMargin}>Dalio</Text>
        <Text variant="subtitle" style={styles.subtitleMargin}>
          {user?.displayName ?? user?.email ?? "사용자"}님, 환영합니다!
        </Text>
      </Header>

      <Body>
        <View style={styles.calendarPlaceholder}>
          <Text color="#636366" style={styles.calendarText}>
            캘린더 영역
          </Text>
        </View>
      </Body>

      <Footer style={styles.footerBorder}>
        <Button title="로그아웃" onPress={signOut} variant="danger" />
      </Footer>
    </Screen>
  );
}
