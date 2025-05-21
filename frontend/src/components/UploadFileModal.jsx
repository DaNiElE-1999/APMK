// src/components/files/UploadFileModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadFileModal = ({ onClose, onRefresh }) => {
  const [file, setFile] = useState(null);
  const [doctor_id, setDoctorId] = useState("");
  const [patient_id, setPatientId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get("/api/doctor").then((res) => setDoctors(res.data));
    axios.get("/api/patient").then((res) => setPatients(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Zgjidh një skedar!");

    const formData = new FormData();
    formData.append("file", file);
    if (doctor_id) formData.append("doctor_id", doctor_id);
    if (patient_id) formData.append("patient_id", patient_id);

    try {
      await axios.put("/api/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim në ngarkim", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">Ngarko Dokument</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full bg-[#334155] p-2 rounded"
        />

        <select
          value={doctor_id}
          onChange={(e) => setDoctorId(e.target.value)}
          className="w-full p-2 bg-[#334155] rounded"
        >
          <option value="">Zgjidh Mjekun</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.first} {d.last}
            </option>
          ))}
        </select>

        <select
          value={patient_id}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full p-2 bg-[#334155] rounded"
        >
          <option value="">Zgjidh Pacientin</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.first} {p.last}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
            Anulo
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded">
            Ngarko
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadFileModal;
