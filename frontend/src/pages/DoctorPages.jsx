// src/pages/Doctors.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddDoctorModal from "../components/AddDoctorModal";
import EditDoctorModal from "../components/EditDoctorModal";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/api/doctor");
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do e fshish?")) return;
    try {
      await axios.delete(`/api/doctor/${id}`);
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor", err);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mjekët</h1>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Shto Mjek
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full">
          <thead className="bg-[#334155]">
            <tr>
              <th className="p-3 text-left">Emri</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Specialiteti</th>
              <th className="p-3 text-left">Tel</th>
              <th className="p-3 text-left">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d._id} className="border-b border-gray-700">
                <td className="p-3">{d.first} {d.last}</td>
                <td className="p-3">{d.email}</td>
                <td className="p-3">{d.speciality}</td>
                <td className="p-3">{d.phone || "—"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => {
                      setSelected(d);
                      setShowEdit(true);
                    }}
                  >
                    Edito
                  </button>
                  <button
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(d._id)}
                  >
                    Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <AddDoctorModal onClose={() => setShowAdd(false)} onRefresh={fetchDoctors} />}
      {showEdit && selected && (
        <EditDoctorModal doctor={selected} onClose={() => setShowEdit(false)} onRefresh={fetchDoctors} />
      )}
    </div>
  );
};

export default Doctors;
