import React, { useState } from "react";

const EditDoctorModal = ({ doctor, onClose, onRefresh }) => {
  const [first, setFirst] = useState(doctor.first || "");
  const [last, setLast] = useState(doctor.last || "");
  const [email, setEmail] = useState(doctor.email || "");
  const [speciality, setSpeciality] = useState(doctor.speciality || "");
  const [phone, setPhone] = useState(doctor.phone || "");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/doctor/${doctor._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ first, last, email, speciality, phone }),
      });

      if (!res.ok) throw new Error("Gabim gjatë përditësimit");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim gjatë përditësimit të mjekut:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0f172a] p-6 rounded w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6">Edito Mjekun</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            placeholder="Emri"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            placeholder="Mbiemri"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            placeholder="Specialiteti"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white"
            >
              Ruaj Ndryshimet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorModal;
