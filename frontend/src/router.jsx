import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardHome from "./pages/DashboardHome";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorPages from "./pages/DoctorPages";
import LabsPage from "./pages/LabsPage";
import MedicinesPages from "./pages/MedicinesPages";
import MedicineSoldPage from "./pages/MedicineSoldPage";
import PatientsPage from "./pages/PatientsPage";
import ProfitPage from "./pages/ProfitPage";
import DashboardLayout from "./layout/DashboardLayout";
import { useAuth } from "./context/AuthContext";

const AppRouter = () => {
  const { token } = useAuth();

  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/doctors" element={<DoctorPages />} />
        <Route path="/labs" element={<LabsPage />} />
        <Route path="/medicines" element={<MedicinesPages />} />
        <Route path="/medicines-sold" element={<MedicineSoldPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/profit" element={<ProfitPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
