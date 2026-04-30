import { useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const LoginComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login berhasil!");
      navigate("/");
    }
  };

  return (
    <div className="card w-full max-w-[440px] p-8 flex flex-col gap-7">

      {/* ── Brand header ── */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center shadow-lg shadow-violet-300/40 dark:shadow-violet-900/50">
          <span className="text-white text-3xl font-extrabold tracking-tighter select-none">L</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            lumara<span className="text-[var(--brand)]">.id</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Admin Dashboard</p>
        </div>
        <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full bg-[var(--brand-light)] text-[var(--brand)] border border-[var(--border-2)] tracking-wide">
          ADMINISTRATOR ONLY
        </span>
      </div>

      <div className="h-px bg-[var(--border)]" />

      {/* ── Form ── */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Email</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lumara.id"
              required
              autoComplete="email"
              className="input-base pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base pointer-events-none" />
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="input-base pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
              tabIndex={-1}
              aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPwd ? <HiEyeOff className="text-base" /> : <HiEye className="text-base" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-base mt-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : "Masuk"}
        </button>
      </form>

      <p className="text-xs text-[var(--text-muted)] text-center">
        Tidak punya akses?{" "}
        <span className="text-[var(--brand)] font-medium">Hubungi super admin.</span>
      </p>
    </div>
  );
};
export default LoginComponent;
