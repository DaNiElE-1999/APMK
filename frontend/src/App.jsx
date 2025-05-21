// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app dark">
          <AppRouter />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
