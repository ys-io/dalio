import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dalio</Text>
      <Text style={styles.welcome}>
        {user?.displayName ?? user?.email ?? "사용자"}님, 환영합니다!
      </Text>

      <View style={styles.calendarPlaceholder}>
        <Text style={styles.placeholderText}>캘린더 영역</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  welcome: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  calendarPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  placeholderText: {
    color: "#ccc",
    fontSize: 18,
  },
  signOutButton: {
    marginTop: 16,
    padding: 14,
    alignItems: "center",
  },
  signOutText: {
    color: "#e00",
    fontSize: 16,
  },
});
