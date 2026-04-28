import { useState } from "react";
import { FaReact } from "react-icons/fa6";
import { InputWithLabel, SimpleInput } from "../components";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const LoginComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="w-[500px] h-auto dark:bg-gray-900 bg-white flex flex-col justify-between items-center py-10 px-8 max-sm:w-[400px] max-[420px]:w-[320px]">
      <div className="flex flex-col items-center gap-8 w-full">
        <FaReact className="text-5xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 cursor-pointer" />
        <div className="text-center">
          <h2 className="text-2xl dark:text-whiteSecondary text-blackPrimary font-bold">lumara.id Admin</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Khusus administrator — akun dibuat oleh super admin</p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          <InputWithLabel label="Email">
            <SimpleInput
              type="email"
              placeholder="admin@lumara.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWithLabel>
          <InputWithLabel label="Password">
            <SimpleInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputWithLabel>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 dark:bg-whiteSecondary bg-blackPrimary dark:text-blackPrimary text-whiteSecondary font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-xs dark:text-gray-500 text-gray-400 text-center">
          Tidak punya akses? Hubungi super admin.
        </p>
      </div>
    </div>
  );
};
export default LoginComponent;
