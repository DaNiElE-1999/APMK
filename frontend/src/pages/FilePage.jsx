import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [editData, setEditData] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/file", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gabim gjatë marrjes së skedarëve");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Gabim gjatë listimit të skedarëve:", err);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [doctorRes, patientRes] = await Promise.all([
        fetch("/api/doctor", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/patient", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [doctorData, patientData] = await Promise.all([
        doctorRes.json(),
        patientRes.json(),
      ]);
      setDoctors(doctorData);
      setPatients(patientData);
    } catch (err) {
      console.error("Gabim në dropdown", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Zgjidh një skedar");
    if (!doctorId && !patientId) return alert("Zgjidh të paktën një ID");

    const formData = new FormData();
    formData.append("file", file);
    if (doctorId) formData.append("doctor_id", doctorId);
    if (patientId) formData.append("patient_id", patientId);

    try {
      const res = await fetch("/api/file", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Ngarkimi dështoi");
      setFile(null);
      setDoctorId("");
      setPatientId("");
      fetchFiles();
    } catch (err) {
      console.error("Gabim gjatë ngarkimit:", err);
    }
  };

  const handleDownload = async (id, name, mimeType) => {
    try {
      const res = await fetch(`/api/file/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const byteCharacters = atob(data.data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: mimeType });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name;
      link.click();
    } catch (err) {
      console.error("Gabim gjatë shkarkimit:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do ta fshish këtë skedar?")) return;
    try {
      const res = await fetch(`/api/file/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gabim gjatë fshirjes");
      fetchFiles();
    } catch (err) {
      console.error("Gabim gjatë fshirjes së skedarit:", err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/file/${editData._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          doctor_id: editData.doctor_id?._id || "",
          patient_id: editData.patient_id?._id || "",
        }),
      });
      if (!res.ok) throw new Error("Gabim gjatë përditësimit");
      setEditData(null);
      fetchFiles();
    } catch (err) {
      console.error("Gabim gjatë përditësimit të skedarit:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchDropdowns();
  }, []);

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", color: "white" }}
    >
      {/* Header Row */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="fw-bold">Skedarët</h1>
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

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="row g-3 mb-5">
        {/* File Input */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="fileInput" className="form-label text-white">
            Zgjidh Skedarin
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control bg-dark text-white border-secondary"
          />
        </div>

        {/* Doctor Select */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="doctorSelect" className="form-label text-white">
            Zgjidh Mjekun
          </label>
          <select
            id="doctorSelect"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="form-select bg-dark text-white border-secondary"
          >
            <option value="">Zgjidh Mjekun</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.first} {doc.last}
              </option>
            ))}
          </select>
        </div>

        {/* Patient Select */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="patientSelect" className="form-label text-white">
            Zgjidh Pacientin
          </label>
          <select
            id="patientSelect"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="form-select bg-dark text-white border-secondary"
          >
            <option value="">Zgjidh Pacientin</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.first} {p.last}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Button */}
        <div className="col-12 col-md-6 col-lg-3 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100">
            Ngarko
          </button>
        </div>
      </form>

      {/* File List Table */}
      {files.length === 0 ? (
        <p className="text-muted">Nuk ka skedarë të ngarkuar.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover mb-0 rounded">
            <thead className="table-secondary text-dark">
              <tr>
                <th scope="col" className="py-2 px-3">
                  Emri
                </th>
                <th scope="col" className="py-2 px-3">
                  Mjeku
                </th>
                <th scope="col" className="py-2 px-3">
                  Pacienti
                </th>
                <th scope="col" className="py-2 px-3">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f._id}>
                  <td className="py-2 px-3">{f.name || f.filename}</td>
                  <td className="py-2 px-3">
                    {f.doctor_id
                      ? `${f.doctor_id.first} ${f.doctor_id.last}`
                      : "—"}
                  </td>
                  <td className="py-2 px-3">
                    {f.patient_id
                      ? `${f.patient_id.first} ${f.patient_id.last}`
                      : "—"}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() =>
                        handleDownload(
                          f._id,
                          f.name || f.filename,
                          f.mimeType
                        )
                      }
                      className="btn btn-sm btn-success me-2"
                    >
                      Shkarko
                    </button>
                    <button
                      onClick={() => handleDelete(f._id)}
                      className="btn btn-sm btn-danger me-2"
                    >
                      Fshi
                    </button>
                    <button
                      onClick={() => setEditData(f)}
                      className="btn btn-sm btn-warning"
                    >
                      Edito
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal (conditionally shown) */}
      {editData && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-bottom-secondary">
                <h5 className="modal-title">Përditëso Skedarin</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditData(null)}
                ></button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="editName" className="form-label">
                      Emri
                    </label>
                    <input
                      id="editName"
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="editDoctor" className="form-label">
                      Mjeku
                    </label>
                    <select
                      id="editDoctor"
                      className="form-select bg-dark text-white border-secondary"
                      value={editData.doctor_id?._id || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          doctor_id: doctors.find(
                            (d) => d._id === e.target.value
                          ) || null,
                        })
                      }
                    >
                      <option value="">Pa Mjek</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.first} {doc.last}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="editPatient" className="form-label">
                      Pacienti
                    </label>
                    <select
                      id="editPatient"
                      className="form-select bg-dark text-white border-secondary"
                      value={editData.patient_id?._id || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          patient_id: patients.find(
                            (p) => p._id === e.target.value
                          ) || null,
                        })
                      }
                    >
                      <option value="">Pa Pacient</option>
                      {patients.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.first} {p.last}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-top-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditData(null)}
                  >
                    Anulo
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Ruaj Ndryshimet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
