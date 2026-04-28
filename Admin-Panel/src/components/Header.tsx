import { HiOutlineMoon, HiOutlineSun, HiOutlineMenu, HiOutlineExternalLink, HiOutlineLogout } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import { toggleDarkMode } from "../features/darkMode/darkModeSlice";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const STORE_URL = (import.meta.env.VITE_STORE_URL as string) || "https://lumara-id-mobile.onrender.com";

const Header = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.darkMode);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Berhasil keluar");
  };

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Admin";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-[var(--surface)] border-b border-[var(--border)] backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 gap-4">

        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setSidebar())}
            className="xl:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-3)] transition-colors"
          >
            <HiOutlineMenu className="text-xl" />
          </button>
          <Link to="/" className="xl:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-bold text-sm text-[var(--text)]">lumara.id</span>
          </Link>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Visit store */}
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--text-muted)] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <HiOutlineExternalLink className="text-sm" />
            <span>Lihat Toko</span>
          </a>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-3)] hover:text-[var(--brand)] transition-colors"
            title={darkMode ? "Mode Terang" : "Mode Gelap"}
          >
            {darkMode
              ? <HiOutlineSun className="text-xl" />
              : <HiOutlineMoon className="text-xl" />}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-[var(--border)] mx-1" />

          {/* User */}
          <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center gap-2 group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--border)] group-hover:ring-brand-500 transition-all" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center ring-2 ring-[var(--border)] group-hover:ring-brand-500 transition-all">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
              <div className="hidden md:flex flex-col leading-none">
                <span className="text-sm font-semibold text-[var(--text)]">{displayName}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">Admin</span>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              title="Keluar"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
            >
              <HiOutlineLogout className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
