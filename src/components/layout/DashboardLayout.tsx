// DashboardLayout.jsx
import  { useEffect, useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Header from '../ui/Header';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
  
export  default function DashboardLayout( ) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile sidebar on resize
  useEffect(() => {
    const handle = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0e14] text-white font-sans">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <Header
        onMenuClick={() => setSidebarOpen(true)}
        collapsed={collapsed}
      />

      {/* Page content */}
      <main
        className={[
          "pt-16 min-h-screen transition-all duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64",
        ].join(" ")}
      >
        <Toaster />
        <div className="p-6">
        <Outlet />
        </div>
      </main>
    </div>
  );
}