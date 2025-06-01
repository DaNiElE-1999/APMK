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
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", color: "white" }}
    >
      {/* Buttons Row */}
      <div className="row mb-4 align-items-center">
        <div className="col-auto">
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline-light"
          >
            ← Kthehu
          </button>
        </div>
        <div className="col text-end">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            + Shto Takim
          </button>
        </div>
      </div>

      {/* Modal for Adding Appointment */}
      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onRefresh={fetchAppointments}
        />
      )}

      <h2 className="fw-bold mb-3 border-bottom pb-2">Takimet e Planifikuara</h2>

      {appointments.length === 0 ? (
        <p className="text-muted">Nuk ka takime të regjistruara.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover mb-0 rounded">
            <thead className="table-secondary text-dark">
              <tr>
                <th scope="col" className="py-2 px-3">
                  Data
                </th>
                <th scope="col" className="py-2 px-3">
                  Ora
                </th>
                <th scope="col" className="py-2 px-3">
                  Mjeku
                </th>
                <th scope="col" className="py-2 px-3">
                  Pacienti
                </th>
                <th scope="col" className="py-2 px-3">
                  Laboratori
                </th>
                <th scope="col" className="py-2 px-3">
                  Veprim
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const startDate = new Date(appt.start);
                const endDate = new Date(appt.end);

                return (
                  <tr key={appt._id}>
                    <td className="py-2 px-3">
                      {startDate.toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      {startDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {endDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 px-3">
                      {appt.doctor?.first} {appt.doctor?.last}
                    </td>
                    <td className="py-2 px-3">
                      {appt.patient?.first} {appt.patient?.last}
                    </td>
                    <td className="py-2 px-3">{appt.lab?.type || "-"}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleDelete(appt._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Fshi
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
