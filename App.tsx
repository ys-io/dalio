import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@ys-io/ui";
import { AuthKit } from "@ys-io/auth-kit";
import { supabase } from "@services/supabase";
import { darkTheme } from "@constans/theme";
import { GoogleIcon } from "@features/auth/components/icons/GoogleIcon";
import { TermsContent } from "@features/auth/content/TermsContent";
import { PrivacyContent } from "@features/auth/content/PrivacyContent";
import { HomeScreen } from "@features/home/screens/HomeScreen";

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthKit
        config={{
          supabase,
          appName: "Dalio",
          appIcon: "📅",
          appSubtitle: "친구들과 일정을 공유하고\n함께 계획을 세워보세요",
          googleLogin: true,
          googleIcon: <GoogleIcon />,
          terms: { content: <TermsContent /> },
          privacy: { content: <PrivacyContent /> },
        }}
      >
        <HomeScreen />
      </AuthKit>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
