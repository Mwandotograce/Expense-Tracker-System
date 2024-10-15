import React, {useState} from "react";
import axiosInstance from "./axiosConfig";

function Login() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[message, setMessage] = useState('');

    async function handleLogin() {
        try {
            const response = await axiosInstance.post('/login', {
                username: username,
                password: password
            });

            setMessage('Login successful!');
            setUsername('');
            setPassword('');

        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || 'Login failed');
            } else {
                setMessage('An error occurred. Please try again.');
            }

        }
    }

    return (
        <div>
            <h1>Login</h1>

            <input
                type="text"
                placeholder="Input Username"
                value = {username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Input Password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>

            {message && <p>{message}</p>}

        </div>
    )






}
export default Login;