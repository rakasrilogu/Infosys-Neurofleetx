// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

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
// AUTH ENDPOINTS  ✅ SIGNUP + LOGIN FIX
// ----------------------------------------------------
export const signup = async (email, password) => {
  return api.post("/auth/signup", {
    email,
    password,
  });
};

export const login = async (email, password) => {
  return api.post("/auth/login", {
    email,
    password,
  });
};

// ----------------------------------------------------
// VEHICLE ENDPOINTS
// ----------------------------------------------------
api.getVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};

api.getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

api.updateVehicleLocation = async (id, lat, lng) => {
  const response = await api.put(`/vehicles/${id}/location`, null, {
    params: { lat, lng },
  });
  return response.data;
};

api.updateVehicleStatus = async (id, status) => {
  const response = await api.put(`/vehicles/${id}/status`, null, {
    params: { status },
  });
  return response.data;
};

// ----------------------------------------------------
// BOOKING ENDPOINTS
// ----------------------------------------------------
api.createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

api.getAvailableDrivers = async (customerPhone) => {
  const response = await api.get("/bookings/availableDrivers", {
    params: { customerPhone },
  });
  return response.data;
};

api.getRecentBookings = async () => {
  const response = await api.get("/bookings/recent");
  return response.data;
};

api.getUserBookings = async (phone) => {
  const response = await api.get(`/bookings/user/${phone}`);
  return response.data;
};

// ----------------------------------------------------
// HEALTH CHECK ENDPOINTS
// ----------------------------------------------------
api.searchVehicles = async (query) => {
  const response = await api.get("/vehicles/search", {
    params: { query },
  });
  return response.data;
};

api.getVehicleByName = async (name) => {
  const response = await api.get(`/vehicles/name/${name}`);
  return response.data;
};

// ----------------------------------------------------
// ROUTE OPTIMIZATION ENDPOINTS
// ----------------------------------------------------
api.optimizeRoute = async (routeRequest) => {
  const response = await api.post("/routes/optimize", routeRequest);
  return response.data;
};

// ----------------------------------------------------
// NOTIFICATIONS / ALERTS ENDPOINTS
// ----------------------------------------------------
//api.getAlerts = async () => {
  //const response = await api.get("/alerts");
 // return response.data;
//};

// ----------------------------------------------------
// GEOCODING ENDPOINTS
// ----------------------------------------------------
api.geocode = async (address) => {
  const response = await api.get(
    `/geocode?address=${encodeURIComponent(address)}`
  );
  return response.data;
};

export default api;
