import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddAppointmentModal = ({ onClose }) => {
  const [start, setStart] = useState(new Date());
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [labId, setLabId] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labs, setLabs] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchDropdowns = async () => {
    try {
      const [doctorRes, patientRes, labRes] = await Promise.all([
        fetch("/api/doctor", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/patient", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/lab", {
          headers: { Authorization: `Bearer ${token}` },
        }),
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
      const res = await fetch("/api/appointment", {
        method: "PUT",
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

      if (!res.ok) throw new Error("Gabim gjatë krijimit të takimit");
      onClose();
      navigate("/appointments"); 
    } catch (err) {
      console.error("Gabim gjatë krijimit të takimit:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0f172a] p-6 rounded w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6">Shto Takim</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DatePicker
            selected={start}
            onChange={(date) => setStart(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            className="w-full p-2 rounded bg-gray-800 text-white"
            popperPlacement="bottom-start"
            portalId="root"
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

export default AddAppointmentModal;
