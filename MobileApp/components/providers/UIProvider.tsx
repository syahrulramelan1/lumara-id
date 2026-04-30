"use client";
import { useEffect } from "react";
import { createClientComponent } from "@/lib/supabase-browser";
import { useAuthStore } from "@/store/authStore";

export function UIProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setDbUser, setLoading, clear } = useAuthStore();

  useEffect(() => {
    const supabase = createClientComponent();

    const syncUser = async (token: string) => {
      try {
        const res = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json() as { success: boolean; user?: import("@/store/authStore").DbUser };
        if (data.success && data.user) setDbUser(data.user);
      } catch { /* ignore */ }
      setLoading(false);
    };

    // Cek session awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { setLoading(false); return; }
      setUser(session.user);
      syncUser(session.access_token);
    });

    // Listen perubahan auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) { clear(); return; }
      setUser(session.user);
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        syncUser(session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
