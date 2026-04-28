"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClientComponent } from "@/lib/supabase-browser";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { language } = useUIStore();
  const t = getT(language);

  const supabase = createClientComponent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t.auth.success_login);
        router.push("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success(t.auth.success_register);
      }
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
        <p className="mt-2 text-sm text-muted-foreground">
          {isLogin ? t.auth.login_title : t.auth.register_title}
        </p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t.auth.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-[10px] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t.auth.password}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-[10px] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t.auth.processing : isLogin ? t.auth.sign_in : t.auth.sign_up}
          </button>
        </form>

        {isLogin && (
          <div className="mt-3 text-center">
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {t.auth.forgot_link}
            </Link>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? t.auth.no_account : t.auth.have_account}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? t.auth.register_link : t.auth.sign_in}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">{t.auth.back_home}</Link>
      </p>
    </div>
  );
}
