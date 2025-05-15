import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../styles/dashboard.css";

const MedicineSoldPage = () => {
  const [sales, setSales] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const [filters, setFilters] = useState({
    doctor_id: "",
    patient_id: "",
    medicine_id: "",
    from: "",
    to: "",
  });

  const token = localStorage.getItem("token");

  const fetchOptions = async () => {
    const [d, p, m] = await Promise.all([
      fetch("http://localhost:3000/api/doctor", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:3000/api/patient", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:3000/api/medicine", { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setDoctors(await d.json());
    setPatients(await p.json());
    setMedicines(await m.json());
  };

  const fetchSales = async () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    const res = await fetch(`http://localhost:3000/api/medicine_sold?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSales(data);
  };

  useEffect(() => {
    fetchOptions();
    fetchSales();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => fetchSales();

  return (
    <DashboardLayout>
      <h2>Sold Medicines</h2>

      <div className="filters" style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select name="doctor_id" value={filters.doctor_id} onChange={handleFilterChange}>
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.first} {d.last}</option>
          ))}
        </select>

        <select name="patient_id" value={filters.patient_id} onChange={handleFilterChange}>
          <option value="">All Patients</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.first} {p.last}</option>
          ))}
        </select>

        <select name="medicine_id" value={filters.medicine_id} onChange={handleFilterChange}>
          <option value="">All Medicines</option>
          {medicines.map((m) => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>

        <input type="date" name="from" value={filters.from} onChange={handleFilterChange} />
        <input type="date" name="to" value={filters.to} onChange={handleFilterChange} />

        <button className="add-button" onClick={handleSearch}>Filter</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Unit Price (€)</th>
            <th>Total (€)</th>
            <th>Date Sold</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s._id}>
              <td>{s.patient_id?.first} {s.patient_id?.last}</td>
              <td>{s.doctor_id?.first} {s.doctor_id?.last}</td>
              <td>{s.medicine_id?.name}</td>
              <td>{s.quantity}</td>
              <td>{s.medicine_id?.cost?.toFixed(2)}</td>
              <td>{(s.quantity * s.medicine_id?.cost).toFixed(2)}</td>
              <td>{new Date(s.time_sold).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default MedicineSoldPage;
