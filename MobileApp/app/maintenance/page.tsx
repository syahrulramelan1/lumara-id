"use client";
import { useEffect, useState } from "react";

export default function MaintenancePage() {
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const check = async () => {
      if (cancelled) return;
      setChecking(true);
      try {
        // cache:"no-store" — pastikan selalu fresh dari server
        const res = await fetch("/api/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { maintenance: boolean };
        if (!cancelled && !data.maintenance) {
          // HARD reload — bukan router.replace — supaya layout di-server di-evaluate
          // ulang dengan cache yang sudah di-invalidate. router.replace bisa
          // pakai stale RSC cache dan loop balik ke /maintenance.
          window.location.href = "/home";
        }
      } catch {
        // gagal fetch — coba lagi nanti
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    const schedule = (ms: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        await check();
        // Tetap polling kalau masih di halaman ini
        if (!cancelled && !document.hidden) schedule(30_000);
      }, ms);
    };

    // Pause polling saat tab di-minimize/hidden, resume saat balik.
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (timer) { clearTimeout(timer); timer = null; }
      } else {
        check().then(() => schedule(30_000));
      }
    };

    // Cek pertama langsung saat halaman dibuka, lalu polling tiap 30 detik.
    check().then(() => schedule(30_000));
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md w-full">
        <div className="text-7xl mb-6">🔧</div>

        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
          Lumara.id
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Sedang dalam pemeliharaan
        </h2>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Website kami sedang dalam proses pemeliharaan untuk memberikan pengalaman yang lebih baik.
          Kami akan kembali sebentar lagi. Terima kasih atas kesabaran Anda.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-6">
          <span className={`w-1.5 h-1.5 rounded-full ${checking ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
          {checking ? "Mengecek status…" : "Akan kembali otomatis saat selesai"}
        </div>

        <div className="border-t border-gray-200 pt-5 text-xs text-gray-400">
          Jika ada pertanyaan, hubungi kami di{" "}
          <a href="mailto:hello@lumara.id" className="text-purple-600 hover:underline">
            hello@lumara.id
          </a>
        </div>
      </div>
    </div>
  );
}
