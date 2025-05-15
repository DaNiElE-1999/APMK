import React, { useState, useEffect } from "react";

const EditMedicineModal = ({ medicine, onClose, onSubmit }) => {
  const [form, setForm] = useState({ name: "", cost: "" });

  useEffect(() => {
    if (medicine) {
      setForm({
        name: medicine.name || "",
        cost: medicine.cost?.toString() || "",
      });
    }
  }, [medicine]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.cost) {
      alert("All fields are required");
      return;
    }
    await onSubmit({ name: form.name, cost: parseFloat(form.cost) });
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ color: "#00bcd4" }}>Edit Medicine</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <input name="cost" type="number" placeholder="Cost (€)" value={form.cost} onChange={handleChange} required style={inputStyle} />
        <div style={buttonWrapperStyle}>
          <button type="button" onClick={onClose} className="add-button" style={{ backgroundColor: "#607d8b" }}>Cancel</button>
          <button type="submit" className="add-button">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicineModal;
