import { View, StyleSheet } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { Text, Button, Screen, Header, Body, Footer } from "@ys-io/ui";

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <Header style={{ borderBottomColor: "#2c2c2e" }}>
        <Text variant="title">Dalio</Text>
        <Text variant="subtitle">
          {user?.displayName ?? user?.email ?? "사용자"}님, 환영합니다!
        </Text>
      </Header>

      <Body>
        <View style={styles.calendarPlaceholder}>
          <Text color="#636366" style={{ fontSize: 18 }}>
            캘린더 영역
          </Text>
        </View>
      </Body>

      <Footer style={{ borderTopColor: "#2c2c2e" }}>
        <Button title="로그아웃" onPress={signOut} variant="danger" />
      </Footer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  calendarPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2c2c2e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
  },
});
