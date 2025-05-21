// src/components/appointments/EditAppointmentModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const EditAppointmentModal = ({ appointment, onClose, onRefresh }) => {
  const [form, setForm] = useState({ ...appointment });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    axios.get("/api/doctor").then((res) => setDoctors(res.data));
    axios.get("/api/patient").then((res) => setPatients(res.data));
    axios.get("/api/lab").then((res) => setLabs(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/appointments/${appointment._id}`, form);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded w-full max-w-md space-y-4 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Edito Takim</h2>

        <input
          type="datetime-local"
          name="start"
          value={form.start?.slice(0, 16)}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
          required
        />
        <input
          type="datetime-local"
          name="end"
          value={form.end?.slice(0, 16)}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
          required
        />

        <select
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          className="w-full p-2 bg-[#334155] rounded"
        >
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
          className="w-full p-2 bg-[#334155] rounded"
        >
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
          className="w-full p-2 bg-[#334155] rounded"
        >
          <option value="">Pa laborator</option>
          {labs.map((l) => (
            <option key={l._id} value={l._id}>
              {l.type}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded"
          >
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

export default EditAppointmentModal;
