// src/layout/Topbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const username = localStorage.getItem("username") || "User";

  return (
    <div className="topbar">
      <input
        type="text"
        placeholder="Search..."
        style={{
          backgroundColor: "#293b59",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          color: "#fff",
        }}
      />
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span style={{ color: "#00bcd4", fontWeight: "bold" }}>
          👤 {username}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
