import { HiOutlineHome, HiOutlineTag, HiOutlineTruck, HiOutlineStar, HiOutlineInformationCircle, HiOutlineX, HiOutlineUser, HiOutlineExternalLink } from "react-icons/hi";
import { HiOutlineDevicePhoneMobile, HiOutlineUserGroup } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { NavLink } from "react-router-dom";

const STORE_URL = (import.meta.env.VITE_STORE_URL as string) || "https://lumara-id.onrender.com";

const navItem = (isActive: boolean) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mx-2 ${
    isActive
      ? "bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-md"
      : "text-[var(--text-muted)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)]"
  }`;

const navItems = [
  { to: "/",           end: true,  icon: HiOutlineHome,             label: "Dashboard" },
  { to: "/products",   end: false, icon: HiOutlineDevicePhoneMobile, label: "Produk" },
  { to: "/categories", end: false, icon: HiOutlineTag,              label: "Kategori" },
  { to: "/orders",     end: false, icon: HiOutlineTruck,            label: "Pesanan" },
  { to: "/users",      end: false, icon: HiOutlineUserGroup,        label: "Pengguna" },
  { to: "/reviews",    end: false, icon: HiOutlineStar,             label: "Ulasan" },
  { to: "/profile",    end: false, icon: HiOutlineUser,             label: "Profil" },
];

const Sidebar = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isSidebarOpen && (
        <div
          className="xl:hidden fixed inset-0 z-[9] bg-black/40 backdrop-blur-sm"
          onClick={() => dispatch(setSidebar())}
        />
      )}

      <div className={`w-64 min-h-screen dark:bg-[#0D0B14] bg-white border-r border-[var(--border)] pt-4 xl:sticky xl:top-0 xl:z-10 max-xl:fixed max-xl:top-0 max-xl:z-10 xl:translate-x-0 flex flex-col shrink-0 ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

        {/* Close button (mobile) */}
        <button
          className="xl:hidden ml-auto mr-3 mb-2 p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] transition-colors"
          onClick={() => dispatch(setSidebar())}
        >
          <HiOutlineX className="text-xl" />
        </button>

        {/* Brand */}
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <div>
              <p className="font-bold text-sm text-[var(--text)]">lumara.id</p>
              <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav label */}
        <p className="px-6 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Menu</p>

        {/* Main navigation */}
        <nav className="flex flex-col flex-1 gap-0.5 pb-4">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => navItem(isActive)}
              onClick={() => { if (isSidebarOpen) dispatch(setSidebar()); }}
            >
              <Icon className="text-lg shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[var(--border)] pt-2 pb-4 flex flex-col gap-0.5">
          <NavLink
            to="/help-desk"
            className={({ isActive }) => navItem(isActive)}
            onClick={() => { if (isSidebarOpen) dispatch(setSidebar()); }}
          >
            <HiOutlineInformationCircle className="text-lg shrink-0" />
            <span>Bantuan</span>
          </NavLink>
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium mx-2 text-[var(--text-muted)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] transition-all"
          >
            <HiOutlineExternalLink className="text-lg shrink-0" />
            <span>Buka Toko</span>
          </a>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
