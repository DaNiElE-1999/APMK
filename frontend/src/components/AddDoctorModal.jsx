// src/components/AddDoctorModal.jsx
import React, { useState } from "react";

const AddDoctorModal = ({ onClose, onRefresh }) => {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    speciality: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/doctor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gabim gjatë shtimit të mjekut");

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim gjatë krijimit të mjekut:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] p-6 rounded shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Shto Mjek</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="first"
            value={form.first}
            onChange={handleChange}
            placeholder="Emri"
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="text"
            name="last"
            value={form.last}
            onChange={handleChange}
            placeholder="Mbiemri"
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="text"
            name="speciality"
            value={form.speciality}
            onChange={handleChange}
            placeholder="Specialiteti"
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefoni (opsional)"
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              Anulo
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Shto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
