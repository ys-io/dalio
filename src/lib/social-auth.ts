import { Platform } from "react-native";
import { supabase } from "./supabase";

let GoogleSignin: any;

if (Platform.OS !== "web") {
  GoogleSignin =
    require("@react-native-google-signin/google-signin").GoogleSignin;

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

export async function signInWithGoogle() {
  if (Platform.OS === "web") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return;
  }

  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (!response.data?.idToken) {
    throw new Error("Google 로그인에서 ID 토큰을 받지 못했습니다.");
  }

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.data.idToken,
  });

  if (error) throw error;
}
