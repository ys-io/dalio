import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { login as kakaoLogin } from "@react-native-seoul/kakao-login";
import NaverLogin from "@react-native-seoul/naver-login";
import { supabase } from "./supabase";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

NaverLogin.initialize({
  appName: "Dalio",
  consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID!,
  consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET!,
});

// ─── Google ─────────────────────────────────────────────
export async function signInWithGoogle() {
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

// ─── Kakao ──────────────────────────────────────────────
export async function signInWithKakao() {
  const result = await kakaoLogin();

  const { error } = await supabase.functions.invoke("social-auth", {
    body: {
      provider: "kakao",
      accessToken: result.accessToken,
    },
  });

  if (error) throw error;
}

// ─── Naver ──────────────────────────────────────────────
export async function signInWithNaver() {
  const { successResponse, failureResponse } = await NaverLogin.login();

  if (failureResponse || !successResponse) {
    throw new Error(
      failureResponse?.message ?? "네이버 로그인에 실패했습니다.",
    );
  }

  const { error } = await supabase.functions.invoke("social-auth", {
    body: {
      provider: "naver",
      accessToken: successResponse.accessToken,
    },
  });

  if (error) throw error;
}
