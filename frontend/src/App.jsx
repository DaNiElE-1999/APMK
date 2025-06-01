import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Appointments from "./pages/AppointmentsPage";
import Doctors from "./pages/DoctorPages";
import Labs from "./pages/LabsPage";
import Medicines from "./pages/MedicinesPages";
import MedicineSoldList from "./pages/MedicineSoldPage";
import Files from "./pages/FilePage";
import Patients from "./pages/PatientsPage";
import ProfitDashboard from "./pages/ProfitPage";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="labs" element={<Labs />} />
            <Route path="medicines" element={<Medicines />} />
            <Route path="medicine-sold" element={<MedicineSoldList />} />
            <Route path="files" element={<Files />} />
            <Route path="patients" element={<Patients />} />
            <Route path="profit" element={<ProfitDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
