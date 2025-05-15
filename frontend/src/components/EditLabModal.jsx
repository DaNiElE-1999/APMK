import React, { useState, useEffect } from "react";

const EditLabModal = ({ lab, onClose, onSubmit }) => {
  const [form, setForm] = useState({ type: "", cost: "" });

  useEffect(() => {
    if (lab) {
      setForm({
        type: lab.type || "",
        cost: lab.cost?.toString() || "",
      });
    }
  }, [lab]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.cost) {
      alert("Both fields are required");
      return;
    }
    await onSubmit({ type: form.type, cost: parseFloat(form.cost) });
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ color: "#00bcd4" }}>Edit Lab</h2>
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required style={inputStyle} />
        <input name="cost" type="number" placeholder="Cost (€)" value={form.cost} onChange={handleChange} required style={inputStyle} />
        <div style={buttonWrapperStyle}>
          <button type="button" onClick={onClose} className="add-button" style={{ backgroundColor: "#607d8b" }}>Cancel</button>
          <button type="submit" className="add-button">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditLabModal;
