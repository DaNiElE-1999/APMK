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
    <div className="p-6 text-white relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-6 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
      >
        ← Kthehu
      </button>

      <h1 className="text-2xl font-bold mb-6">Skedarët</h1>

      <form onSubmit={handleUpload} className="mb-8 space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700"
        >
          <option value="">Zgjidh Mjekun</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.first} {doc.last}
            </option>
          ))}
        </select>

        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700"
        >
          <option value="">Zgjidh Pacientin</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.first} {p.last}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Ngarko
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Lista e Skedarëve</h2>
      <ul className="space-y-3">
        {files.map((f) => (
          <li
            key={f._id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{f.name || f.filename}</p>
              {f.doctor_id && (
                <p className="text-sm">Mjek: {f.doctor_id?.first} {f.doctor_id?.last}</p>
              )}
              {f.patient_id && (
                <p className="text-sm">Pacient: {f.patient_id?.first} {f.patient_id?.last}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(f._id, f.name || f.filename, f.mimeType)}
                className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
              >
                Shkarko
              </button>
              <button
                onClick={() => handleDelete(f._id)}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Fshi
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
