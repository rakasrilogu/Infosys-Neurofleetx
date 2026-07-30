import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaSignOutAlt, FaRoad } from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admin-dashboard" },
    { name: "Road Network", icon: <FaRoad />, path: "/admin-road-network" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-800 text-2xl font-black text-red-500 italic tracking-tighter">
        NEUROFLEETX
      </div>
      <nav className="flex-1 mt-4 px-4">
        {menu.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-red-600 shadow-lg shadow-red-600/30 text-white"
                : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-semibold">{item.name}</span>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout}
          className="w-full p-3 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors duration-200">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
