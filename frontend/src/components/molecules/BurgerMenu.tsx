import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../atoms/Button';

interface BurgerMenuProps {
  isAuthenticated: boolean;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Vérification du rôle admin
  const isAdmin =
    user?.email === 'admin@nutrition.app' ||
    user?.email?.includes('admin') ||
    user?.name?.toLowerCase().includes('admin') ||
    user?.roles?.includes('ROLE_ADMIN');

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
        aria-label="Menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
            isOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}
        />
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#00000075] z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-60 bg-[#3C2937] z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Fermer"
          >
            ×
          </button>

          {/* Menu Items */}
          <div className="mt-12 space-y-4 flex flex-col">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                <Button
                  to="/dashboard"
                  variant="simple"
                  className={`w-full text-left ${
                    location.pathname === '/dashboard' ? 'active' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  Dashboard
                </Button>
                <Button
                  to="/calculator"
                  variant="simple"
                  className={`w-full text-left ${
                    location.pathname === '/calculator' ? 'active' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  Calculateur
                </Button>
                <Button
                  to="/calendar"
                  variant="simple"
                  className={`w-full text-left ${
                    location.pathname === '/calendar' ? 'active' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  Calendrier
                </Button>

                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <hr className="border-gray-600 my-4" />
                    <div className="text-gray-400 text-sm font-semibold mb-2">Administration</div>
                    <Button
                      to="/admin/food-moderation"
                      variant="simple"
                      className={`w-full text-left ${
                        location.pathname === '/admin/food-moderation' ? 'active' : ''
                      }`}
                      onClick={handleLinkClick}
                    >
                      Modération aliments
                    </Button>
                  </>
                )}

                {/* Logout */}
                <hr className="border-gray-600 my-4" />
                <Button onClick={handleLogout} variant="primary" className="w-full">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                {/* Public Navigation */}
                <Button
                  to="/"
                  variant="simple"
                  className={`w-full text-left ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  Accueil
                </Button>
                <Button
                  to="/calculator"
                  variant="simple"
                  className={`w-full text-left ${
                    location.pathname === '/calculator' ? 'active' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  Calculateur
                </Button>

                {/* Login */}
                <hr className="border-gray-600 my-4" />
                <Button
                  to="/auth"
                  variant="primary"
                  size="sm"
                  className="w-full text-center"
                  onClick={handleLinkClick}
                >
                  Connexion / Inscription
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;
