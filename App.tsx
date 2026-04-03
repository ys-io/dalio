import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/providers/AuthProvider";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoadingScreen } from "./src/components/ui";

function Router() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
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
