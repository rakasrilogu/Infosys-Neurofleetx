import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="w-64 flex-shrink-0 bg-gray-900 flex flex-col">
        <Sidebar onLogout={onLogout} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100">

        {/* Top Header Bar - Slim */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-3">
            <div className="flex items-center justify-between">

              {/* LEFT: Title */}
              <div>
                <h1 className="text-lg font-bold text-gray-900">NeuroFleetX Dashboard</h1>
                <p className="text-xs text-gray-500">Fleet Management System</p>
              </div>

              {/* RIGHT: Logout Only */}
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>

            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 px-8 py-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;