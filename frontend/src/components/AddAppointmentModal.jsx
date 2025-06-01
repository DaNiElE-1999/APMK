import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddAppointmentModal = ({ onClose, onRefresh }) => {
  const now = new Date();
  const [start, setStart] = useState(now);
  const [end, setEnd] = useState(new Date(now.getTime() + 60 * 60 * 1000));
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [labId, setLabId] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labs, setLabs] = useState([]);

  const token = localStorage.getItem("token");

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
      alert("Failed to load dropdown data");
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
          start: start.toISOString(),
          end: end.toISOString(),
          doctor_id: doctorId,
          patient_id: patientId,
          lab: labId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      if (onRefresh) onRefresh(data);
      onClose();
    } catch (err) {
      console.error("Error:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const minSelectableTime = new Date();
  minSelectableTime.setHours(8, 0, 0, 0);
  const maxSelectableTime = new Date();
  maxSelectableTime.setHours(17, 0, 0, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0f172a] p-6 rounded w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6">Shto Takim</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fillimi</label>
            <DatePicker
              selected={start}
              onChange={(date) => {
                const duration = end - start;
                setStart(date);
                setEnd(new Date(date.getTime() + duration));
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              popperPlacement="bottom-start"
              minTime={minSelectableTime}
              maxTime={maxSelectableTime}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mbarimi</label>
            <DatePicker
              selected={end}
              onChange={(date) => setEnd(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              minDate={start}
              minTime={minSelectableTime}
              maxTime={maxSelectableTime}
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              popperPlacement="bottom-start"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Zgjidh Mjekun</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Kliko</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.first} {doc.last}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Zgjidh Pacientin</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Kliko</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.first} {p.last}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Zgjidh Laboratorin (opsionale)</label>
            <select
              value={labId}
              onChange={(e) => setLabId(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Kliko</option>
              {labs.map((lab) => (
                <option key={lab._id} value={lab._id}>
                  {lab.type}
                </option>
              ))}
            </select>
          </div>

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
