import React, {useState} from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('/auth/login', {
                username,
                password,
                rememberMe
            });
            const token = res.data.token;
            const usernameToShow = res.data.username;
            const email = res.data.email;

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("username", usernameToShow);
            sessionStorage.setItem("email", email);

            login({ token, usernameToShow, email });

            // Redirect to main page
            navigate('/');
        } catch (err) {
            alert("Login failed");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="text" placeholder="Username or Email" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                Remember Me
            </label>
            <button type="submit">Login</button>

            <p>Don't have an account? <a href="/register">Register</a></p>

            <p><a href="/all-message">See all message without login</a> </p>

        </form>
    );
}
