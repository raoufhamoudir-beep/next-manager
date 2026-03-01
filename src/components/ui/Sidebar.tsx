import { NavLink } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
type IconKey = keyof typeof icons;

interface NavItem {
  label: string;
  path: string;
  icon: IconKey;
}

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

interface NavSectionProps {
  items: NavItem[];
  collapsed: boolean;
  label: string;
}

interface SidebarLinkProps {
  item: NavItem;
  collapsed: boolean;
}

// ─── Icon ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  analytics:     "M18 20V10 M12 20V4 M6 20v-6",
  users:         "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  products:      "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  orders:        "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2",
  settings:      "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  reports:       "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  notifications: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  search:        "M11 4a7 7 0 1 0 0 14A7 7 0 0 0 11 4z M21 21l-4.35-4.35",
  menu:          "M3 12h18 M3 6h18 M3 18h18",
  close:         "M18 6L6 18 M6 6l12 12",
  chevron:       "M9 18l6-6-6-6",
  sun:           "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  logout:        "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  stores:        "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
} as const;

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_MAIN: NavItem[] = [
  { label: "Dashboard", path: "/",       icon: "dashboard" },
  { label: "Users",     path: "/users",  icon: "users"     },
  { label: "Stores",    path: "/stores", icon: "reports"   },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 z-30 h-full flex flex-col",
          "bg-[#0f1117] border-r border-white/[0.06]",
          "transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
          "lg:translate-x-0 w-64",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span
              className={[
                "text-white font-semibold text-[15px] tracking-tight whitespace-nowrap transition-all duration-200",
                collapsed ? "lg:opacity-0 lg:w-0" : "opacity-100",
              ].join(" ")}
            >
              Dashify
            </span>
          </div>

          {/* Collapse toggle (desktop) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex ml-auto items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`transition-transform duration-300 ${collapsed ? "rotate-0" : "rotate-180"}`}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Close (mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden ml-auto text-white/40 hover:text-white transition-colors"
          >
            <Icon d={icons.close} size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
          <NavSection items={NAV_MAIN} collapsed={collapsed} label="Main" />
        </nav>
      </aside>
    </>
  );
}

// ─── NavSection ───────────────────────────────────────────────────────────────
function NavSection({ items, collapsed, label }: NavSectionProps) {
  return (
    <div>
      {!collapsed && (
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
          {label}
        </p>
      )}
      {items.map((item) => (
        <SidebarLink key={item.path} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}

// ─── SidebarLink ──────────────────────────────────────────────────────────────
function SidebarLink({ item, collapsed }: SidebarLinkProps) {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150",
          isActive
            ? "bg-violet-500/15 text-violet-400"
            : "text-white/50 hover:text-white/90 hover:bg-white/[0.05]",
          collapsed ? "lg:justify-center lg:px-2" : "",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className={`shrink-0 transition-colors ${isActive ? "text-violet-400" : "text-white/40 group-hover:text-white/70"}`}>
            <Icon d={icons[item.icon]} size={17} />
          </span>
          <span
            className={[
              "whitespace-nowrap transition-all duration-200",
              collapsed ? "lg:hidden" : "",
            ].join(" ")}
          >
            {item.label}
          </span>
          {isActive && (
            <span
              className={[
                "ml-auto w-1 h-1 rounded-full bg-violet-400 shrink-0",
                collapsed ? "lg:hidden" : "",
              ].join(" ")}
            />
          )}
        </>
      )}
    </NavLink>
  );
}