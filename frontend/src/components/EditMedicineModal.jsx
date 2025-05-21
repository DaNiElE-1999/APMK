// src/components/medicines/EditMedicineModal.jsx
import React, { useState } from "react";
import axios from "axios";

const EditMedicineModal = ({ medicine, onClose, onRefresh }) => {
  const [form, setForm] = useState({ ...medicine });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/medicine/${medicine._id}`, {
        name: form.name,
        cost: parseFloat(form.cost),
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim në përditësim", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">Edito Medikament</h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Emri"
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="number"
          name="cost"
          value={form.cost}
          onChange={handleChange}
          placeholder="Çmimi"
          className="w-full p-2 bg-[#334155] rounded"
        />

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
            Anulo
          </button>
          <button type="submit" className="px-4 py-2 bg-yellow-600 rounded">
            Përditëso
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicineModal;
