import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Statistics() {
  const data = {
    labels: ['Pacientë', 'Mjekë', 'Takime', 'Receta'],
    datasets: [{
      label: 'Të dhëna',
      data: [120, 15, 40, 30],
      backgroundColor: '#2563eb'
    }]
  };

  const options = {
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Statistika të Klinikës</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default Statistics;
