"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClientComponent } from "@/lib/supabase-browser";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useUIStore();
  const t = getT(language);

  useEffect(() => {
    const supabase = createClientComponent();
    let mounted = true;

    // 1) Cek error eksplisit di URL hash (token expired/invalid).
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const hashError = hashParams.get("error_description") ?? hashParams.get("error");
      if (hashError) {
        setError(decodeURIComponent(hashError.replace(/\+/g, " ")));
        return;
      }
    }

    // 2) Cek session — Supabase auto-parse URL hash saat browser client init.
    //    Kalau hash valid recovery, session udah ada di sini.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setReady(true);
        return;
      }
      // Belum siap — coba lagi sekali setelah 1.5s (parse URL kadang async).
      setTimeout(() => {
        if (!mounted) return;
        supabase.auth.getSession().then(({ data: { session: s2 } }) => {
          if (!mounted) return;
          if (s2) setReady(true);
          else setError("Tautan reset password tidak valid atau sudah kadaluarsa.");
        });
      }, 1500);
    });

    // 3) Listener PASSWORD_RECOVERY sebagai fallback.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error(t.auth.password_mismatch);
      return;
    }
    if (password.length < 6) {
      toast.error(t.auth.password_min);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClientComponent();
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) throw updateErr;
      // Logout recovery session — paksa user login fresh dengan password baru.
      await supabase.auth.signOut();
      toast.success(t.auth.reset_success);
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.auth.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            lumara.id
          </span>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">{t.auth.reset_title}</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-card">
        {error ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium">{error}</p>
            <p className="text-xs text-muted-foreground">Silakan minta tautan reset password baru.</p>
            <Link
              href="/forgot-password"
              className="block w-full py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors text-sm text-center"
            >
              Minta Tautan Baru
            </Link>
            <Link
              href="/login"
              className="block text-xs text-muted-foreground hover:text-primary"
            >
              {t.auth.back_login}
            </Link>
          </div>
        ) : !ready ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t.auth.reset_verifying}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.auth.new_password}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-[10px] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.auth.confirm_password}</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-[10px] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t.auth.processing : t.auth.reset_submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
