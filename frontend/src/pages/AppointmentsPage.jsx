// src/pages/Appointments.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddAppointmentModal from "../components/AddAppointmentModal";
import EditAppointmentModal from "../components/EditAppointmentModal";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim gjatë marrjes së të dhënave");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do ta fshish?")) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Fshirja dështoi");
      fetchAppointments();
    } catch (error) {
      console.error("Gabim gjatë fshirjes së takimit:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 text-white relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-6 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
      >
        ← Kthehu
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Takimet</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Shto takim
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-[#334155] text-left">
              <th className="p-3">Mjeku</th>
              <th className="p-3">Pacienti</th>
              <th className="p-3">Fillon</th>
              <th className="p-3">Mbaron</th>
              <th className="p-3">Laboratori</th>
              <th className="p-3">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="border-b border-gray-700">
                <td className="p-3">{appt.doctor?.first} {appt.doctor?.last}</td>
                <td className="p-3">{appt.patient?.first} {appt.patient?.last}</td>
                <td className="p-3">{new Date(appt.start).toLocaleString()}</td>
                <td className="p-3">{new Date(appt.end).toLocaleString()}</td>
                <td className="p-3">{appt.lab?.type || "—"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAppointment(appt);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onRefresh={fetchAppointments}
        />
      )}
      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowEditModal(false)}
          onRefresh={fetchAppointments}
        />
      )}
    </div>
  );
};

export default Appointments;
