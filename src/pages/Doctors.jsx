import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../services/api";

const Doctors = () => {

    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {

        const fetchDoctors = async () => {

            try {

                const response = await getDoctors();

                if (response.data && response.data.length > 0) {
                    setDoctors(response.data);
                } else {
                    loadSampleDoctors();
                }

            } catch (error) {

                console.log("API failed, loading sample doctors");
                loadSampleDoctors();

            }

        };

        fetchDoctors();

    }, []);


    const loadSampleDoctors = () => {

        const sampleDoctors = [

            {
                id: 1,
                name: "John Smith",
                specialtyName: "Cardiology",
                available: true
            },

            {
                id: 2,
                name: "Emily Johnson",
                specialtyName: "Neurology",
                available: true
            },

            {
                id: 3,
                name: "Michael Brown",
                specialtyName: "Orthopedics",
                available: false
            },

            {
                id: 4,
                name: "Sarah Davis",
                specialtyName: "Dermatology",
                available: true
            },

            {
                id: 5,
                name: "David Wilson",
                specialtyName: "Pediatrics",
                available: true
            }

        ];

        setDoctors(sampleDoctors);

    };


    const handleBookAppointment = (doctorId) => {

        const userStr = localStorage.getItem("user");

        if (!userStr) {

            alert("Please login first");
            navigate("/login");
            return;

        }

        const selectedDoctor = doctors.find(d => d.id === doctorId);
        navigate("/book-appointment", { 
            state: { 
                doctorId, 
                doctorName: selectedDoctor?.name,
                specialtyName: selectedDoctor?.specialtyName
            } 
        });

    };


    return (
        <div className="page-container" style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url("/doctors-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '80px 20px',
            color: '#f0f0f0',
            textAlign: 'center'
        }}>
            <h2 style={{ color: '#ffffff', fontSize: '2.8rem', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px', display: 'inline-block', marginBottom: '50px', marginTop: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Our Doctors</h2>

            <div className="doctors-grid" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>

                {doctors.map((doc) => (
                    <div key={doc.id} className="doctor-card" style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '30px', 
                        borderRadius: '16px', 
                        width: '300px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)', 
                        textAlign: 'left',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'default',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.6)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)'; }}
                    >
                        <h3 style={{ marginTop: 0, fontSize: '1.6rem', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Dr. {doc.name}</h3>
                        <p style={{ fontSize: '1.1rem', color: '#e0e0e0', marginTop: '15px' }}>Specialty: <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{doc.specialtyName}</span></p>
                        <p style={{ 
                            ... (doc.available ? { color: '#4ade80' } : { color: '#f87171' }),
                            fontWeight: 'bold', marginTop: '15px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: doc.available ? '#4ade80' : '#f87171' }}></span>
                            {doc.available ? "Available Now" : "Currently Unavailable"}
                        </p>
                        {doc.available && (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2575fc', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s, transform 0.1s', fontSize: '1rem' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor='#1b5bbf'}
                                onMouseLeave={(e) => e.target.style.backgroundColor='#2575fc'}
                                onMouseDown={(e) => e.target.style.transform='scale(0.98)'}
                                onMouseUp={(e) => e.target.style.transform='scale(1)'}
                                onClick={() => handleBookAppointment(doc.id)}
                            >
                                Book Appointment
                            </button>
                        )}
                    </div>
                ))}

            </div>

        </div>

    );

};

export default Doctors;