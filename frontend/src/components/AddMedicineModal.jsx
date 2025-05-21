// src/components/medicines/AddMedicineModal.jsx
import React, { useState } from "react";
import axios from "axios";

const AddMedicineModal = ({ onClose, onRefresh }) => {
  const [form, setForm] = useState({ name: "", cost: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/medicine", {
        name: form.name,
        cost: parseFloat(form.cost),
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim në shtim", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">Shto Medikament</h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Emri i barit"
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="number"
          name="cost"
          value={form.cost}
          onChange={handleChange}
          placeholder="Çmimi"
          required
          className="w-full p-2 bg-[#334155] rounded"
        />

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
            Anulo
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 rounded">
            Shto
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicineModal;
