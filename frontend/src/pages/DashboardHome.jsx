// src/pages/DashboardHome.jsx
import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaEuroSign,
  FaChartLine
} from "react-icons/fa";

const DashboardHome = () => {
  // Vlerat do vijnë nga backend më vonë
  const stats = [
    {
      title: "Total Patients",
      value: "", // bosh për tani
      icon: <FaUserInjured />,
      color: "#00bcd4",
    },
    {
      title: "Appointments Today",
      value: "",
      icon: <FaCalendarCheck />,
      color: "#4caf50",
    },
    {
      title: "Monthly Revenue",
      value: "",
      icon: <FaEuroSign />,
      color: "#ff9800",
    },
    {
      title: "Profit Growth",
      value: "",
      icon: <FaChartLine />,
      color: "#e91e63",
    },
  ];

  return (
    <DashboardLayout>
      <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
