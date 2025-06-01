import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddLabModal from "../components/AddLabModal";
import EditLabModal from "../components/EditLabModal";

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchLabs = async () => {
    try {
      const res = await fetch("/api/lab", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim në marrjen e analizave");
      const data = await res.json();
      setLabs(data);
    } catch (err) {
      console.error("Gabim në marrjen e analizave", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do e fshish këtë analizë?")) return;
    try {
      const res = await fetch(`/api/lab/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim në fshirje");
      fetchLabs();
    } catch (err) {
      console.error("Gabim në fshirje", err);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  return (
    <div className="p-6 text-white relative">
      {/* Butoni i kthimit */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-6 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
      >
        ← Kthehu
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analizat Laboratorike</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Shto Analizë
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full">
          <thead className="bg-[#334155]">
            <tr>
              <th className="p-3 text-left">Lloji</th>
              <th className="p-3 text-left">Kosto (€)</th>
              <th className="p-3 text-left">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab._id} className="border-b border-gray-700">
                <td className="p-3">{lab.type}</td>
                <td className="p-3">{lab.cost.toFixed(2)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelected(lab);
                      setShowEdit(true);
                    }}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDelete(lab._id)}
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
        <AddLabModal onClose={() => setShowAdd(false)} onRefresh={fetchLabs} />
      )}
      {showEdit && selected && (
        <EditLabModal
          lab={selected}
          onClose={() => setShowEdit(false)}
          onRefresh={fetchLabs}
        />
      )}
    </div>
  );
};

export default Labs;
