import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import toast from "react-hot-toast";
import { InputWithLabel, SimpleInput } from "../components";
import { supabase } from "../lib/supabase";

const RegisterComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) { toast.error("Email dan password wajib diisi"); return; }
    if (password !== confirmPassword) { toast.error("Password tidak cocok"); return; }
    if (password.length < 6) { toast.error("Password minimal 6 karakter"); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) { toast.error(error.message); return; }
    toast.success("Akun berhasil dibuat! Silahkan login.");
    navigate("/login");
  };

  return (
    <div className="w-[500px] dark:bg-gray-900 bg-white flex flex-col justify-center items-center py-10 px-8 max-sm:w-full">
      <div className="flex flex-col items-center gap-8 w-full">
        <h2 className="text-2xl dark:text-whiteSecondary text-blackPrimary font-bold">
          Buat Akun Admin
        </h2>

        <div className="w-full flex flex-col gap-5">
          <InputWithLabel label="Email">
            <SimpleInput type="email" placeholder="admin@lumara.id"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </InputWithLabel>

          <InputWithLabel label="Password">
            <SimpleInput type="password" placeholder="Minimal 6 karakter"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </InputWithLabel>

          <InputWithLabel label="Konfirmasi Password">
            <SimpleInput type="password" placeholder="Ulangi password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </InputWithLabel>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="dark:bg-whiteSecondary bg-blackPrimary w-full py-2 text-lg dark:hover:bg-white hover:bg-blackSecondary duration-200 flex items-center justify-center dark:text-blackPrimary text-whiteSecondary font-semibold disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>

        <p className="dark:text-gray-400 text-gray-700 text-base flex gap-1 items-center">
          Sudah punya akun?{" "}
          <Link to="/login"
            className="dark:text-whiteSecondary text-blackPrimary hover:underline flex gap-1 items-center">
            Login <FaArrowRight className="mt-[2px]" />
          </Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterComponent;
