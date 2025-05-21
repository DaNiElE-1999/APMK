// src/components/patients/AddPatientModal.jsx
import React, { useState } from "react";
import axios from "axios";

const AddPatientModal = ({ onClose, onRefresh }) => {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    age: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/patient", {
        ...form,
        age: parseInt(form.age),
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
        <h2 className="text-xl font-bold mb-4">Shto Pacient</h2>

        <input
          type="text"
          name="first"
          value={form.first}
          onChange={handleChange}
          placeholder="Emri"
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="last"
          value={form.last}
          onChange={handleChange}
          placeholder="Mbiemri"
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Telefoni (opsional)"
          className="w-full p-2 bg-[#334155] rounded"
        />
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Mosha"
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

export default AddPatientModal;
