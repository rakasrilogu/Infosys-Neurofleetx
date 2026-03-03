import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 

/* ===============================
    USER PAGES
================================= */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./Layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import LiveTracking from "./pages/LiveTracking";
import RouteOptimization from "./pages/RouteOptimization";
import BookingPage from "./pages/BookingPage";
import HealthCheckPage from "./pages/HealthCheckPage";

/* ===============================
    ADMIN PAGES
================================= */
import AdminDashboard from "./pages/AdminDashboard";

/* ===============================
    AUTH HELPERS
================================= */
const ProtectedRoute = ({ children, isAuthenticated, loading, requiredRole }) => {
  const userRole = localStorage.getItem("role");

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white font-mono">NEURO-SYNCING...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === "ADMIN" ? "/admin-dashboard" : "/"} replace />;
  }

  return children;
};

const AuthRedirect = ({ children, isAuthenticated, loading }) => {
  if (loading) return null;
  if (isAuthenticated) {
    const role = localStorage.getItem("role");
    return <Navigate to={role === "ADMIN" ? "/admin-dashboard" : "/"} replace />;
  }
  return children;
};

/* ===============================
    MAIN APP
================================= */
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!(token && role));
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #1e293b'
          },
        }}
      />
      
      {/* AiListener removed from here */}

      <Routes>
        <Route 
          path="/login" 
          element={
            <AuthRedirect isAuthenticated={isAuthenticated} loading={loading}>
              <Login setIsAuthenticated={setIsAuthenticated} />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <AuthRedirect isAuthenticated={isAuthenticated} loading={loading}>
              <Signup />
            </AuthRedirect>
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER AREA */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <DashboardLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="live-tracking" element={<LiveTracking />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="route-optimization" element={<RouteOptimization />} />
          <Route path="health-check" element={<HealthCheckPage />} />
        </Route>

        {/* ADMIN AREA */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading} requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;