import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../App.css';

const Register = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(user);
            if (response.data && response.data.id) {
                localStorage.setItem('user', JSON.stringify(response.data));
                window.dispatchEvent(new Event('auth-change'));
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="form-container">
            <h2>User Registration</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="centered-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} minLength="6" required />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
