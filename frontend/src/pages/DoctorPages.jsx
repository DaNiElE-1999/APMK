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
    <div className="p-6 text-white relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-6 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
      >
        ← Kthehu
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mjekët</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Shto Mjek
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-[#334155] text-left">
              <th className="p-3">Emri</th>
              <th className="p-3">Email</th>
              <th className="p-3">Specialiteti</th>
              <th className="p-3">Telefoni</th>
              <th className="p-3">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id} className="border-b border-gray-700">
                <td className="p-3">{doc.first} {doc.last}</td>
                <td className="p-3">{doc.email}</td>
                <td className="p-3">{doc.speciality}</td>
                <td className="p-3">{doc.phone || "—"}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
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
        <AddDoctorModal
          existingDoctors={doctors}
          onClose={() => setShowAddModal(false)}
          onRefresh={fetchDoctors}
        />
      )}

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
