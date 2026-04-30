"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json() as { maintenance: boolean };
        if (!data.maintenance) router.replace("/");
      } catch {
        // gagal fetch — coba lagi nanti
      }
    };

    // cek langsung saat halaman dibuka
    check();

    // polling setiap 10 detik
    const interval = setInterval(check, 10_000);
    return () => clearInterval(interval);
  }, [router]);

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
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Akan kembali otomatis saat selesai
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
