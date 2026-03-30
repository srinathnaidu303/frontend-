import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { bookAppointment } from "../services/api";

const Appointment = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const doctorId = location.state?.doctorId;
    const doctorName = location.state?.doctorName;
    const specialtyName = location.state?.specialtyName;

    const [appointmentDate, setAppointmentDate] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        const userStr = localStorage.getItem("user");

        if (!userStr) {
            alert("Please login first");
            navigate("/login");
            return;
        }

    }, [navigate]);



    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setMessage("");

        try {

            const userStr = localStorage.getItem("user");

            if (!userStr) {
                navigate("/login");
                return;
            }

            const user = JSON.parse(userStr);

            const requestData = {

                userId: Number(user.id),
                doctorId: Number(doctorId),
                appointmentDate: `${appointmentDate}T00:00:00`

            };

            console.log("Sending appointment:", requestData);

            const response = await bookAppointment(requestData);

            console.log("Response:", response.data);

            setMessage("Appointment booked successfully!");

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err) {

            console.error("Backend error:", err);

            if (err.response) {
                setError(
                    err.response.data.message ||
                    JSON.stringify(err.response.data)
                );
            } else {
                setError("Server not responding");
            }

        }

    };



    return (

        <div className="form-container">

            <h2>Book Appointment</h2>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} className="centered-form">

                <div className="form-group">

                    <label>Doctor Name</label>

                    <input
                        type="text"
                        value={doctorName ? `Dr. ${doctorName} (${specialtyName})` : `ID: ${doctorId || ""}`}
                        readOnly
                        style={{ color: '#555', backgroundColor: '#f9f9f9' }}
                    />

                </div>


                <div className="form-group">

                    <label>Appointment Date</label>

                    <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                    />

                </div>


                <button type="submit" className="btn btn-primary">

                    Book Now

                </button>

            </form>

        </div>

    );

};

export default Appointment;