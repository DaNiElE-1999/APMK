import React from 'react';

function Appointments() {
  const appointments = [
    { id: 1, patient: 'Arben Hoxha', doctor: 'Dr. Ilir', date: '2025-05-12', time: '10:00' },
    { id: 2, patient: 'Nora Dema', doctor: 'Dr. Lira', date: '2025-05-13', time: '12:00' }
  ];

  return (
    <div className="dashboard-container">
      <h2>Takimet e Planifikuara</h2>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            <strong>{a.date} në {a.time}</strong> - {a.patient} me {a.doctor}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
