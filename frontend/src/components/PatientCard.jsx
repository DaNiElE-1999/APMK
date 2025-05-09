import React from 'react';
import './PatientCard.css';

function PatientCard({ patient }) {
  return (
    <div className="patient-card">
      <h3>{patient.name}</h3>
      <p><strong>Mosha:</strong> {patient.age}</p>
      <p><strong>Gjinia:</strong> {patient.gender}</p>
      <p><strong>Email:</strong> {patient.email}</p>
      <p><strong>Telefoni:</strong> {patient.phone}</p>
    </div>
  );
}

export default PatientCard;
