import { useState } from "react";
import { useLocation } from "react-router-dom";

const Icon = ({ d, size = 20 }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  analytics: "M18 20V10 M12 20V4 M6 20v-6",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  products: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  orders: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2",
  settings: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  reports: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  notifications: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  search: "M11 4a7 7 0 1 0 0 14A7 7 0 0 0 11 4z M21 21l-4.35-4.35",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  close: "M18 6L6 18 M6 6l12 12",
  chevron: "M9 18l6-6-6-6",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
};

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { label: "Dashboard", path: "/", icon: "dashboard" },
  { label: "Analytics", path: "/analytics", icon: "analytics" },
  { label: "Orders", path: "/orders", icon: "orders" },
  { label: "Products", path: "/products", icon: "products" },
  { label: "Users", path: "/users", icon: "users" },
  { label: "Reports", path: "/reports", icon: "reports" },
];

 

export default function Header({ onMenuClick, collapsed }:any) {
  const location = useLocation();
  const [search, setSearch] = useState("");

  const pageTitle = NAV_MAIN.find(
    (n) => n.path === location.pathname
  )?.label ?? "Dashboard";

  return (
    <header
      className={[
        "fixed top-0 right-0 z-10 h-16 flex items-center gap-4 px-5",
        "bg-[#0c0e14]/80 backdrop-blur-md border-b border-white/[0.06]",
        "transition-all duration-300",
        collapsed ? "lg:left-[72px]" : "lg:left-64",
        "left-0",
      ].join(" ")}
    >
      {/* Mobile menu btn */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-white/50 hover:text-white transition-colors"
      >
        <Icon d={icons.menu} size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-white font-semibold text-[15px] tracking-tight hidden sm:block">
        {pageTitle}
      </h1>

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-1.5 text-white/30 text-xs ml-1">
        <span>Home</span>
        <Icon d={icons.chevron} size={12} />
        <span className="text-white/60">{pageTitle}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:flex items-center">
        <span className="absolute left-3 text-white/30">
          <Icon d={icons.search} size={14} />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-48 lg:w-64 pl-9 pr-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/80 placeholder-white/25 text-[13px] outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
        />
        <kbd className="absolute right-3 text-[10px] text-white/20 hidden lg:block">⌘K</kbd>
      </div>

      {/* Notifications */}
      <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">
        <Icon d={icons.notifications} size={17} />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-500 ring-2 ring-[#0c0e14]" />
      </button>

      {/* Theme toggle */}
      <button className="flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">
        <Icon d={icons.sun} size={16} />
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 cursor-pointer ring-2 ring-transparent hover:ring-violet-500/50 transition-all shrink-0 flex items-center justify-center">
        <span className="text-white text-xs font-bold">RA</span>
      </div>
    </header>
  );
}
