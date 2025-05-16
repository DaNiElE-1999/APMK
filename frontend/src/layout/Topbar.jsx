import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           
    navigate("/login"); 
  };

  return (
    <div className="topbar">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Topbar;
