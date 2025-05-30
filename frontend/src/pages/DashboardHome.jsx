import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaEuroSign,
  FaChartLine,
} from "react-icons/fa";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    patients: 0,
    upcomingAppointments: 0,
    monthlyRevenue: 0,
    profitGrowth: 0,
  });

  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const [patientsRes, profitRes, allAppointmentsRes] = await Promise.all([
        fetch("/api/patient", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),

        fetch("/api/profit/all", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),

        fetch("/api/appointment", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
      ]);

      const now = new Date();
      const upcoming = allAppointmentsRes.filter(
        (appt) => new Date(appt.start) > now
      );

      setStats({
        patients: patientsRes.length,
        upcomingAppointments: upcoming.length,
        monthlyRevenue: profitRes.total || 0,
        profitGrowth: ((profitRes.sale || 0) + (profitRes.lab || 0)) * 0.05,
      });

      const formattedEvents = allAppointmentsRes.map((a) => ({
        title: `${a.patient?.first || "Pacient"} me ${a.doctor?.first || "Mjek"}`,
        start: a.start,
        end: new Date(new Date(a.start).getTime() + 60 * 60 * 1000),
        backgroundColor: "#38bdf8",
      }));

      setEvents(formattedEvents);
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
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments,
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

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 sm:col-span-2 grid gap-6">
          {statCards.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        <div className="lg:col-span-3 bg-[#1e293b] p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Kalendar i Takimeve
          </h2>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay,timeGridWeek",
            }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            nowIndicator={true}
            eventDisplay="block"
            height="auto"
            themeSystem="standard"
            events={events}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
