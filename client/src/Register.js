import React, { useState } from 'react';
import axiosInstance from './axiosConfig';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')

  async function handleRegister() {
    try {
      const response = await axiosInstance.post('/register', {
        username: username,
        password: password
      });

      setMessage('User registered successfully!');
      setUsername('');
      setPassword('');
      
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Registration failed');
      } else {
        setMessage('An error occurred. Please try again.');
      }
      }
    }
    
  return (
    <div>
      <h1>Register User </h1>
      <input
        type = "text"
        placeholder = "Input Username"
        value = {username}
        onChange = {(e) => setUsername(e.target.value)} 
      />

      <input
        type = "password"
        placeholder = "Input Password"
        value = {password}
        onChange = {(e) => setPassword(e.target.value)}  
      />

      <button onClick={handleRegister}>Register</button>

      {message && <p>{message}</p>}

    </div>
  );
}

export default Register;