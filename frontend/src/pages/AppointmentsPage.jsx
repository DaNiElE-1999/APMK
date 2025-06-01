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

      <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-2">
        Takimet e Planifikuara
      </h2>

      {/* Tabela e Takimeve */}
      {appointments.length === 0 ? (
        <p className="text-gray-300">Nuk ka takime të regjistruara.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Ora</th>
                <th className="px-4 py-2">Mjeku</th>
                <th className="px-4 py-2">Pacienti</th>
                <th className="px-4 py-2">Laboratori</th>
                <th className="px-4 py-2">Veprim</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-2">
                    {new Date(appt.start).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(appt.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(appt.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {appt.doctor?.first} {appt.doctor?.last}
                  </td>
                  <td className="px-4 py-2">
                    {appt.patient?.first} {appt.patient?.last}
                  </td>
                  <td className="px-4 py-2">
                    {appt.lab?.type || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-md transition transform hover:scale-105"
                    >
                      🗑️ Fshi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
