import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@services/supabase";

type Provider = "email" | "google";

interface AuthUser {
  id: string;
  email: string | null;
  provider: Provider;
  displayName: string | null;
  avatarUrl: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  pauseAuthListener: () => void;
  resumeAuthListener: () => void;
}

function mapUser(user: User): AuthUser {
  const provider = (user.app_metadata?.provider ?? "email") as Provider;
  return {
    id: user.id,
    email: user.email ?? null,
    provider,
    displayName:
      user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
}

const noop = async () => {};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signInWithEmail: noop,
  signUpWithEmail: noop,
  signOut: noop,
  pauseAuthListener: () => {},
  resumeAuthListener: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const paused = useRef(false);

  const pauseAuthListener = useCallback(() => {
    paused.current = true;
  }, []);

  const resumeAuthListener = useCallback(() => {
    paused.current = false;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (paused.current) return;
      if (event === "PASSWORD_RECOVERY") return;
      setUser(session?.user ? mapUser(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        pauseAuthListener,
        resumeAuthListener,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
