// src/components/Layout.js

import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';
import { LayoutDashboard, Wallet, User, LogOut, Landmark } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = "flex items-center px-4 py-2.5 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200";
  const activeLinkClasses = "bg-gray-700 text-white";

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800 text-white flex-shrink-0">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <Landmark className="h-8 w-8 mr-2 text-blue-400" />
        <span className="text-2xl font-bold">Zenith</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/" end className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/budgets" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
          <Wallet className="h-5 w-5 mr-3" />
          Budgets
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
          <User className="h-5 w-5 mr-3" />
          Profile
        </NavLink>
      </nav>

      <div className="px-4 py-6 border-t border-gray-700">
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="ml-2 flex-shrink-0 p-2 rounded-lg hover:bg-gray-700" title="Logout">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};


const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      {/* This main area will scroll if the content is too long */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
        {/* The Outlet renders the correct page (like HomePage) only ONCE */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;