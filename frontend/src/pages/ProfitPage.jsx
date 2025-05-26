import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfitDashboard = () => {
  const [data, setData] = useState({ sale: 0, lab: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    patient_id: "",
    doctor_id: "",
    ageMin: "",
    ageMax: ""
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProfits = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/profits/all?${query}`, {
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

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProfits();
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analiza e Fitimeve</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Kthehu mbrapa
        </button>
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleFilter}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
      >
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
          className="p-2 rounded bg-[#334155]"
          placeholder="Nga data"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
          className="p-2 rounded bg-[#334155]"
          placeholder="Deri më"
        />
        <input
          type="number"
          name="ageMin"
          value={filters.ageMin}
          onChange={handleChange}
          className="p-2 rounded bg-[#334155]"
          placeholder="Mosha min"
        />
        <input
          type="number"
          name="ageMax"
          value={filters.ageMax}
          onChange={handleChange}
          className="p-2 rounded bg-[#334155]"
          placeholder="Mosha max"
        />
        <button
          type="submit"
          className="col-span-full md:col-span-1 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Apliko Filtra
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <p>Duke ngarkuar të dhënat...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1e293b] p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Fitim nga Shitjet</h2>
            <p className="text-xl mt-2">€ {data.sale.toFixed(2)}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Fitim nga Laboratori</h2>
            <p className="text-xl mt-2">€ {data.lab.toFixed(2)}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Totali</h2>
            <p className="text-xl mt-2 font-bold text-green-400">
              € {data.total.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitDashboard;
