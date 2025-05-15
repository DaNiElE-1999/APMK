// src/components/EditPatientModal.jsx
import React, { useState, useEffect } from "react";

const EditPatientModal = ({ onClose, patient, onSubmit }) => {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (patient) {
      setForm({
        first: patient.first,
        last: patient.last,
        email: patient.email,
        phone: patient.phone || "",
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ color: "#00bcd4" }}>Edit Patient</h2>

        <input name="first" value={form.first} onChange={handleChange} placeholder="First Name" required style={inputStyle} />
        <input name="last" value={form.last} onChange={handleChange} placeholder="Last Name" required style={inputStyle} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={inputStyle} />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />

        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} className="add-button" style={{ backgroundColor: "#607d8b" }}>
            Cancel
          </button>
          <button type="submit" className="add-button">Save</button>
        </div>
      </form>
    </div>
  );
};

const overlayStyle = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
  alignItems: "center", justifyContent: "center", zIndex: 999
};

const formStyle = {
  backgroundColor: "#1b2a41", padding: 30, borderRadius: 10, width: "400px"
};

const inputStyle = {
  width: "100%", padding: "10px", marginBottom: "10px",
  borderRadius: "6px", border: "none", backgroundColor: "#32455a", color: "#fff"
};

export default EditPatientModal;
