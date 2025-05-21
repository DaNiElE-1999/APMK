// src/pages/Files.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadFileModal from "../components/files/UploadFileModal";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Gabim në marrjen e skedarëve", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do e fshish këtë dokument?")) return;
    try {
      await axios.delete(`/api/files/${id}`);
      fetchFiles();
    } catch (err) {
      console.error("Gabim në fshirje", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`/api/files/${id}`);
      const data = res.data;
      const blob = b64toBlob(data.data, data.mimeType);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Gabim në shikim", err);
    }
  };

  const b64toBlob = (b64Data, contentType) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice).map((ch) => ch.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dokumentet</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Ngarko Dokument
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full">
          <thead className="bg-[#334155]">
            <tr>
              <th className="p-3 text-left">Emri</th>
              <th className="p-3 text-left">Lloji</th>
              <th className="p-3 text-left">Pacient/Mjek</th>
              <th className="p-3 text-left">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id} className="border-b border-gray-700">
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.mimeType}</td>
                <td className="p-3">
                  {f.patient_id
                    ? `${f.patient_id.first} ${f.patient_id.last}`
                    : f.doctor_id
                    ? `${f.doctor_id.first} ${f.doctor_id.last}`
                    : "—"}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleView(f._id)}
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    Shiko
                  </button>
                  <button
                    onClick={() => handleDelete(f._id)}
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

      {showUpload && (
        <UploadFileModal onClose={() => setShowUpload(false)} onRefresh={fetchFiles} />
      )}
    </div>
  );
};

export default Files;
