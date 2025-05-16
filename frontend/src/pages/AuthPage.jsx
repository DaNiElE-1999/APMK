import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const { login } = useAuth(); // përdor kontekstin

  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = mode === "login" ? "/api/login" : "/api/register"; // korrigjuar

    const body =
      mode === "login"
        ? { username: form.username, password: form.password }
        : form;

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Përgjigjja nga serveri:", data);

      if (res.ok && data.token) {
        login(data.token, data.username); // ruaj token dhe username në kontekst
        navigate("/dashboard");
      } else {
        alert(data.message || "Diçka shkoi keq.");
      }
    } catch (err) {
      alert("Gabim: " + err.message);
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
                type="text"
                placeholder="First Name"
                value={form.firstname}
                onChange={handleChange}
                required
              />
              <input
                name="lastname"
                type="text"
                placeholder="Last Name"
                value={form.lastname}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === "login"
            ? "Don't have an account?"
            : "Already registered?"}{" "}
          <button
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
