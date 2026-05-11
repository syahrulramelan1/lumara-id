"use client";
import { useEffect } from "react";
import { createClientComponent } from "@/lib/supabase-browser";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function UIProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setDbUser, setLoading, clear } = useAuthStore();
  const { syncFromServer } = useWishlistStore();

  useEffect(() => {
    const supabase = createClientComponent();
    let mounted = true;

    const syncUser = async (token: string) => {
      try {
        const res = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        // Token tidak valid (akun dihapus / sesi expired di backend) → force sign out
        if (res.status === 401 || res.status === 403) {
          await supabase.auth.signOut();
          if (!mounted) return;
          clear();
          syncFromServer([]);
          setLoading(false);
          return;
        }
        const data = await res.json() as { success: boolean; user?: import("@/store/authStore").DbUser };
        if (!mounted) return;
        if (data.success && data.user) setDbUser(data.user);
      } catch { /* network error — biarin user tetap login dengan state lama */ }
      if (mounted) setLoading(false);
    };

    // Cek session awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session?.user) { setLoading(false); return; }
      setUser(session.user);
      syncUser(session.access_token);
    });

    // Listen perubahan auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session?.user) {
        clear();
        syncFromServer([]);
        return;
      }
      setUser(session.user);
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        syncUser(session.access_token);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
