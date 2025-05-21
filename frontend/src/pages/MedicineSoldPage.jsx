// src/pages/MedicineSoldList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const MedicineSoldList = () => {
  const [records, setRecords] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/medicine_sold");
      setRecords(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së shitjeve", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Histori Shitjesh të Barnave</h1>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-[#334155]">
            <tr>
              <th className="p-3 text-left">Pacienti</th>
              <th className="p-3 text-left">Mjeku</th>
              <th className="p-3 text-left">Medikamenti</th>
              <th className="p-3 text-left">Sasia</th>
              <th className="p-3 text-left">Data e shitjes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b border-gray-700">
                <td className="p-3">
                  {r.patient?.first} {r.patient?.last} ({r.patient?.age} vjeç)
                </td>
                <td className="p-3">
                  {r.doctor?.first} {r.doctor?.last} ({r.doctor?.speciality})
                </td>
                <td className="p-3">
                  {r.medicine?.name} - €{r.medicine?.cost?.toFixed(2)}
                </td>
                <td className="p-3">{r.quantity}</td>
                <td className="p-3">{new Date(r.time_sold).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineSoldList;
