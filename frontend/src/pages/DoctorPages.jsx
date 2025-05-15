import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import AddDoctorModal from "../components/AddDoctorModal";
import EditDoctorModal from "../components/EditDoctorModal";
import "../styles/dashboard.css";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      alert("Failed to fetch doctors");
    }
  };

  const handleAddDoctor = async (data) => {
    const res = await fetch("http://localhost:3000/api/doctor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchDoctors();
  };

  const handleUpdateDoctor = async (data) => {
    const res = await fetch(`http://localhost:3000/api/doctor/${editDoctor._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchDoctors();
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    const res = await fetch(`http://localhost:3000/api/doctor/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchDoctors();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Doctors</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>+ Add Doctor</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Speciality</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d._id}>
              <td>{d.first}</td>
              <td>{d.last}</td>
              <td>{d.email}</td>
              <td>{d.speciality}</td>
              <td>{d.phone || "—"}</td>
              <td>
                <button className="add-button" onClick={() => setEditDoctor(d)} style={{ marginRight: 8 }}>Edit</button>
                <button className="add-button" onClick={() => handleDeleteDoctor(d._id)} style={{ backgroundColor: "#e53935", color: "#fff" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddDoctorModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDoctor}
        />
      )}

      {editDoctor && (
        <EditDoctorModal
          doctor={editDoctor}
          onClose={() => setEditDoctor(null)}
          onSubmit={handleUpdateDoctor}
        />
      )}
    </DashboardLayout>
  );
};

export default DoctorsPage;
