import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-container">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
