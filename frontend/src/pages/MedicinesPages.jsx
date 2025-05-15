import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import AddMedicineModal from "../components/AddMedicineModal";
import EditMedicineModal from "../components/EditMedicineModal";
import "../styles/dashboard.css";

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);
  const token = localStorage.getItem("token");

  const fetchMedicines = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/medicine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMedicines(data);
    } catch (err) {
      alert("Failed to fetch medicines");
    }
  };

  const handleAddMedicine = async (data) => {
    const res = await fetch("http://localhost:3000/api/medicine", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchMedicines();
  };

  const handleUpdateMedicine = async (data) => {
    const res = await fetch(`http://localhost:3000/api/medicine/${editMedicine._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchMedicines();
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    const res = await fetch(`http://localhost:3000/api/medicine/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchMedicines();
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Medicines</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>+ Add Medicine</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost (€)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.cost}</td>
              <td>
                <button onClick={() => setEditMedicine(m)} className="add-button" style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDeleteMedicine(m._id)} className="add-button" style={{ backgroundColor: "#e53935", color: "#fff" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddMedicineModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddMedicine}
        />
      )}

      {editMedicine && (
        <EditMedicineModal
          medicine={editMedicine}
          onClose={() => setEditMedicine(null)}
          onSubmit={handleUpdateMedicine}
        />
      )}
    </DashboardLayout>
  );
};

export default MedicinesPage;
