import React, { useEffect, useState } from "react";

const EditAppointmentModal = ({ appointment, onClose, onRefresh }) => {
  const [start, setStart] = useState(appointment.start?.slice(0, 16) || "");
  const [doctorId, setDoctorId] = useState(appointment.doctor?._id || "");
  const [patientId, setPatientId] = useState(appointment.patient?._id || "");
  const [labId, setLabId] = useState(appointment.lab?._id || "");

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labs, setLabs] = useState([]);

  const token = localStorage.getItem("token");

  const fetchDropdowns = async () => {
    try {
      const [doctorRes, patientRes, labRes] = await Promise.all([
        fetch("/api/doctor", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/patient", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/lab", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [doctorData, patientData, labData] = await Promise.all([
        doctorRes.json(),
        patientRes.json(),
        labRes.json(),
      ]);

      setDoctors(doctorData);
      setPatients(patientData);
      setLabs(labData);
    } catch (err) {
      console.error("Gabim në marrjen e të dhënave për dropdown:", err);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/appointments/${appointment._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start,
          doctor_id: doctorId,
          patient_id: patientId,
          lab_id: labId || null,
        }),
      });
      if (!res.ok) throw new Error("Gabim gjatë përditësimit");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim gjatë përditësimit të takimit:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0f172a] p-6 rounded w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6">Përditëso Takimin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="">Zgjidh Mjekun</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.first} {doc.last}
              </option>
            ))}
          </select>

          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="">Zgjidh Pacientin</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.first} {p.last}
              </option>
            ))}
          </select>

          <select
            value={labId}
            onChange={(e) => setLabId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="">(Opsionale) Zgjidh Laboratorin</option>
            {labs.map((lab) => (
              <option key={lab._id} value={lab._id}>
                {lab.type}
              </option>
            ))}
          </select>

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

export default EditAppointmentModal;
