import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../molecules/Navbar';
import Button from '../atoms/Button';
import HomeLink from '../molecules/HomeLink';

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
    <header className="bg-[#3C2937] text-white border-b-1 border-gray-400">
      <div className="container max-w-[1200px] mx-auto py-3 px-4 flex items-center justify-between gap-x-4">
        {/* Logo / Home */}
        <HomeLink />
        {/* Navigation principale */}
        <div className="flex-1 flex justify-center">
          <Navbar isAuthenticated={isAuthenticated} />
        </div>
        {/* Actions utilisateur */}
        <div className="flex-none flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Button onClick={handleLogout} variant="primary">
                Déconnexion
              </Button>
            </>
          ) : (
            <Button
              to="/auth"
              variant="primary"
              className={
                location.pathname === '/auth' ? 'bg-transparent border-2 border-[#67BB69]' : ''
              }
            >
              Connexion / Inscription
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
