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
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", color: "white" }}
    >
      {/* Row with “Back” and “Add Lab” */}
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
            + Shto Analizë
          </button>
        </div>
      </div>

      {/* Section Header */}
      <h2 className="fw-bold mb-3 border-bottom pb-2">
        Analizat Laboratorike
      </h2>

      {/* Empty State */}
      {labs.length === 0 ? (
        <p className="text-muted">Nuk ka analiza të regjistruara.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover mb-0 rounded">
            <thead className="table-secondary text-dark">
              <tr>
                <th scope="col" className="py-2 px-3">
                  Lloji
                </th>
                <th scope="col" className="py-2 px-3">
                  Kosto (€)
                </th>
                <th scope="col" className="py-2 px-3">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => (
                <tr key={lab._id}>
                  <td className="py-2 px-3">{lab.type}</td>
                  <td className="py-2 px-3">{lab.cost.toFixed(2)}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => {
                        setSelected(lab);
                        setShowEdit(true);
                      }}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edito
                    </button>
                    <button
                      onClick={() => handleDelete(lab._id)}
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

      {/* AddLab Modal */}
      {showAdd && (
        <AddLabModal
          onClose={() => setShowAdd(false)}
          onRefresh={fetchLabs}
        />
      )}

      {/* EditLab Modal */}
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
