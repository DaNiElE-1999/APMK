// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // ose 'register'
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = mode === "login" ? "/api/users/login" : "/api/users/register";
    const body =
      mode === "login"
        ? { username: form.username, password: form.password }
        : {
            username: form.username,
            password: form.password,
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
          };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data); // ruaj userin me token
        navigate("/dashboard");
      } else {
        alert(data.message || "Gabim gjatë autentikimit.");
      }
    } catch (err) {
      alert("Gabim në rrjet: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <input
                name="firstname"
                placeholder="First Name"
                onChange={handleChange}
                value={form.firstname}
                required
              />
              <input
                name="lastname"
                placeholder="Last Name"
                onChange={handleChange}
                value={form.lastname}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
                required
              />
            </>
          )}
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={form.username}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
          />
          <button type="submit">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === "login" ? "Don't have an account?" : "Already registered?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
