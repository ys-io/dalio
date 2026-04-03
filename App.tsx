import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/providers/AuthProvider";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoadingScreen, ThemeProvider } from "@ys-io/ui";

const darkTheme = {
  colors: {
    background: "#000000",
    surface: "#1c1c1e",
    primary: "#1c1c1e",
    primaryForeground: "#ffffff",
    danger: "#ff453a",
    textPrimary: "#ffffff",
    textSecondary: "#ababab",
    textTertiary: "#8e8e93",
    textMuted: "#636366",
    border: "#2c2c2e",
    borderLight: "#1c1c1e",
    placeholder: "#636366",
  },
};

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
