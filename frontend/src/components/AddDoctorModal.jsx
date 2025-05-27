import React, { useState } from "react";

const AddDoctorModal = ({ onClose, onRefresh, existingDoctors }) => {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    speciality: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailExists = existingDoctors.some(
      (d) => d.email.toLowerCase().trim() === form.email.toLowerCase().trim()
    );

    if (emailExists) {
      alert("Ky email ekziston tashmë për një mjek.");
      return;
    }

    try {
      const res = await fetch("/api/doctor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("🔍 STATUS:", res.status);
      console.log("📦 DATA:", data);

      if (!res.ok) {
        alert(data.message || "Gabim gjatë shtimit të mjekut.");
        throw new Error(data.message || "Gabim gjatë shtimit të mjekut");
      }

      alert("✅ Mjeku u shtua me sukses!");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim gjatë shtimit:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0f172a] p-6 rounded w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6">Shto Mjek</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="first"
            value={form.first}
            onChange={handleChange}
            placeholder="Emri"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            name="last"
            value={form.last}
            onChange={handleChange}
            placeholder="Mbiemri"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            name="speciality"
            value={form.speciality}
            onChange={handleChange}
            placeholder="Specialiteti"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefoni (opsionale)"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white"
            >
              Anulo
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white"
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
