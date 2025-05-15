import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../styles/dashboard.css";

const ProfitPage = () => {
  const [totals, setTotals] = useState({ sale: 0, lab: 0, total: 0 });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [labs, setLabs] = useState([]);

  const [filters, setFilters] = useState({
    doctor_id: "",
    patient_id: "",
    medicine_id: "",
    lab_id: "",
    from: "",
    to: "",
  });

  const token = localStorage.getItem("token");

  const fetchOptions = async () => {
    const [d, p, m, l] = await Promise.all([
      fetch("http://localhost:3000/api/doctor", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:3000/api/patient", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:3000/api/medicine", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:3000/api/lab", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    setDoctors(await d.json());
    setPatients(await p.json());
    setMedicines(await m.json());
    setLabs(await l.json());
  };

  const fetchProfit = async () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    const res = await fetch(`http://localhost:3000/api/profit/all?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTotals(data);
  };

  useEffect(() => {
    fetchOptions();
    fetchProfit();
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = () => fetchProfit();

  return (
    <DashboardLayout>
      <h2>Profit Analysis</h2>

      <div className="filters" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <select name="doctor_id" value={filters.doctor_id} onChange={handleChange}>
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.first} {d.last}</option>
          ))}
        </select>

        <select name="patient_id" value={filters.patient_id} onChange={handleChange}>
          <option value="">All Patients</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.first} {p.last}</option>
          ))}
        </select>

        <select name="medicine_id" value={filters.medicine_id} onChange={handleChange}>
          <option value="">All Medicines</option>
          {medicines.map((m) => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>

        <select name="lab_id" value={filters.lab_id} onChange={handleChange}>
          <option value="">All Labs</option>
          {labs.map((l) => (
            <option key={l._id} value={l._id}>{l.type}</option>
          ))}
        </select>

        <input type="date" name="from" value={filters.from} onChange={handleChange} />
        <input type="date" name="to" value={filters.to} onChange={handleChange} />

        <button className="add-button" onClick={handleSearch}>Search</button>
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div>
            <div style={{ fontSize: 20 }}>From Sales</div>
            <strong>{totals.sale.toFixed(2)} €</strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧪</div>
          <div>
            <div style={{ fontSize: 20 }}>From Labs</div>
            <strong>{totals.lab.toFixed(2)} €</strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div>
            <div style={{ fontSize: 20 }}>Total Profit</div>
            <strong>{totals.total.toFixed(2)} €</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfitPage;
