import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Doctors from '../pages/Doctors';
import Appointment from '../pages/Appointment';
import MyAppointments from '../pages/MyAppointments';
import DoctorDashboard from '../pages/DoctorDashboard';
import AIAgentWidget from '../components/AIAgentWidget';

const AppRoutes = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const handleAuthChange = () => {
            const upUser = localStorage.getItem('user');
            setUser(upUser ? JSON.parse(upUser) : null);
        };
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
        window.location.href = '/login';
    };

    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <h2>Hospital Management System</h2>
                    <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Link to="/">Home</Link>
                        <Link to="/doctors">Doctors</Link>
                        <Link to="/doctor-dashboard" style={{ color: '#2575fc', fontWeight: 'bold' }}>Dashboard</Link>
                        
                        {user ? (
                            <>
                                <Link to="/my-appointments" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' }}>
                                    <div style={{ backgroundColor: '#2575fc', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span>{user.name || 'User'}</span>
                                </Link>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/book-appointment" element={<Appointment />} />
                        <Route path="/my-appointments" element={<MyAppointments />} />
                        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <AIAgentWidget />
            </div>
        </Router>
    );
};

export default AppRoutes;
