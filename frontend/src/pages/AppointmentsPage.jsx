import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import AddAppointmentModal from "../components/AddAppointmentModal";
import EditAppointmentModal from "../components/EditAppointmentModal";
import "../styles/dashboard.css";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editAppt, setEditAppt] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    const res = await fetch("http://localhost:3000/api/appointment", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAppointments(data);
  };

  const handleAdd = async (data) => {
    const res = await fetch("http://localhost:3000/api/appointment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchAppointments();
  };

  const handleUpdate = async (data) => {
    const res = await fetch(`http://localhost:3000/api/appointment/${editAppt._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchAppointments();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    const res = await fetch(`http://localhost:3000/api/appointment/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Appointments</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>+ Add Appointment</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Start</th>
            <th>End</th>
            <th>Lab</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.patient_id?.first} {a.patient_id?.last}</td>
              <td>{a.doctor_id?.first} {a.doctor_id?.last}</td>
              <td>{new Date(a.start).toLocaleString()}</td>
              <td>{new Date(a.end).toLocaleString()}</td>
              <td>{a.lab?.type || "—"}</td>
              <td>
                <button className="add-button" onClick={() => setEditAppt(a)} style={{ marginRight: 8 }}>
                  Edit
                </button>
                <button className="add-button" onClick={() => handleDelete(a._id)} style={{ backgroundColor: "#e53935", color: "#fff" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {editAppt && (
        <EditAppointmentModal
          appointment={editAppt}
          onClose={() => setEditAppt(null)}
          onSubmit={handleUpdate}
        />
      )}
    </DashboardLayout>
  );
};

export default AppointmentsPage;
