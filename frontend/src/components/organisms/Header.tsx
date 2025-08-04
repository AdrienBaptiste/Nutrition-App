import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../molecules/Navbar';
import AppLink from '../atoms/AppLink';
import HomeLink from '../molecules/HomeLink';
import Button from '../atoms/Button';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  // Vérification du rôle admin
  const isAdmin =
    user?.email === 'admin@nutrition.app' ||
    user?.email?.includes('admin') ||
    user?.name?.toLowerCase().includes('admin') ||
    user?.roles?.includes('ROLE_ADMIN');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-transparent text-white border-b-1 border-gray-400">
      <div className="container mx-auto py-3 px-4 flex items-center justify-between gap-x-4">
        {/* Logo / Home */}
        <HomeLink />
        {/* Navigation principale */}
        <div className="flex-1 flex justify-center">
          <Navbar isAuthenticated={isAuthenticated} />
        </div>
        {/* Actions utilisateur */}
        <div className="flex-none flex items-center space-x-3">
          {isAuthenticated && (
            <>
              {/* Lien Admin - visible uniquement pour les admins */}
              {isAdmin && (
                <AppLink
                  to="/admin/food-moderation"
                  className="px-3 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition text-sm"
                >
                  Admin
                </AppLink>
              )}
              {/* <button
                onClick={handleLogout}
                className="px-3 py-2 rounded bg-white text-blue-700 font-bold hover:bg-blue-100 border border-blue-200 transition"
              >
                Déconnexion
              </button> */}
              <Button onClick={handleLogout} variant="primary">
                Déconnexion
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
