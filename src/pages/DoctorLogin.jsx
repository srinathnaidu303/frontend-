import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import "../App.css";

const DoctorLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await loginUser(credentials);
            const user = response.data;

            // Check if the role is DOCTOR
            if (user.role !== "DOCTOR") {
                setError("Access denied. This portal is for Medical Staff only.");
                return;
            }

            localStorage.setItem("user", JSON.stringify(user));
            window.dispatchEvent(new Event("auth-change"));
            
            // Redirect to doctor dashboard
            navigate("/doctor-dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <div className="form-container" style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("/doctors-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '40px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#fff' }}>Medical Staff Login</h2>
                
                {error && <p className="error" style={{ textAlign: 'center', background: 'rgba(248, 113, 113, 0.2)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
                
                <form onSubmit={handleSubmit} className="centered-form">
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Institutional Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                            placeholder="doctor@hms.com"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Security Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}>
                        Enter Portal
                    </button>
                </form>
                
                <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#ccc' }}>
                    Are you a patient? <Link to="/login" style={{ color: '#4ade80' }}>User Login</Link>
                </p>
            </div>
        </div>
    );
};

export default DoctorLogin;
