// src/components/doctors/AddDoctorModal.jsx
import React, { useState } from "react";
import axios from "axios";

const AddDoctorModal = ({ onClose, onRefresh }) => {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    speciality: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/doctor", form);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error creating doctor:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded w-full max-w-md space-y-4 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Shto Mjek</h2>

        <input
          type="text"
          name="first"
          placeholder="Emri"
          value={form.first}
          onChange={handleChange}
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="last"
          placeholder="Mbiemri"
          value={form.last}
          onChange={handleChange}
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="speciality"
          placeholder="Specialiteti"
          value={form.speciality}
          onChange={handleChange}
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefoni (opsional)"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
        />

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
            Anulo
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 rounded">
            Ruaj
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctorModal;
