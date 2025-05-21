// src/pages/Patients.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddPatientModal from "../components/AddPatientModal";
import EditPatientModal from "../components/EditPatientModal";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("/api/patient");
      setPatients(res.data);
    } catch (err) {
      console.error("Gabim në marrjen e pacientëve", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do e fshish këtë pacient?")) return;
    try {
      await axios.delete(`/api/patient/${id}`);
      fetchPatients();
    } catch (err) {
      console.error("Gabim në fshirje", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pacientët</h1>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Shto Pacient
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full">
          <thead className="bg-[#334155]">
            <tr>
              <th className="p-3 text-left">Emri</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Tel</th>
              <th className="p-3 text-left">Mosha</th>
              <th className="p-3 text-left">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id} className="border-b border-gray-700">
                <td className="p-3">{p.first} {p.last}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.phone || "—"}</td>
                <td className="p-3">{p.age}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelected(p);
                      setShowEdit(true);
                    }}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
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

      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} onRefresh={fetchPatients} />}
      {showEdit && selected && (
        <EditPatientModal patient={selected} onClose={() => setShowEdit(false)} onRefresh={fetchPatients} />
      )}
    </div>
  );
};

export default Patients;
