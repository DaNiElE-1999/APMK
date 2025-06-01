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
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", color: "white" }}
    >
      {/* Row: Back + Add */}
      <div className="row mb-4 align-items-center">
        <div className="col-auto">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-light"
          >
            ← Kthehu
          </button>
        </div>
        <div className="col text-end">
          <button
            onClick={() => setShowAdd(true)}
            className="btn btn-primary"
          >
            + Shto Bar
          </button>
        </div>
      </div>

      {/* Section Header */}
      <h2 className="fw-bold mb-3 border-bottom pb-2">Barnat</h2>

      {/* Empty State */}
      {medicines.length === 0 ? (
        <p className="text-muted">Nuk ka medikamente të regjistruara.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover mb-0 rounded">
            <thead className="table-secondary text-dark">
              <tr>
                <th scope="col" className="py-2 px-3">Emri</th>
                <th scope="col" className="py-2 px-3">Çmimi (€)</th>
                <th scope="col" className="py-2 px-3">Veprim</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med._id}>
                  <td className="py-2 px-3">{med.name}</td>
                  <td className="py-2 px-3">{med.cost.toFixed(2)}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => {
                        setSelected(med);
                        setShowEdit(true);
                      }}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edito
                    </button>
                    <button
                      onClick={() => handleDelete(med._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Fshi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AddMedicine Modal */}
      {showAdd && (
        <AddMedicineModal
          onClose={() => setShowAdd(false)}
          onRefresh={fetchMedicines}
        />
      )}

      {/* EditMedicine Modal */}
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
