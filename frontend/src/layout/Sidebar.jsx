// src/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdSpaceDashboard,
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaPills,
  FaBoxes,
  FaFolderOpen,
  FaChartLine,
  FaUserCog,
} from "react-icons/fa";
import { BiTestTube } from "react-icons/bi";

const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem("role"); // admin / doctor / nurse ...

  const menuItems = [
    { label: "Dashboard", icon: <MdSpaceDashboard />, route: "/dashboard" },
    { label: "Patients", icon: <FaUserInjured />, route: "/patients" },
    { label: "Appointments", icon: <FaCalendarCheck />, route: "/appointments" },
    { label: "Pharmacy", icon: <FaPills />, route: "/medicines" },
    { label: "Inventory", icon: <FaBoxes />, route: "/inventory" },
    { label: "Laboratory", icon: <BiTestTube />, route: "/labs" },
    { label: "Files", icon: <FaFolderOpen />, route: "/files" },
    { label: "Profit", icon: <FaChartLine />, route: "/profit" },
  ];

  if (role === "admin") {
    menuItems.splice(1, 0, { label: "Users", icon: <FaUserCog />, route: "/users" });
  }

  return (
    <div className="sidebar">
      <h2 style={{ fontSize: "22px", color: "#00bcd4", textAlign: "center", marginBottom: "30px" }}>
        Klinika
      </h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.label} style={{ padding: 0 }}>
            <Link
              to={item.route}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "15px 30px",
                textDecoration: "none",
                color: location.pathname === item.route ? "#00bcd4" : "#fff",
                backgroundColor: location.pathname === item.route ? "#2a3d5a" : "transparent",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
