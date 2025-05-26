import React, { useState, useEffect } from "react";

const EditPatientModal = ({ patient, onClose, onRefresh }) => {
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", age: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (patient) {
      setForm({
        first: patient.first || "",
        last: patient.last || "",
        email: patient.email || "",
        phone: patient.phone || "",
        age: patient.age || "",
      });
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/patient/${patient._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, age: parseInt(form.age) }),
      });
      if (!res.ok) throw new Error("Gabim gjatë përditësimit të pacientit");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim gjatë përditësimit:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] p-6 rounded shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Edito Pacient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['first', 'last', 'email', 'phone', 'age'].map((field) => (
            <input
              key={field}
              type={field === 'age' ? 'number' : 'text'}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required={field !== 'phone'}
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          ))}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
              Anulo
            </button>
            <button type="submit" className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">
              Ruaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
