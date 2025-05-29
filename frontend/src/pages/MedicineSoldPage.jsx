import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MedicineSoldList = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    medicine_id: "",
    quantity: 1,
    time_sold: new Date(),
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [salesRes, patRes, docRes, medRes] = await Promise.all([
        fetch("/api/medicine_sold", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/patient", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/doctor", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/medicine", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [sales, patientsData, doctorsData, medicinesData] = await Promise.all([
        salesRes.json(),
        patRes.json(),
        docRes.json(),
        medRes.json(),
      ]);

      setRecords(sales);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setMedicines(medicinesData);
    } catch (err) {
      console.error("Gabim në marrjen e të dhënave", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do e fshish këtë shitje?")) return;
    try {
      const res = await fetch(`/api/medicine_sold/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gabim gjatë fshirjes");
      fetchData();
    } catch (err) {
      console.error("Gabim gjatë fshirjes", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/medicine_sold", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Gabim gjatë shtimit");
      setFormData({
        patient_id: "",
        doctor_id: "",
        medicine_id: "",
        quantity: 1,
        time_sold: new Date(),
      });
      fetchData();
    } catch (err) {
      console.error("Gabim gjatë krijimit të shitjes", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histori Shitjesh të Barnave</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Kthehu mbrapa
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <select
          value={formData.patient_id}
          onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
          required
          className="w-full px-3 py-2 rounded bg-gray-700"
        >
          <option value="">Zgjidh Pacientin</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.first} {p.last}
            </option>
          ))}
        </select>

        <select
          value={formData.doctor_id}
          onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
          required
          className="w-full px-3 py-2 rounded bg-gray-700"
        >
          <option value="">Zgjidh Mjekun</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.first} {d.last}
            </option>
          ))}
        </select>

        <select
          value={formData.medicine_id}
          onChange={(e) => setFormData({ ...formData, medicine_id: e.target.value })}
          required
          className="w-full px-3 py-2 rounded bg-gray-700"
        >
          <option value="">Zgjidh Barnën</option>
          {medicines.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          min={1}
          required
          placeholder="Sasia"
          className="w-full px-3 py-2 rounded bg-gray-700"
        />

        <DatePicker
              selected={formData.time_sold}
              onChange={(date) => setFormData({ ...formData, time_sold: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              popperPlacement="bottom-start"
              portalId="root"
        />


        <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Shto Shitje
        </button>
      </form>

      <div className="overflow-x-auto bg-[#1e293b] rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-[#334155]">
            <tr>
              <th className="p-3 text-left">Pacienti</th>
              <th className="p-3 text-left">Mjeku</th>
              <th className="p-3 text-left">Medikamenti</th>
              <th className="p-3 text-left">Sasia</th>
              <th className="p-3 text-left">Data e shitjes</th>
              <th className="p-3 text-left">Veprime</th>
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
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(r._id)}
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
    </div>
  );
};

export default MedicineSoldList;
