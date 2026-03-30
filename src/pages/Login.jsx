import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../App.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.dispatchEvent(new Event('auth-change'));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="form-container">
            <h2>User Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="centered-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
