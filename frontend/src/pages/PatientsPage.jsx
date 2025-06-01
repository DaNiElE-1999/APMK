import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPatientModal from "../components/AddPatientModal";
import EditPatientModal from "../components/EditPatientModal";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim në marrjen e pacientëve");
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Gabim në marrjen e pacientëve", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do e fshish këtë pacient?")) return;
    try {
      const res = await fetch(`/api/patient/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim në fshirje");
      fetchPatients();
    } catch (err) {
      console.error("Gabim në fshirje", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", color: "white" }}
    >
      {/* Header Row */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="fw-bold">Pacientët</h1>
        </div>
        <div className="col-auto">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-light"
          >
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Add Button */}
      <div className="row mb-3">
        <div className="col text-end">
          <button
            onClick={() => setShowAdd(true)}
            className="btn btn-primary"
          >
            + Shto Pacient
          </button>
        </div>
      </div>

      {/* Table of Patients */}
      {patients.length === 0 ? (
        <p className="text-muted">Nuk ka pacientë të regjistruar.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover mb-0 rounded">
            <thead className="table-secondary text-dark">
              <tr>
                <th scope="col" className="py-2 px-3">Emri</th>
                <th scope="col" className="py-2 px-3">Email</th>
                <th scope="col" className="py-2 px-3">Tel</th>
                <th scope="col" className="py-2 px-3">Mosha</th>
                <th scope="col" className="py-2 px-3">Veprim</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id}>
                  <td className="py-2 px-3">{p.first} {p.last}</td>
                  <td className="py-2 px-3">{p.email}</td>
                  <td className="py-2 px-3">{p.phone || "—"}</td>
                  <td className="py-2 px-3">{p.age}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => {
                        setSelected(p);
                        setShowEdit(true);
                      }}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edito
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
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

      {/* AddPatient Modal */}
      {showAdd && (
        <AddPatientModal
          onClose={() => setShowAdd(false)}
          onRefresh={fetchPatients}
        />
      )}

      {/* EditPatient Modal */}
      {showEdit && selected && (
        <EditPatientModal
          patient={selected}
          onClose={() => setShowEdit(false)}
          onRefresh={fetchPatients}
        />
      )}
    </div>
  );
};

export default Patients;
