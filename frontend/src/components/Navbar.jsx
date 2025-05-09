import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Klinika</h2>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/patients">Pacientët</Link>
        <Link to="/appointments">Takimet</Link>
        <Link to="/prescriptions">Recetat</Link>
        <Link to="/statistics">Statistika</Link>
        <Link to="/login">Hyr</Link>
        <Link to="/register">Regjistrohu</Link>
      </div>
    </nav>
  );
}

export default Navbar;
