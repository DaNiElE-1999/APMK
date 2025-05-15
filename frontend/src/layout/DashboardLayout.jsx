import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Topbar />
      <div className="content">{children}</div>
    </>
  );
};

export default DashboardLayout;
