import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // Run: npm install react-icons

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" // Automatically defaults to USER
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8081/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // After successful signup, redirect to login page
        alert("Account created successfully! Redirecting to login...");
        navigate("/login");
      } else {
        const data = await response.text();
        setError(data || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please check if your backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-center text-white">
          <h2 className="text-3xl font-black tracking-tight">NeuroFleetX</h2>
          <p className="text-blue-100 text-sm mt-1 uppercase tracking-widest font-bold">Create Account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            
            {/* Full Name Input */}
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Full Name"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>

            {/* Password Input with Visibility Toggle */}
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 font-bold text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-black text-lg shadow-lg transform transition active:scale-95 ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 hover:shadow-blue-200"
              }`}
            >
              {isLoading ? "PROCCESSING..." : "SIGN UP NOW"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Already a member?{" "}
              <Link to="/login" className="text-blue-600 font-black hover:underline">
                LOG IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;