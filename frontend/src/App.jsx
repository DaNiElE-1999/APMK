import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <div className="app dark">
        <Router>
          <AppRouter />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
