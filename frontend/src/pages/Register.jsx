import React, { useState } from 'react';
// import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // const response = await axios.post('/api/register', { name, email, password });
      // console.log("Register response:", response.data);
      alert(`Regjistrim me sukses për: ${name}`);
    } catch (err) {
      alert('Regjistrimi dështoi!');
    }
  };

  return (
    <form onSubmit={handleRegister} className="dashboard-container">
      <h2>Regjistrohu si përdorues</h2>
      <input
        type="text"
        placeholder="Emri i plotë"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button type="submit">Regjistrohu</button>
    </form>
  );
}

export default Register;
