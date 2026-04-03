import { View, StyleSheet } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { Text, Button, Screen, Header, Body, Footer } from "../components/ui";

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <Header>
        <Text variant="title">Dalio</Text>
        <Text variant="subtitle">
          {user?.displayName ?? user?.email ?? "사용자"}님, 환영합니다!
        </Text>
      </Header>

      <Body>
        <View style={styles.calendarPlaceholder}>
          <Text color="#ccc" style={{ fontSize: 18 }}>
            캘린더 영역
          </Text>
        </View>
      </Body>

      <Footer>
        <Button title="로그아웃" onPress={signOut} variant="danger" />
      </Footer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  calendarPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
});
