import React from 'react';
import { useLocation } from 'react-router-dom';
import AppLink from '../atoms/AppLink';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<Omit<NavbarProps, 'onLogout'>> = ({ isAuthenticated }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Vérification du rôle admin
  const isAdmin =
    user?.email === 'admin@nutrition.app' ||
    user?.email?.includes('admin') ||
    user?.name?.toLowerCase().includes('admin') ||
    user?.roles?.includes('ROLE_ADMIN');

  return (
    <nav className="flex items-center justify-around w-full h-[50px] gap-8">
      <AppLink to="/calculator" active={location.pathname === '/calculator'}>
        Calculateur
      </AppLink>
      {isAuthenticated ? (
        <>
          <AppLink
            to="/dashboard"
            active={location.pathname.startsWith('/dashboard')}
            variant="primary"
          >
            Dashboard
          </AppLink>
          <AppLink
            to="/foods"
            active={
              location.pathname.startsWith('/foods') &&
              !location.pathname.includes('/propose') &&
              !location.pathname.includes('/my-proposals')
            }
            variant="primary"
          >
            Aliments
          </AppLink>
          <AppLink
            to="/foods/propose"
            active={location.pathname === '/foods/propose'}
            variant="primary"
          >
            Proposer
          </AppLink>
          {/* Masquer "Mes propositions" pour les admins car leurs aliments sont auto-validés */}
          {!isAdmin && (
            <AppLink
              to="/foods/my-proposals"
              active={location.pathname === '/foods/my-proposals'}
              variant="primary"
            >
              Mes propositions
            </AppLink>
          )}
          <AppLink to="/meals" active={location.pathname.startsWith('/meals')} variant="primary">
            Repas
          </AppLink>
          <AppLink to="/calendar" active={location.pathname === '/calendar'} variant="primary">
            Calendrier
          </AppLink>
          {/* <Link to="/profile" className={linkBase}>Profil</Link> */}
        </>
      ) : (
        <>
          <AppLink to="/auth" active={location.pathname === '/auth'} variant="primary">
            Connexion
          </AppLink>
          {/* <Link to="/register" className={linkBase}>Inscription</Link> */}
        </>
      )}
    </nav>
  );
};

export default Navbar;
