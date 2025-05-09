import React from 'react';

function Prescriptions() {
  const prescriptions = [
    { id: 1, patient: 'Arben Hoxha', medication: 'Paracetamol 500mg', date: '2025-05-10' },
    { id: 2, patient: 'Nora Dema', medication: 'Ibuprofen 200mg', date: '2025-05-11' }
  ];

  return (
    <div className="dashboard-container">
      <h2>Recetat e Lëshuara</h2>
      <ul>
        {prescriptions.map((r) => (
          <li key={r.id}>
            {r.date} - {r.patient}: <em>{r.medication}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Prescriptions;
