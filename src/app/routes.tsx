import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashbourd from "@/pages/Dashbourd";
import Stores from "@/pages/Stores";
import Users from "@/pages/Users";
import { Routes, Route, Navigate } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout/>} >
      <Route index element={<Dashbourd />} />
      <Route path="stores" element={<Stores />} />
      <Route path="users" element={<Users />} />
      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};