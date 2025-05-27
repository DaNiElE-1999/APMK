import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const excludedPaths = ["/dashboard", "/appointments", "/doctors", "/labs", "/medicines", "/medicine-sold", "/patients", "/profit", "/files"];

  const showBackButton = !excludedPaths.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <Topbar />
        {showBackButton && (
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Kthehu
          </button>
        )}
        <main>
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
