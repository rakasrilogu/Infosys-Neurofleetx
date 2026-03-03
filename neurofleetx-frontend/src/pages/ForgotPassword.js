import React, { useState } from "react";
import { Link } from "react-router-dom";
// You may not need the api import until you build the backend endpoint
// import api from "../services/api"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // NOTE: This endpoint does not exist on your backend yet.
      // When you create it, you can uncomment this line.
      // await api.post("/auth/forgot-password", { email });

      // For now, we'll simulate a success message after a short delay.
      setTimeout(() => {
        setMessage("If an account with that email exists, a password reset link has been sent.");
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center mb-2">
            <div className="flex space-x-2 mr-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">NeuroFleetX</h1>
        </div>
        <h2 className="text-lg font-semibold text-center text-gray-600 mb-2">Forgot Password</h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="text-green-500 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
