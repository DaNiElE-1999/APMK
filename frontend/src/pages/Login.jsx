import React, { useState } from 'react';
// import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // const response = await axios.post('/api/login', { email, password });
      // console.log("Login response:", response.data);
      alert(`Hyrje me sukses si: ${email}`);
    } catch (err) {
      alert('Hyrja dështoi!');
    }
  };

  return (
    <form onSubmit={handleLogin} className="dashboard-container">
      <h2>Hyrje në sistem</h2>
      <input
        type="email"
        placeholder="Email-i"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Fjalëkalimi"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Hyr</button>
    </form>
  );
}

export default Login;
