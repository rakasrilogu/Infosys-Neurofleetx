import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          role: activeTab // send active tab as role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userName", data.name);

        setIsAuthenticated(true);

        if (data.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/"); 
        }
      } else {
        setError(data.message || "Invalid Email or Password");
      }
    } catch (err) {
      setError("Server error. Is your backend running on port 8081?");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* TAB TOGGLE */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("USER")}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === "USER" ? "text-blue-600 border-b-4 border-blue-600 bg-blue-50" : "text-gray-400 bg-gray-50"
            }`}
          >
            USER LOGIN
          </button>
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === "ADMIN" ? "text-red-600 border-b-4 border-red-600 bg-red-50" : "text-gray-400 bg-gray-50"
            }`}
          >
            ADMIN LOGIN
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-black text-center text-gray-800 mb-6">
            NeuroFleetX {activeTab}
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-bold text-lg transition shadow-lg ${
                activeTab === "USER" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Login as {activeTab}
            </button>
          </form>

          <div className="mt-8 text-center border-t pt-6">
            {activeTab === "USER" ? (
              <>
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-600 font-extrabold hover:underline">
                    Create Account
                  </Link>
                </p>
                <Link to="/forgot-password" size="sm" className="text-xs text-gray-400 mt-2 block hover:text-gray-600">
                  Forgot Password?
                </Link>
              </>
            ) : (
              <p className="text-gray-400 text-xs italic">
                Authorized Access Only. Contact IT for password resets.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
