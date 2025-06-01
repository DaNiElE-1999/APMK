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

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që dëshiron të fshish këtë takim?")) return;

    try {
      const res = await fetch(`/api/appointment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Fshirja dështoi");

      fetchAppointments();
    } catch (err) {
      console.error("Gabim gjatë fshirjes së takimit:", err);
      alert("Gabim gjatë fshirjes së takimit");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Butonat: Kthehu & Shto Takim */}
      <div className="flex items-center gap-x-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-md transition transform hover:scale-105"
        >
          ← Kthehu
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md transition transform hover:scale-105"
        >
          + Shto Takim
        </button>
      </div>

      {/* Modal për Shtim Takimi */}
      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onRefresh={fetchAppointments}
        />
      )}

      {/* Titulli */}
      <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-2">
        Takimet e Planifikuara
      </h2>

      {/* Lista e Takimeve */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-300">Nuk ka takime të regjistruara.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="mb-1 text-sm text-gray-200">
                <strong>Data:</strong>{" "}
                {new Date(appt.start).toLocaleDateString()}{" "}
                {new Date(appt.start).toLocaleTimeString()} -{" "}
                {new Date(appt.end).toLocaleTimeString()}
              </p>
              <p className="mb-1 text-sm text-gray-200">
                <strong>Mjeku:</strong> {appt.doctor_id?.first} {appt.doctor_id?.last}
              </p>
              <p className="mb-1 text-sm text-gray-200">
                <strong>Pacienti:</strong> {appt.patient_id?.first} {appt.patient_id?.last}
              </p>
              {appt.lab && (
                <p className="text-sm text-gray-200">
                  <strong>Laboratori:</strong> {appt.lab?.type}
                </p>
              )}
              <div className="mt-3">
                <button
                  onClick={() => handleDelete(appt._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-md transition transform hover:scale-105"
                >
                  🗑️ Fshi
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
