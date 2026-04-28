import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="flex h-screen items-center justify-center dark:bg-blackPrimary bg-whiteSecondary">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!session) return <Navigate to="/login" replace />;

  if (!isAdmin) return (
    <div className="flex h-screen flex-col items-center justify-center dark:bg-blackPrimary bg-whiteSecondary gap-4">
      <p className="text-2xl font-bold dark:text-red-400 text-red-600">Akses Ditolak</p>
      <p className="dark:text-gray-400 text-gray-600 text-sm">
        Akun Anda tidak memiliki izin admin.
      </p>
      <button
        onClick={async () => { const { supabase } = await import("../lib/supabase"); await supabase.auth.signOut(); window.location.href = "/login"; }}
        className="mt-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
      >
        Keluar
      </button>
    </div>
  );

  return <>{children}</>;
}
