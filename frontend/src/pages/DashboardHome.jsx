// src/pages/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaEuroSign,
  FaChartLine
} from "react-icons/fa";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    patients: 0,
    appointmentsToday: 0,
    monthlyRevenue: 0,
    profitGrowth: 0,
  });

  const fetchStats = async () => {
    try {
      const [patientsRes, appointmentsRes, profitRes] = await Promise.all([
        axios.get("/api/patient"),
        axios.get("/api/appointments", {
          params: {
            from: new Date().toISOString().slice(0, 10),
            to: new Date().toISOString().slice(0, 10),
          },
        }),
        axios.get("/api/profits/all"),
      ]);

      setStats({
        patients: patientsRes.data.length,
        appointmentsToday: appointmentsRes.data.length,
        monthlyRevenue: profitRes.data.total, // ose ndaje në muaj në backend nëse do më saktë
        profitGrowth: (profitRes.data.sale + profitRes.data.lab) * 0.05, // shembull: 5% growth
      });
    } catch (err) {
      console.error("Gabim gjatë marrjes së statistikave:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Patients",
      value: stats.patients,
      icon: <FaUserInjured />,
      color: "#00bcd4",
    },
    {
      title: "Appointments Today",
      value: stats.appointmentsToday,
      icon: <FaCalendarCheck />,
      color: "#4caf50",
    },
    {
      title: "Monthly Revenue",
      value: `€${stats.monthlyRevenue.toFixed(2)}`,
      icon: <FaEuroSign />,
      color: "#ff9800",
    },
    {
      title: "Profit Growth",
      value: `+€${stats.profitGrowth.toFixed(2)}`,
      icon: <FaChartLine />,
      color: "#e91e63",
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4 text-white">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
