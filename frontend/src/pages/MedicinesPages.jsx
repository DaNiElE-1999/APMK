import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddMedicineModal from "../components/AddMedicineModal";
import EditMedicineModal from "../components/EditMedicineModal";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchMedicines = async () => {
    try {
      const res = await fetch("/api/medicine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim gjatë marrjes së medikamenteve");
      const data = await res.json();
      setMedicines(data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së medikamenteve", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do e fshish këtë medikament?")) return;
    try {
      const res = await fetch(`/api/medicine/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim gjatë fshirjes");
      fetchMedicines();
    } catch (err) {
      console.error("Gabim gjatë fshirjes", err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Barnat</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Kthehu mbrapa
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Shto Bar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full">
          <thead className="bg-[#334155]">
            <tr>
              <th className="p-3 text-left">Emri</th>
              <th className="p-3 text-left">Çmimi (€)</th>
              <th className="p-3 text-left">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med._id} className="border-b border-gray-700">
                <td className="p-3">{med.name}</td>
                <td className="p-3">{med.cost.toFixed(2)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelected(med);
                      setShowEdit(true);
                    }}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDelete(med._id)}
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

      {showAdd && (
        <AddMedicineModal
          onClose={() => setShowAdd(false)}
          onRefresh={fetchMedicines}
        />
      )}
      {showEdit && selected && (
        <EditMedicineModal
          medicine={selected}
          onClose={() => setShowEdit(false)}
          onRefresh={fetchMedicines}
        />
      )}
    </div>
  );
};

export default Medicines;
