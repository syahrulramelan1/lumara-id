import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";
const SECRET = (import.meta.env.VITE_ADMIN_SECRET as string) || "";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: string | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null, user: null, role: null, isAdmin: false, loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchRole(s: Session) {
    try {
      const res = await fetch(`${API_URL}/api/admin/me`, {
        headers: {
          "x-admin-secret": SECRET,
          "Authorization": `Bearer ${s.access_token}`,
        },
      });
      const json = await res.json();
      setRole(json.role ?? null);
    } catch {
      setRole(null);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) await fetchRole(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s) {
        await fetchRole(s);
      } else {
        setRole(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{
      session, user: session?.user ?? null,
      role, isAdmin: role === "ADMIN",
      loading, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
