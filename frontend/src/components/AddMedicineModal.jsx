import React, { useState } from "react";

const AddMedicineModal = ({ onClose, onRefresh }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/medicine", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, cost: parseFloat(cost) }),
      });
      if (!res.ok) throw new Error("Gabim gjatë shtimit të barit");
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim në krijimin e barit:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] p-6 rounded shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Shto Bar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Emri i barit"
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Çmimi"
            required
            step="0.01"
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              Anulo
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Shto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
