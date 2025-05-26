// src/components/EditDoctorModal.jsx
import React, { useState, useEffect } from "react";

const EditDoctorModal = ({ doctor, onClose, onRefresh }) => {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    speciality: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (doctor) {
      setForm({
        first: doctor.first || "",
        last: doctor.last || "",
        email: doctor.email || "",
        speciality: doctor.speciality || "",
        phone: doctor.phone || "",
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/doctor/${doctor._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gabim gjatë përditësimit");

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim gjatë përditësimit të mjekut:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] p-6 rounded shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Edito Mjek</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="first"
            value={form.first}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="text"
            name="last"
            value={form.last}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="text"
            name="speciality"
            value={form.speciality}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
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
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Ruaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorModal;
