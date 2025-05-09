import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // opsional nëse do CSS global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
