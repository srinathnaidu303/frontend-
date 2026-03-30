import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";   // change port if backend runs on 8081

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});


// ================= AUTH =================

// Register user
export const registerUser = (userData) => {
    return api.post("/auth/register", userData);
};

// Login user
export const loginUser = (credentials) => {
    return api.post("/auth/login", credentials);
};


// ================= SPECIALTIES =================

// Get all specialties
export const getSpecialties = () => {
    return api.get("/specialties");
};


// ================= DOCTORS =================

// Get all doctors
export const getDoctors = () => {
    return api.get("/doctors");
};

// Get doctor by ID
export const getDoctorById = (id) => {
    return api.get(`/doctors/${id}`);
};


// ================= APPOINTMENTS =================

// Book appointment
export const bookAppointment = (appointmentData) => {
    return api.post("/appointments/book", appointmentData);
};

// Get appointments of a user
export const getUserAppointments = (userId) => {
    return api.get(`/appointments/user/${userId}`);
};

// Get appointments of a doctor
export const getDoctorAppointments = (doctorId) => {
    return api.get(`/appointments/doctor/${doctorId}`);
};

// Cancel appointment
export const cancelAppointment = (id) => {
    return api.delete(`/appointments/${id}`);
};


// Export axios instance
export default api;