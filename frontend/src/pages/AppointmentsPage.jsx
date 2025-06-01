import React, { useEffect, useState } from "react";
import AddAppointmentModal from "../components/AddAppointmentModal";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Gabim gjatë marrjes së takimeve:", res.status, errText);
        throw new Error("Gabim gjatë marrjes së takimeve");
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Gabim:", err.message || err);
      alert("Nuk u morën dot takimet");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      {/* Butonat: Kthehu & Shto Takim */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Kthehu
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Shto Takim
        </button>
      </div>

      {/* Modal për Shtim Takimi */}
      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onRefresh={fetchAppointments}
        />
      )}

      {/* Lista e Takimeve */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Takimet e Planifikuara</h2>
        {appointments.length === 0 ? (
          <p className="text-white">Nuk ka takime të regjistruara.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li
                key={appt._id}
                className="bg-gray-800 text-white p-4 rounded shadow"
              >
                <div>
                  <strong>Data:</strong>{" "}
                  {new Date(appt.start).toLocaleDateString()}{" "}
                  {new Date(appt.start).toLocaleTimeString()} -{" "}
                  {new Date(appt.end).toLocaleTimeString()}
                </div>
                <div>
                  <strong>Mjeku:</strong> {appt.doctor_id?.first} {appt.doctor_id?.last}
                </div>
                <div>
                  <strong>Pacienti:</strong> {appt.patient_id?.first} {appt.patient_id?.last}
                </div>
                {appt.lab && (
                  <div>
                    <strong>Laboratori:</strong> {appt.lab?.type}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Appointments;
