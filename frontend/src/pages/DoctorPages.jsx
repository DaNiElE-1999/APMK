import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddDoctorModal from "../components/AddDoctorModal";
import EditDoctorModal from "../components/EditDoctorModal";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së mjekëve:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do ta fshish mjekun?")) return;
    try {
      await fetch(`/api/doctor/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDoctors();
    } catch (err) {
      console.error("Gabim gjatë fshirjes së mjekut:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="container-fluid py-4" style={{ color: "white", backgroundColor: "#0a1a2a", minHeight: "100vh" }}>
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-light"
        >
          ← Kthehu
        </button>
      </div>

      {/* Header + “Add Doctor” button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Mjekët</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          Shto Mjek
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive bg-dark rounded shadow-sm">
        <table className="table table-dark table-striped table-hover mb-0">
          <thead className="table-secondary text-dark">
            <tr>
              <th scope="col" className="py-2 px-3">Emri</th>
              <th scope="col" className="py-2 px-3">Email</th>
              <th scope="col" className="py-2 px-3">Specialiteti</th>
              <th scope="col" className="py-2 px-3">Telefoni</th>
              <th scope="col" className="py-2 px-3">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td className="py-2 px-3">
                  {doc.first} {doc.last}
                </td>
                <td className="py-2 px-3">{doc.email}</td>
                <td className="py-2 px-3">{doc.speciality}</td>
                <td className="py-2 px-3">{doc.phone || "—"}</td>
                <td className="py-2 px-3">
                  <div className="d-flex">
                    <button
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setShowEditModal(true);
                      }}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edito
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Fshi
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Nuk u gjet asnjë mjek.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* AddDoctor Modal */}
      {showAddModal && (
        <AddDoctorModal
          existingDoctors={doctors}
          onClose={() => setShowAddModal(false)}
          onRefresh={fetchDoctors}
        />
      )}

      {/* EditDoctor Modal */}
      {showEditModal && selectedDoctor && (
        <EditDoctorModal
          doctor={selectedDoctor}
          onClose={() => setShowEditModal(false)}
          onRefresh={fetchDoctors}
        />
      )}
    </div>
  );
};

export default Doctors;
