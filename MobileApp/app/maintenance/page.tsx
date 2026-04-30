export const dynamic = "force-dynamic";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="text-7xl mb-6">🔧</div>

        {/* Logo */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
          Lumara.id
        </h1>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Sedang dalam pemeliharaan
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Website kami sedang dalam proses pemeliharaan untuk memberikan pengalaman yang lebih baik.
          Kami akan kembali sebentar lagi. Terima kasih atas kesabaran Anda.
        </p>

        {/* Divider */}
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
