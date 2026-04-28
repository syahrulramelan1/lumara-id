import { HiOutlineHome, HiOutlineTag, HiOutlineTruck, HiOutlineStar, HiOutlineInformationCircle, HiOutlineX, HiOutlineUser, HiOutlineExternalLink } from "react-icons/hi";
import { HiOutlineDevicePhoneMobile, HiOutlineUserGroup } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { NavLink } from "react-router-dom";

const STORE_URL = (import.meta.env.VITE_STORE_URL as string) || "https://lumara-id-mobile.onrender.com";

const navActive = "flex items-center gap-4 py-3.5 px-6 dark:bg-whiteSecondary bg-white dark:text-blackPrimary text-blackPrimary font-semibold";
const navInactive = "flex items-center gap-4 py-3.5 px-6 dark:bg-blackPrimary bg-whiteSecondary dark:hover:bg-blackSecondary hover:bg-white dark:text-whiteSecondary text-blackPrimary transition-colors";

const Sidebar = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const sidebarClass = isSidebarOpen ? "sidebar-open" : "sidebar-closed";

  return (
    <div className="relative">
      <div className={`w-64 min-h-screen dark:bg-blackPrimary bg-whiteSecondary pt-4 xl:sticky xl:top-0 xl:z-10 max-xl:fixed max-xl:top-0 max-xl:z-10 xl:translate-x-0 flex flex-col ${sidebarClass}`}>
        <HiOutlineX
          className="dark:text-whiteSecondary text-blackPrimary text-2xl ml-auto mb-2 mr-3 cursor-pointer xl:hidden"
          onClick={() => dispatch(setSidebar())}
        />

        <nav className="flex flex-col flex-1">
          <NavLink to="/" end className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineHome className="text-xl shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/products" className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineDevicePhoneMobile className="text-xl shrink-0" />
            <span>Produk</span>
          </NavLink>

          <NavLink to="/categories" className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineTag className="text-xl shrink-0" />
            <span>Kategori</span>
          </NavLink>

          <NavLink to="/orders" className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineTruck className="text-xl shrink-0" />
            <span>Pesanan</span>
          </NavLink>

          <NavLink to="/users" className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineUserGroup className="text-xl shrink-0" />
            <span>Pengguna</span>
          </NavLink>

          <NavLink to="/reviews" className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineStar className="text-xl shrink-0" />
            <span>Ulasan</span>
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineUser className="text-xl shrink-0" />
            <span>Profil</span>
          </NavLink>
        </nav>

        <div className="border-t dark:border-blackSecondary border-gray-200">
          <NavLink to="/help-desk" className={({ isActive }) => isActive ? navActive : navInactive}>
            <HiOutlineInformationCircle className="text-xl shrink-0" />
            <span>Bantuan</span>
          </NavLink>
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={navInactive}
          >
            <HiOutlineExternalLink className="text-xl shrink-0" />
            <span>Buka Toko</span>
          </a>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
