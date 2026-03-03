import React from 'react';

const TopBar = ({ onLogout }) => {
  return (
    <header className="ml-52 bg-white border-b border-gray-200 px-6 h-16 sticky top-0 z-50 flex items-center justify-between shadow-sm">
      
      {/* LEFT: Title */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">NeuroFleetX Dashboard</h1>
        <p className="text-xs text-gray-400">Fleet Management System</p>
      </div>

      {/* RIGHT: Logout Only */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
      >
        🔴 Logout
      </button>

    </header>
  );
};

export default TopBar;