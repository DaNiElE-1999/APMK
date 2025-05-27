import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data); 
        navigate("/dashboard");
      } else {
        setError(data.message || "Regjistrimi dështoi");
      }
    } catch (err) {
      setError("Gabim në rrjet: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <input name="firstname" placeholder="First Name" onChange={handleChange} required className="w-full p-2 rounded bg-[#334155]" />
      <input name="lastname" placeholder="Last Name" onChange={handleChange} required className="w-full p-2 rounded bg-[#334155]" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 rounded bg-[#334155]" />
      <input name="username" placeholder="Username" onChange={handleChange} required className="w-full p-2 rounded bg-[#334155]" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 rounded bg-[#334155]" />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button type="submit" className="w-full bg-green-600 p-2 rounded hover:bg-green-700">Register</button>
    </form>
  );
};

export default RegisterForm;
