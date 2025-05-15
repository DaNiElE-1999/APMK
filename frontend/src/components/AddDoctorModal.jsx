import React, { useState } from "react";

const AddDoctorModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    speciality: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first || !form.last || !form.email || !form.speciality) {
      alert("Please fill all required fields");
      return;
    }
    await onSubmit(form);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ color: "#00bcd4" }}>Add Doctor</h2>

        <input name="first" placeholder="First Name" value={form.first} onChange={handleChange} required style={inputStyle} />
        <input name="last" placeholder="Last Name" value={form.last} onChange={handleChange} required style={inputStyle} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="speciality" placeholder="Speciality" value={form.speciality} onChange={handleChange} required style={inputStyle} />
        <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} style={inputStyle} />

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

export default AddDoctorModal;
