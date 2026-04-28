"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClientComponent } from "@/lib/supabase-browser";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { language } = useUIStore();
  const t = getT(language);
  const supabase = createClientComponent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success(t.auth.forgot_sent);
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
        <p className="mt-2 text-sm text-muted-foreground">{t.auth.forgot_title}</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-card">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{t.auth.forgot_sent_desc}</p>
            <p className="text-xs text-muted-foreground font-medium">{email}</p>
            <Link
              href="/login"
              className="block w-full py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors text-sm text-center"
            >
              {t.auth.back_login}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">{t.auth.forgot_desc}</p>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t.auth.processing : t.auth.forgot_submit}
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link href="/login" className="hover:text-primary transition-colors">{t.auth.back_login}</Link>
      </p>
    </div>
  );
}
