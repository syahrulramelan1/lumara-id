import { HiOutlineMoon, HiOutlineSun, HiOutlineBell, HiOutlineMenu, HiOutlineExternalLink } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
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

  return (
    <header className="dark:bg-blackPrimary bg-whiteSecondary relative border-b dark:border-blackSecondary border-gray-200">
      <div className="flex justify-between items-center px-6 py-4 max-xl:flex-col max-xl:gap-y-4 max-[400px]:px-3">
        <HiOutlineMenu
          className="text-2xl dark:text-whiteSecondary text-blackPrimary absolute bottom-6 left-4 xl:hidden max-sm:static max-sm:order-1 cursor-pointer"
          onClick={() => dispatch(setSidebar())}
        />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary">lumara.id</span>
          <span className="text-xs px-2 py-0.5 dark:bg-whiteSecondary bg-blackPrimary dark:text-blackPrimary text-whiteSecondary rounded font-semibold">
            ADMIN
          </span>
        </Link>

        <SearchInput />

        <div className="flex gap-3 items-center max-xl:justify-center">
          {/* Link to store */}
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Website Toko"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm dark:bg-blackSecondary bg-gray-100 dark:text-whiteSecondary text-blackPrimary border dark:border-blackSecondary border-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <HiOutlineExternalLink className="text-base" />
            <span className="max-sm:hidden">Lihat Toko</span>
          </a>

          {/* Dark mode toggle */}
          {darkMode ? (
            <HiOutlineSun
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          ) : (
            <HiOutlineMoon
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          )}

          <Link to="/notifications">
            <HiOutlineBell className="text-xl dark:text-whiteSecondary text-blackPrimary" />
          </Link>

          {/* User menu */}
          <div className="flex gap-2 items-center group relative">
            <Link to="/profile" className="flex gap-2 items-center cursor-pointer">
              {avatarUrl ? (
                <img src={avatarUrl} alt="profile" className="rounded-full w-9 h-9 object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full dark:bg-whiteSecondary bg-blackPrimary flex items-center justify-center">
                  <span className="dark:text-blackPrimary text-whiteSecondary text-sm font-bold uppercase">
                    {displayName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex flex-col max-xl:hidden">
                <p className="dark:text-whiteSecondary text-blackPrimary text-sm font-medium">{displayName}</p>
                <p className="dark:text-gray-400 text-gray-500 text-xs">Admin</p>
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              className="ml-1 text-xs dark:text-gray-400 text-gray-500 hover:underline"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
