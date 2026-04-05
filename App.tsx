import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@providers/AuthProvider";
import { LoginScreen } from "@features/auth/screens/login/LoginScreen";
import { HomeScreen } from "@features/home/screens/HomeScreen";
import { LoadingScreen, ThemeProvider } from "@ys-io/ui";
import { darkTheme } from "@constans/theme";

function Router() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <HomeScreen /> : <LoginScreen />;
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <Router />
        <StatusBar style="light" />
      </AuthProvider>
    </ThemeProvider>
  );
}
