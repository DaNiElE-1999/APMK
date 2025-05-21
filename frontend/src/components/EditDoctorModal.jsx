// src/components/doctors/EditDoctorModal.jsx
import React, { useState } from "react";
import axios from "axios";

const EditDoctorModal = ({ doctor, onClose, onRefresh }) => {
  const [form, setForm] = useState({ ...doctor });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/doctor/${doctor._id}`, form);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded w-full max-w-md space-y-4 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Edito Mjek</h2>

        <input
          type="text"
          name="first"
          value={form.first}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="last"
          value={form.last}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="speciality"
          value={form.speciality}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
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

export default EditDoctorModal;
