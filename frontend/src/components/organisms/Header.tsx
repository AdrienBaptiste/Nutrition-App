import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../molecules/Navbar';
import AppLink from '../atoms/AppLink';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-gray-600 text-white shadow border-b-1 border-gray-400">
      <div className="container mx-auto py-3 px-4 flex items-center justify-between gap-x-4">
        {/* Logo / Home */}
        <AppLink
          to="/"
          className="text-2xl font-extrabold tracking-tight text-white hover:text-blue-200 transition-colors duration-200"
        >
          Nutrition App
        </AppLink>
        {/* Navigation principale */}
        <div className="flex-1 flex justify-center">
          <Navbar isAuthenticated={isAuthenticated} />
        </div>
        {/* Déconnexion */}
        <div className="flex-none">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded bg-white text-blue-700 font-bold hover:bg-blue-100 border border-blue-200 transition"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
