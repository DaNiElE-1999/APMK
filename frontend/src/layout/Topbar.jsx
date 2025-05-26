import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.style.setProperty("--bg-color", "#0d1b2a");
      root.style.setProperty("--sidebar-color", "#1b2a41");
      root.style.setProperty("--text-color", "#ffffff");
      root.style.setProperty("--hover-color", "#273447");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--bg-color", "#ffffff");
      root.style.setProperty("--sidebar-color", "#f1f5f9");
      root.style.setProperty("--text-color", "#000000");
      root.style.setProperty("--hover-color", "#e2e8f0");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "var(--bg-color)", borderBottom: "1px solid #334155" }}>
      <div className="user-info" style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-color)" }}>
        <FaUserCircle size={22} />
        <span className="username">{user?.email || "Përdorues"}</span>
      </div>
      <button onClick={toggleTheme} className="theme-toggle" title="Ndrysho Temën" style={{ background: "none", border: "none", color: "var(--text-color)", cursor: "pointer" }}>
        {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
      </button>
    </div>
  );
};

export default Topbar;
