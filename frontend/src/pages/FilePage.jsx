import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Zgjidh një skedar");
    if (!doctorId && !patientId) return alert("Zgjidh të paktën një ID");

    const formData = new FormData();
    formData.append("file", file);
    if (doctorId) formData.append("doctor_id", doctorId);
    if (patientId) formData.append("patient_id", patientId);

    try {
      const res = await fetch("/api/files", {
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
      const res = await fetch(`/api/files/${id}`, {
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
      const res = await fetch(`/api/files/${id}`, {
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
      const res = await fetch(`/api/files/${editData._id}`, {
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
  }, []);

  return (
    <div className="p-6 text-white relative">
      {/* Buton për t'u kthyer */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-6 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
      >
        ← Kthehu
      </button>

      <h1 className="text-2xl font-bold mb-6">Skedarët</h1>

      <form onSubmit={handleUpload} className="mb-8 space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          placeholder="ID e mjekut (opsionale)"
          className="w-full px-3 py-2 rounded bg-gray-700"
        />
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="ID e pacientit (opsionale)"
          className="w-full px-3 py-2 rounded bg-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Ngarko
        </button>
      </form>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-[#334155] text-left">
              <th className="p-3">Emri</th>
              <th className="p-3">Lloji</th>
              <th className="p-3">Mjeku</th>
              <th className="p-3">Pacienti</th>
              <th className="p-3">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id} className="border-b border-gray-700">
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.mimeType}</td>
                <td className="p-3">
                  {f.doctor_id ? `${f.doctor_id.first} ${f.doctor_id.last}` : "—"}
                </td>
                <td className="p-3">
                  {f.patient_id ? `${f.patient_id.first} ${f.patient_id.last}` : "—"}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleDownload(f._id, f.name, f.mimeType)}
                    className="bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                  >
                    Shkarko
                  </button>
                  <button
                    onClick={() => setEditData(f)}
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                  >
                    Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] p-6 rounded shadow-lg w-full max-w-md text-white">
            <h2 className="text-xl font-bold mb-4">Edito Skedarin</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-700"
              />
              <input
                type="text"
                value={editData.doctor_id?._id || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    doctor_id: { ...editData.doctor_id, _id: e.target.value },
                  })
                }
                placeholder="ID e mjekut"
                className="w-full px-3 py-2 rounded bg-gray-700"
              />
              <input
                type="text"
                value={editData.patient_id?._id || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    patient_id: { ...editData.patient_id, _id: e.target.value },
                  })
                }
                placeholder="ID e pacientit"
                className="w-full px-3 py-2 rounded bg-gray-700"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ruaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
