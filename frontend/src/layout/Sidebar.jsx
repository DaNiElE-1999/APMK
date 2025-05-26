import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaPills,
  FaMoneyBill,
  FaSignOutAlt,
  FaFlask,
  FaUserInjured,
} from "react-icons/fa";
import { MdSpaceDashboard, MdEventNote } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import "./../styles/dashboard.css";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <Link to="/dashboard" className="sidebar-title">
        Klinika
      </Link>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <MdSpaceDashboard /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/appointments">
            <MdEventNote /> Takimet
          </Link>
        </li>
        <li>
          <Link to="/doctors">
            <FaUserMd /> Mjekët
          </Link>
        </li>
        <li>
          <Link to="/labs">
            <FaFlask /> Analizat
          </Link>
        </li>
        <li>
          <Link to="/medicines">
            <FaPills /> Barnat
          </Link>
        </li>
        <li>
          <Link to="/medicine-sold">
            <FaMoneyBill /> Shitjet
          </Link>
        </li>
        <li>
              <Link to="/files">
            <FaFlask /> Skedarët
            </Link>
        </li>

        <li>
          <Link to="/patients">
            <FaUserInjured /> Pacientët
          </Link>
        </li>
        <li>
          <Link to="/profit">
            <FaMoneyBill /> Fitimi
          </Link>
        </li>
        <li
          className="logout"
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleLogout()}
        >
          <FaSignOutAlt /> Dil
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
