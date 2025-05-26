// src/components/EditAppointmentModal.jsx
import React, { useEffect, useState } from "react";

const EditAppointmentModal = ({ appointment, onClose, onRefresh }) => {
  const [form, setForm] = useState({
    start: "",
    end: "",
    doctor_id: "",
    patient_id: "",
    lab: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labs, setLabs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (appointment) {
      setForm({
        start: appointment.start?.slice(0, 16) || "",
        end: appointment.end?.slice(0, 16) || "",
        doctor_id: appointment.doctor?._id || "",
        patient_id: appointment.patient?._id || "",
        lab: appointment.lab?._id || "",
      });
    }
  }, [appointment]);

  const fetchDropdownData = async () => {
    try {
      const [doctorRes, patientRes, labRes] = await Promise.all([
        fetch("/api/doctor", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
        fetch("/api/patient", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
        fetch("/api/lab", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      ]);
      setDoctors(doctorRes);
      setPatients(patientRes);
      setLabs(labRes);
    } catch (err) {
      console.error("Gabim gjatë ngarkimit të dropdown:", err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/appointments/${appointment._id}`, {
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
      console.error("Gabim gjatë përditësimit të takimit:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] p-6 rounded shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Edito Takim</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="datetime-local"
            name="start"
            value={form.start}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="datetime-local"
            name="end"
            value={form.end}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          >
            <option value="">Zgjidh Mjekun</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.first} {d.last}
              </option>
            ))}
          </select>
          <select
            name="patient_id"
            value={form.patient_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          >
            <option value="">Zgjidh Pacientin</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.first} {p.last}
              </option>
            ))}
          </select>
          <select
            name="lab"
            value={form.lab}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700"
          >
            <option value="">(Opsionale) Zgjidh Laboratorin</option>
            {labs.map((l) => (
              <option key={l._id} value={l._id}>
                {l.type} - €{l.cost}
              </option>
            ))}
          </select>
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
              Ruaj Ndryshimet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
