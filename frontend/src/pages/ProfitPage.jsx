import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfitDashboard = () => {
  const [data, setData] = useState({ sale: 0, lab: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: new Date(),
    to: new Date(),
    patient_id: "",
    doctor_id: "",
    ageMin: "",
    ageMax: "",
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProfits = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        from: filters.from.toISOString().split("T")[0],
        to: filters.to.toISOString().split("T")[0],
      }).toString();

      const res = await fetch(`/api/profit/all?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gabim gjatë marrjes së fitimeve");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Gabim gjatë marrjes së fitimeve", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfits();
  }, []);

  const handleChange = (name, value) =>
    setFilters({ ...filters, [name]: value });

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProfits();
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", color: "white" }}
    >
      {/* Header Row */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="fw-bold">Analiza e Fitimeve</h1>
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

      {/* Filter Form */}
      <form onSubmit={handleFilter} className="row g-3 mb-5">
        {/* From Date */}
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label text-white">Nga data</label>
          <DatePicker
            selected={filters.from}
            onChange={(date) => handleChange("from", date)}
            dateFormat="yyyy-MM-dd"
            className="form-control bg-dark text-white border-secondary"
            placeholderText="YYYY-MM-DD"
          />
        </div>

        {/* To Date */}
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label text-white">Deri më</label>
          <DatePicker
            selected={filters.to}
            onChange={(date) => handleChange("to", date)}
            dateFormat="yyyy-MM-dd"
            className="form-control bg-dark text-white border-secondary"
            placeholderText="YYYY-MM-DD"
          />
        </div>

        {/* Age Minimum */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="ageMin" className="form-label text-white">
            Mosha Min
          </label>
          <input
            type="number"
            id="ageMin"
            name="ageMin"
            value={filters.ageMin}
            onChange={(e) => handleChange("ageMin", e.target.value)}
            className="form-control bg-dark text-white border-secondary"
            placeholder="Shembull: 18"
          />
        </div>

        {/* Age Maximum */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="ageMax" className="form-label text-white">
            Mosha Max
          </label>
          <input
            type="number"
            id="ageMax"
            name="ageMax"
            value={filters.ageMax}
            onChange={(e) => handleChange("ageMax", e.target.value)}
            className="form-control bg-dark text-white border-secondary"
            placeholder="Shembull: 65"
          />
        </div>

        {/* Filter Button */}
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">
            Apliko Filtra
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <p className="text-muted">Duke ngarkuar të dhënat...</p>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card bg-dark text-white h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Fitim nga Shitjet</h5>
                <p className="card-text display-6 mt-3">
                  € {data.sale.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card bg-dark text-white h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Fitim nga Laboratori</h5>
                <p className="card-text display-6 mt-3">
                  € {data.lab.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card bg-dark text-white h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Totali</h5>
                <p className="card-text display-6 mt-3 text-success">
                  € {data.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitDashboard;
