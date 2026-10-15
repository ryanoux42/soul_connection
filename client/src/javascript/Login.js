import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

function Login({ setUserId, setIsCoach, setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setError('');
    e.preventDefault();
    const loginData = { email, password };

    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      if (response.data.user_id) {
        setToken(response.data.token);
        setUserId(response.data.user_id);
        setIsCoach(response.data.is_coach);
        navigate('/home');
      } else {
        console.error('No user_id returned from the server');
      }
    } catch (error) {
      setTimeout(() => {
        setError('Failed to login');
        console.error('Failed to login:', error);
      }, 1000);
    }
  };

  return (
    <div className="login-container">
      <img src='logo.svg' alt='Logo'></img>
      <h1>Connection</h1>
      {error && <div className='error-box'>Login attempt has failed</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => (setEmail(e.target.value), setError(''))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => (setPassword(e.target.value), setError(''))}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
