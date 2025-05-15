import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import AddLabModal from "../components/AddLabModal";
import EditLabModal from "../components/EditLabModal";
import "../styles/dashboard.css";

const LabsPage = () => {
  const [labs, setLabs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editLab, setEditLab] = useState(null);
  const token = localStorage.getItem("token");

  const fetchLabs = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/lab", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLabs(data);
    } catch (err) {
      alert("Failed to fetch labs");
    }
  };

  const handleAddLab = async (data) => {
    const res = await fetch("http://localhost:3000/api/lab", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchLabs();
  };

  const handleUpdateLab = async (data) => {
    const res = await fetch(`http://localhost:3000/api/lab/${editLab._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchLabs();
  };

  const handleDeleteLab = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lab?")) return;
    const res = await fetch(`http://localhost:3000/api/lab/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchLabs();
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Laboratory Tests</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>+ Add Lab</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab) => (
            <tr key={lab._id}>
              <td>{lab.type}</td>
              <td>{lab.cost} €</td>
              <td>
                <button onClick={() => setEditLab(lab)} className="add-button" style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDeleteLab(lab._id)} className="add-button" style={{ backgroundColor: "#e53935", color: "#fff" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddLabModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddLab}
        />
      )}

      {editLab && (
        <EditLabModal
          lab={editLab}
          onClose={() => setEditLab(null)}
          onSubmit={handleUpdateLab}
        />
      )}
    </DashboardLayout>
  );
};

export default LabsPage;
