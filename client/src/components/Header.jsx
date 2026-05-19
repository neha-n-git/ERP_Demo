import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm z-10 border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Admin Portal</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{admin?.name || 'Administrator'}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
