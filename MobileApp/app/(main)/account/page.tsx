"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, LogIn, LogOut, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getT } from "@/lib/i18n";
import { createClientComponent } from "@/lib/supabase-browser";

export default function AccountPage() {
  const { language } = useUIStore();
  const t = getT(language);
  const { dbUser, user, loading, setDbUser } = useAuthStore();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setName(dbUser?.name ?? "");
    setPhone(dbUser?.phone ?? "");
    setEditing(true);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const supabase = createClientComponent();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json() as { success: boolean; user?: typeof dbUser };
      if (data.success && data.user) {
        setDbUser(data.user);
        toast.success("Profil berhasil diperbarui");
        setEditing(false);
      }
    } catch {
      toast.error("Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClientComponent();
    await supabase.auth.signOut();
    router.push("/");
    toast.success("Berhasil keluar");
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="h-8 w-40 bg-muted rounded-lg animate-pulse mb-6" />
        <div className="bg-card border border-card-border rounded-2xl p-6 animate-pulse h-40" />
      </div>
    );
  }

  // Belum login
  if (!user || !dbUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t.pages.account.title}</h1>
        <div className="bg-card border border-card-border rounded-2xl p-8 mb-6 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">{t.pages.account.login_prompt}</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors">
            <LogIn size={16} />
            {t.pages.account.login_now}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/orders" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
            <Package size={24} className="text-primary" />
            <span className="text-sm font-medium">{t.pages.account.my_orders}</span>
          </Link>
          <Link href="/wishlist" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
            <Heart size={24} className="text-primary" />
            <span className="text-sm font-medium">{t.wishlist.title}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Sudah login
  const initials = (dbUser.name ?? dbUser.email).slice(0, 2).toUpperCase();

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.pages.account.title}</h1>

      {/* Profile card */}
      <div className="bg-card border border-card-border rounded-2xl p-6 mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
            {dbUser.avatar
              ? <img src={dbUser.avatar} alt="avatar" className="w-full h-full object-cover" />
              : initials}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full px-3 py-2 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nomor HP</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    type="tel"
                    className="w-full px-3 py-2 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={saveProfile} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-[10px] hover:bg-primary/90 transition-colors disabled:opacity-60">
                    <Check size={14} /> {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-border text-sm rounded-[10px] hover:bg-muted transition-colors">
                    <X size={14} /> Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-base truncate">{dbUser.name ?? "—"}</h2>
                  <button onClick={startEdit} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground shrink-0">
                    <Edit2 size={15} />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{dbUser.email}</p>
                {dbUser.phone && <p className="text-sm text-muted-foreground mt-0.5">{dbUser.phone}</p>}
                <span className="inline-flex items-center mt-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {dbUser.role}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/orders" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
          <Package size={24} className="text-primary" />
          <span className="text-sm font-medium">{t.pages.account.my_orders}</span>
        </Link>
        <Link href="/wishlist" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
          <Heart size={24} className="text-primary" />
          <span className="text-sm font-medium">{t.wishlist.title}</span>
        </Link>
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 dark:border-red-900/40 text-red-500 rounded-[14px] text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
        <LogOut size={16} />
        Keluar
      </button>
    </div>
  );
}
