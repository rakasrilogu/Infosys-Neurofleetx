// src/services/api.js
import axios from "axios";

// ✅ NO localhost fallback in production
const API_URL = process.env.REACT_APP_API_URL;

// ----------------------------------------------------
// TOKEN HANDLING
// ----------------------------------------------------
const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------------------------------
// INTERCEPTORS
// ----------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------
// AUTH ENDPOINTS ✅ FIXED
// ----------------------------------------------------
export const signup = async (formData) => {
  return api.post("/auth/signup", formData);
};

export const login = async (email, password, role) => {
  return api.post("/auth/login", {
    email,
    password,
    role,
  });
};

// ----------------------------------------------------
// VEHICLE ENDPOINTS
// ----------------------------------------------------
api.getVehicles = async () => {
  const res = await api.get("/vehicles");
  return res.data;
};

api.getVehicleById = async (id) => {
  const res = await api.get(`/vehicles/${id}`);
  return res.data;
};

api.updateVehicleLocation = async (id, lat, lng) => {
  const res = await api.put(`/vehicles/${id}/location`, null, {
    params: { lat, lng },
  });
  return res.data;
};

api.updateVehicleStatus = async (id, status) => {
  const res = await api.put(`/vehicles/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};

// ----------------------------------------------------
// BOOKING ENDPOINTS
// ----------------------------------------------------
api.createBooking = async (data) => {
  const res = await api.post("/bookings", data);
  return res.data;
};

api.getAvailableDrivers = async (phone) => {
  const res = await api.get("/bookings/availableDrivers", {
    params: { customerPhone: phone },
  });
  return res.data;
};

api.getRecentBookings = async () => {
  const res = await api.get("/bookings/recent");
  return res.data;
};

api.getUserBookings = async (phone) => {
  const res = await api.get(`/bookings/user/${phone}`);
  return res.data;
};

// ----------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------
api.searchVehicles = async (query) => {
  const res = await api.get("/vehicles/search", {
    params: { query },
  });
  return res.data;
};

api.getVehicleByName = async (name) => {
  const res = await api.get(`/vehicles/name/${name}`);
  return res.data;
};

// ----------------------------------------------------
// ROUTE OPTIMIZATION
// ----------------------------------------------------
api.optimizeRoute = async (routeRequest) => {
  const res = await api.post("/routes/optimize", routeRequest);
  return res.data;
};

// ----------------------------------------------------
// GEOCODING
// ----------------------------------------------------
api.geocode = async (address) => {
  const res = await api.get(`/geocode`, {
    params: { address },
  });
  return res.data;
};

export default api;






