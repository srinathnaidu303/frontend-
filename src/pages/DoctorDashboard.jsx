import React, { useState, useEffect } from "react";
import { getDoctorById, getDoctorAppointments, updateDoctorAvailability } from "../services/api";

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDoctorData = async () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                setError("You must be logged in as a doctor.");
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            if (user.role !== "DOCTOR" || !user.doctorId) {
                setError("Access denied. Dedicated portal for medical staff.");
                setLoading(false);
                return;
            }

            try {
                const [docRes, apptRes] = await Promise.all([
                    getDoctorById(user.doctorId),
                    getDoctorAppointments(user.doctorId)
                ]);
                setDoctor(docRes.data);
                setAppointments(apptRes.data);
            } catch (err) {
                console.error("Failed to fetch doctor dashboard data:", err);
                setError("Failed to load dashboard. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, []);

    const toggleAvailability = async () => {
        if (!doctor) return;
        const newStatus = !doctor.available;
        try {
            await updateDoctorAvailability(doctor.id, newStatus);
            setDoctor({ ...doctor, available: newStatus });
        } catch (err) {
            alert("Failed to update status. Please try again.");
        }
    };

    if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: '100px', color: 'white' }}><h2>Initializing Secure Portal...</h2></div>;

    return (
        <div className="page-container" style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url("/doctors-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '80px 20px',
            color: '#f0f0f0',
            textAlign: 'center'
        }}>
            {error ? (
                <div style={{ background: 'rgba(248, 113, 113, 0.1)', padding: '40px', borderRadius: '16px', display: 'inline-block' }}>
                    <h2 style={{ color: '#f87171' }}>{error}</h2>
                    <a href="/doctor-login" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 'bold' }}>Go to Doctor Login</a>
                </div>
            ) : (
                <>
                    <h2 style={{ color: '#ffffff', fontSize: '2.5rem', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px', display: 'inline-block', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                        Welcome, Dr. {doctor?.name}
                    </h2>
                    
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '20px', 
                            background: 'rgba(255,255,255,0.1)', 
                            padding: '15px 30px', 
                            borderRadius: '50px',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>Status: 
                                <strong style={{ color: doctor?.available ? '#4ade80' : '#f87171', marginLeft: '10px' }}>
                                    {doctor?.available ? 'FREE / AVAILABLE' : 'BUSY / UNAVAILABLE'}
                                </strong>
                            </span>
                            <button 
                                onClick={toggleAvailability}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '25px',
                                    border: 'none',
                                    backgroundColor: doctor?.available ? '#f87171' : '#4ade80',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Mark as {doctor?.available ? 'Busy' : 'Free'}
                            </button>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '30px', opacity: 0.8 }}>Upcoming Patient Appointments</h3>
                    
                    {appointments.length === 0 ? (
                        <p style={{ color: '#ccc', fontSize: '1.2rem' }}>You have no booked appointments yet.</p>
                    ) : (
                        <div className="appointments-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            {appointments.map((appt) => (
                                <div key={appt.id} className="appointment-card" style={{ 
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '25px 30px', 
                                    borderRadius: '16px', 
                                    width: '100%', 
                                    maxWidth: '650px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)', 
                                    textAlign: 'left',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.6rem' }}>Patient: {appt.userName}</h3>
                                        <p style={{ margin: '5px 0', opacity: 0.8 }}>Date: <strong>{new Date(appt.appointmentDate).toLocaleDateString()}</strong></p>
                                        <p style={{ margin: '5px 0', opacity: 0.8 }}>Time: <strong>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                                    </div>
                                    <span style={{ 
                                        padding: '8px 16px', borderRadius: '20px', 
                                        background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', 
                                        fontWeight: 'bold', border: '1px solid #4ade80'
                                    }}>
                                        {appt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DoctorDashboard;
