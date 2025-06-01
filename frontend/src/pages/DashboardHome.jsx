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
        patients: Array.isArray(patientsRes) ? patientsRes.length : 0,
        upcomingAppointments: Array.isArray(upcoming) ? upcoming.length : 0,
        monthlyRevenue: profitRes.total || 0,
        profitGrowth: ((profitRes.sale || 0) + (profitRes.lab || 0)) * 0.05,
      });

      const formattedEvents = allAppointmentsRes.map((a) => ({
        title: `${a.patient?.first || "Pacient"} me ${
          a.doctor?.first || "Mjek"
        }`,
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
      {/* Force the main heading to remain white */}
      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>

      {/* Inline override so FullCalendar’s toolbar/buttons remain white on dark */}
      <style>
        {`
          .fc .fc-toolbar-chunk,
          .fc .fc-button {
            color: white !important;
          }
        `}
      </style>

      {/* ─────────────────────────────────────────────────────────────
          OUTER WRAPPER: A single dark “card” that contains both stats & calendar
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-dark p-4 rounded-2xl shadow-xl border border-secondary">
        <div className="row g-4">
          {/* ────────────────────────────────
              LEFT COLUMN: Stats
              ──────────────────────────────── */}
          <div className="col-lg-3">
            {/* 
              Instead of wrapping ALL stats in one flat black panel, 
              we let each StatCard live in its own “inner card” with bg-secondary.
              We use a small inner grid so cards stack nicely with spacing.
            */}
            <div className="row row-cols-1 g-3">
              {statCards.map((item) => (
                <div key={item.title} className="col">
                  <div className="bg-secondary text-white p-3 rounded shadow-sm h-100">
                    {/* 
                      You can keep using your existing StatCard component,
                      or—if you want full control—uncomment the JSX below 
                      and style your icon/text manually. 
                    
                    <StatCard 
                      title={item.title}
                      value={item.value}
                      icon={item.icon}
                      color={item.color}
                    />
                    */}

                    {/* If your StatCard already includes its own wrapper styling, 
                        just use it directly; e.g.: */}
                    <StatCard
                      title={item.title}
                      value={item.value}
                      icon={item.icon}
                      color={item.color}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ────────────────────────────────
              RIGHT COLUMN: Calendar
              ──────────────────────────────── */}
          <div className="col-lg-9">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-2 text-white">
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
              contentHeight="auto"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
