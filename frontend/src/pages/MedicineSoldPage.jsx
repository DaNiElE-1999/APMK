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
        fetch("/api/medicine_sold", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/patient", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/doctor", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/medicine", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!salesRes.ok || !patRes.ok || !docRes.ok || !medRes.ok) {
        throw new Error("Gabim në marrjen e të dhënave");
      }

      const [sales, patientsData, doctorsData, medicinesData] =
        await Promise.all([
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
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", color: "white" }}
    >
      {/* Header Row */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="fw-bold">Histori Shitjesh të Barnave</h1>
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

      {/* Form to Add Sale */}
      <form onSubmit={handleSubmit} className="row g-3 mb-5">
        {/* Patient Select */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="patientSelect" className="form-label text-white">
            Zgjidh Pacientin
          </label>
          <select
            id="patientSelect"
            value={formData.patient_id}
            onChange={(e) =>
              setFormData({ ...formData, patient_id: e.target.value })
            }
            required
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

        {/* Doctor Select */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="doctorSelect" className="form-label text-white">
            Zgjidh Mjekun
          </label>
          <select
            id="doctorSelect"
            value={formData.doctor_id}
            onChange={(e) =>
              setFormData({ ...formData, doctor_id: e.target.value })
            }
            required
            className="form-select bg-dark text-white border-secondary"
          >
            <option value="">Zgjidh Mjekun</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.first} {d.last}
              </option>
            ))}
          </select>
        </div>

        {/* Medicine Select */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="medicineSelect" className="form-label text-white">
            Zgjidh Barnën
          </label>
          <select
            id="medicineSelect"
            value={formData.medicine_id}
            onChange={(e) =>
              setFormData({ ...formData, medicine_id: e.target.value })
            }
            required
            className="form-select bg-dark text-white border-secondary"
          >
            <option value="">Zgjidh Barnën</option>
            {medicines.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="quantityInput" className="form-label text-white">
            Sasia
          </label>
          <input
            type="number"
            id="quantityInput"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            min={1}
            required
            className="form-control bg-dark text-white border-secondary"
            placeholder="Sasia"
          />
        </div>

        {/* Time Sold DatePicker */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="timeSoldPicker" className="form-label text-white">
            Data & Ora e Shitjes
          </label>
          <DatePicker
            selected={formData.time_sold}
            onChange={(date) =>
              setFormData({ ...formData, time_sold: date })
            }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            id="timeSoldPicker"
            className="form-control bg-dark text-white border-secondary"
            placeholderText="Zgjidh datën dhe orën"
          />
        </div>

        {/* Submit Button */}
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">
            Shto Shitje
          </button>
        </div>
      </form>

      {/* Table of Records */}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover mb-0 rounded">
          <thead className="table-secondary text-dark">
            <tr>
              <th scope="col" className="py-2 px-3">
                Pacienti
              </th>
              <th scope="col" className="py-2 px-3">
                Mjeku
              </th>
              <th scope="col" className="py-2 px-3">
                Medikamenti
              </th>
              <th scope="col" className="py-2 px-3">
                Sasia
              </th>
              <th scope="col" className="py-2 px-3">
                Data e Shitjes
              </th>
              <th scope="col" className="py-2 px-3">
                Veprim
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td className="py-2 px-3">
                  {r.patient?.first} {r.patient?.last} ({r.patient?.age} vjeç)
                </td>
                <td className="py-2 px-3">
                  {r.doctor?.first} {r.doctor?.last} ({r.doctor?.speciality})
                </td>
                <td className="py-2 px-3">
                  {r.medicine?.name} - €{r.medicine?.cost?.toFixed(2)}
                </td>
                <td className="py-2 px-3">{r.quantity}</td>
                <td className="py-2 px-3">
                  {new Date(r.time_sold).toLocaleString()}
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => handleDelete(r._id)}
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
    </div>
  );
};

export default MedicineSoldList;
