import React, { useState, useEffect } from "react";
import { getDoctors, getDoctorAppointments } from "../services/api";

const DoctorDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllDoctors = async () => {
            try {
                const response = await getDoctors();
                if (response.data && response.data.length > 0) {
                    setDoctors(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
                setError("Failed to load doctors list.");
            }
        };
        fetchAllDoctors();
    }, []);

    useEffect(() => {
        if (!selectedDoctorId) {
            setAppointments([]);
            return;
        }

        const fetchDoctorAppointments = async () => {
            setLoading(true);
            try {
                const response = await getDoctorAppointments(selectedDoctorId);
                setAppointments(response.data);
            } catch (err) {
                console.error("Failed to fetch appointments:", err);
                setError("Failed to load appointments for the selected doctor.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorAppointments();
    }, [selectedDoctorId]);

    return (
        <div className="page-container" style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.8)), url("/doctors-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '80px 20px',
            color: '#f0f0f0',
            textAlign: 'center'
        }}>
            <h2 style={{ color: '#ffffff', fontSize: '2.5rem', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px', display: 'inline-block', marginBottom: '40px', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Doctor Dashboard</h2>
            
            <div style={{ marginBottom: '40px' }}>
                <label style={{ fontSize: '1.2rem', marginRight: '15px', fontWeight: 'bold' }}>Select Your Profile:</label>
                <select 
                    value={selectedDoctorId} 
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    style={{
                        padding: '10px 15px',
                        fontSize: '1.1rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#333',
                        minWidth: '250px'
                    }}
                >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.specialtyName})</option>
                    ))}
                </select>
            </div>

            {error && <p className="error" style={{ color: '#f87171', fontWeight: 'bold' }}>{error}</p>}
            {loading && <h3>Loading appointments...</h3>}
            
            {!loading && selectedDoctorId && appointments.length === 0 && !error && (
                <p style={{ color: '#ccc', fontSize: '1.2rem' }}>You have no booked appointments yet.</p>
            )}

            {!loading && appointments.length > 0 && (
                <div className="appointments-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
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
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.6)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)'; }}
                        >
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.6rem', color: '#ffffff' }}>Patient: {appt.userName}</h3>
                                <p style={{ margin: '5px 0', fontSize: '1.1rem', color: '#e0e0e0' }}>Date: <span style={{ fontWeight: 'bold', color: '#fff' }}>{new Date(appt.appointmentDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                                <p style={{ margin: '5px 0', fontSize: '1.1rem', color: '#e0e0e0' }}>Time: <span style={{ fontWeight: 'bold', color: '#fff' }}>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#e0e0e0' }}>Status</p>
                                <span style={{ 
                                    display: 'inline-block',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    background: appt.status === 'CONFIRMED' || appt.status === 'BOOKED' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                    color: appt.status === 'CONFIRMED' || appt.status === 'BOOKED' ? '#4ade80' : '#fbbf24',
                                    fontWeight: 'bold',
                                    border: `1px solid ${appt.status === 'CONFIRMED' || appt.status === 'BOOKED' ? '#4ade80' : '#fbbf24'}`
                                }}>
                                    {appt.status === 'CONFIRMED' || appt.status === 'BOOKED' ? '● ' : '○ '}{appt.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
