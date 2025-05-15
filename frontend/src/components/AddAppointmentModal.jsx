import React, { useState, useEffect } from "react";

const AddAppointmentModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    start: "",
    end: "",
    doctor_id: "",
    patient_id: "",
    lab: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labs, setLabs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOptions = async () => {
      const d = await fetch("http://localhost:3000/api/doctor", { headers: { Authorization: `Bearer ${token}` } });
      const p = await fetch("http://localhost:3000/api/patient", { headers: { Authorization: `Bearer ${token}` } });
      const l = await fetch("http://localhost:3000/api/lab", { headers: { Authorization: `Bearer ${token}` } });

      setDoctors(await d.json());
      setPatients(await p.json());
      setLabs(await l.json());
    };

    fetchOptions();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.start || !form.end || !form.doctor_id || !form.patient_id) {
      alert("Please fill all required fields");
      return;
    }
    await onSubmit(form);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ color: "#00bcd4" }}>Add Appointment</h2>

        <input type="datetime-local" name="start" value={form.start} onChange={handleChange} required style={inputStyle} />
        <input type="datetime-local" name="end" value={form.end} onChange={handleChange} required style={inputStyle} />

        <select name="doctor_id" value={form.doctor_id} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.first} {d.last}</option>
          ))}
        </select>

        <select name="patient_id" value={form.patient_id} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.first} {p.last}</option>
          ))}
        </select>

        <select name="lab" value={form.lab} onChange={handleChange} style={inputStyle}>
          <option value="">Select Lab (optional)</option>
          {labs.map((l) => (
            <option key={l._id} value={l._id}>{l.type}</option>
          ))}
        </select>

        <div style={buttonWrapperStyle}>
          <button type="button" onClick={onClose} className="add-button" style={{ backgroundColor: "#607d8b" }}>
            Cancel
          </button>
          <button type="submit" className="add-button">Add</button>
        </div>
      </form>
    </div>
  );
};

// style objects reused
const overlayStyle = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
  alignItems: "center", justifyContent: "center", zIndex: 999,
};

const formStyle = {
  backgroundColor: "#1b2a41", padding: 30, borderRadius: 10, width: "400px",
};

const inputStyle = {
  width: "100%", padding: "10px", marginBottom: "10px",
  borderRadius: "6px", border: "none", backgroundColor: "#32455a", color: "#fff",
};

const buttonWrapperStyle = {
  marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10,
};

export default AddAppointmentModal;
