import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Paneli Kryesor</h1>
      <div className="card-grid">
        <div className="card"><h3>Pacientë Aktivë</h3><p>128</p></div>
        <div className="card"><h3>Takime Sot</h3><p>24</p></div>
        <div className="card"><h3>Mjekë Disponibël</h3><p>12</p></div>
        <div className="card"><h3>Mesazhe të Reja</h3><p>5</p></div>
      </div>
    </div>
  );
}

export default Dashboard;