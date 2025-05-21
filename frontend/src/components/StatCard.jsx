// src/components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[#1e293b] text-white p-4 rounded shadow flex items-center gap-4">
      <div className="text-3xl" style={{ color }}>{icon}</div>
      <div>
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
