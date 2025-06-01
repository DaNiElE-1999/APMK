import React, { useState } from "react";

const AddLabModal = ({ onClose, onRefresh }) => {
  const [type, setType] = useState("");
  const [cost, setCost] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/lab", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, cost: parseFloat(cost) }),
      });

      if (!res.ok) throw new Error("Gabim gjatë shtimit");

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Gabim gjatë krijimit të analizës:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] p-6 rounded shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Shto Analizë</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Lloji i analizës"
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Kosto"
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
            step="0.01"
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

export default AddLabModal;
