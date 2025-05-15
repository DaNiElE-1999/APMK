import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import AddPatientModal from "../components/AddPatientModal";
import EditPatientModal from "../components/EditPatientModal";
import "../styles/dashboard.css";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPatient, setEditPatient] = useState(null);

  const token = localStorage.getItem("token");

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/patient", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      alert("Failed to fetch patients");
    }
  };

  const handleAddPatient = async (data) => {
    const res = await fetch("http://localhost:3000/api/patient", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchPatients();
  };

  const handleUpdatePatient = async (data) => {
    const res = await fetch(`http://localhost:3000/api/patient/${editPatient._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchPatients();
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    const res = await fetch(`http://localhost:3000/api/patient/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchPatients();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Patients</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>+ Add Patient</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>{p.first}</td>
              <td>{p.last}</td>
              <td>{p.email}</td>
              <td>{p.phone || "—"}</td>
              <td>
                <button onClick={() => setEditPatient(p)} className="add-button" style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDeletePatient(p._id)} className="add-button" style={{ backgroundColor: "#e53935", color: "#fff" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPatient}
        />
      )}

      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSubmit={handleUpdatePatient}
        />
      )}
    </DashboardLayout>
  );
};

export default PatientsPage;
