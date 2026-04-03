import { View, StyleSheet } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { Text, Button, ScreenContainer } from "../components/ui";

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScreenContainer>
      <Text variant="title" style={{ marginBottom: 4 }}>
        Dalio
      </Text>
      <Text variant="subtitle" style={{ marginBottom: 24 }}>
        {user?.displayName ?? user?.email ?? "사용자"}님, 환영합니다!
      </Text>

      <View style={styles.calendarPlaceholder}>
        <Text color="#ccc" style={{ fontSize: 18 }}>
          캘린더 영역
        </Text>
      </View>

      <Button
        title="로그아웃"
        onPress={signOut}
        variant="danger"
        style={{ marginTop: 16 }}
      />
    </ScreenContainer>
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
