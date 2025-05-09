import React, { useState, useEffect } from 'react';
import PatientCard from '../components/PatientCard';

function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Në praktikë zëvendësohet me axios.get('/api/patients')
    const data = [
      { id: 1, name: 'Arben Hoxha', age: 34, gender: 'Mashkull', email: 'arben@example.com', phone: '0691122334' },
      { id: 2, name: 'Nora Dema', age: 29, gender: 'Femër', email: 'nora@example.com', phone: '0695566778' }
    ];
    setPatients(data);
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Lista e Pacientëve</h2>
      {patients.length === 0 ? (
        <p>Nuk ka pacientë për të shfaqur.</p>
      ) : (
        patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))
      )}
    </div>
  );
}

export default Patients;
