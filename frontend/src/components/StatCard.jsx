import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div
      style={{
        backgroundColor: "#1b2a41",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0,0,0,0.2)",
        flex: "1",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        minWidth: "220px",
      }}
    >
      <div
        style={{
          backgroundColor: color || "#00bcd4",
          borderRadius: "50%",
          padding: "12px",
          color: "#fff",
          fontSize: "24px",
        }}
      >
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", color: "#ccc" }}>{title}</h3>
        <h2 style={{ margin: 0, fontSize: "24px", color: "#fff" }}>
          {value || "—"}
        </h2>
      </div>
    </div>
  );
};

export default StatCard;
