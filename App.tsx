import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/providers/AuthProvider";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ActivityIndicator, View } from "react-native";

function Router() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <HomeScreen /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
