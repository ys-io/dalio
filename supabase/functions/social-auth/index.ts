import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface KakaoUser {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

interface NaverUser {
  response: {
    id: string;
    email?: string;
    name?: string;
    profile_image?: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { provider, accessToken } = await req.json();

    if (!provider || !accessToken) {
      return new Response(
        JSON.stringify({ error: "provider and accessToken are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let email: string;
    let name: string | null = null;
    let avatarUrl: string | null = null;
    let providerId: string;

    if (provider === "kakao") {
      const res = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to verify Kakao token");
      const user: KakaoUser = await res.json();
      providerId = String(user.id);
      email = user.kakao_account?.email ?? `kakao_${user.id}@kakao.local`;
      name = user.kakao_account?.profile?.nickname ?? null;
      avatarUrl = user.kakao_account?.profile?.profile_image_url ?? null;
    } else if (provider === "naver") {
      const res = await fetch("https://openapi.naver.com/v1/nid/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to verify Naver token");
      const data: NaverUser = await res.json();
      providerId = data.response.id;
      email = data.response.email ?? `naver_${data.response.id}@naver.local`;
      name = data.response.name ?? null;
      avatarUrl = data.response.profile_image ?? null;
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) =>
        u.app_metadata?.provider === provider &&
        u.app_metadata?.provider_id === providerId,
    );

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { full_name: name, avatar_url: avatarUrl },
      });
    } else {
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          app_metadata: { provider, provider_id: providerId },
          user_metadata: { full_name: name, avatar_url: avatarUrl },
        });
      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Generate session
    const { data: session, error: sessionError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (sessionError) throw sessionError;

    return new Response(
      JSON.stringify({
        token_hash: session.properties?.hashed_token,
        email,
        redirect_to: "dalio://auth/callback",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
