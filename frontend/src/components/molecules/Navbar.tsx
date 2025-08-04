import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../atoms/Button';
// import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<Omit<NavbarProps, 'onLogout'>> = ({ isAuthenticated }) => {
  const location = useLocation();
  /*
  const { user } = useAuth();

  // Vérification du rôle admin
  const isAdmin =
    user?.email === 'admin@nutrition.app' ||
    user?.email?.includes('admin') ||
    user?.name?.toLowerCase().includes('admin') ||
    user?.roles?.includes('ROLE_ADMIN');
  */

  return (
    <nav className="flex items-center justify-end w-full h-[50px] gap-8">
      <Button
        to="/calculator"
        variant="simple"
        className={location.pathname === '/calculator' ? 'active' : ''}
      >
        Calculateur
      </Button>
      {isAuthenticated ? (
        <>
          <Button
            to="/dashboard"
            variant="simple"
            className={location.pathname.startsWith('/dashboard') ? 'active' : ''}
          >
            Dashboard
          </Button>
          <Button
            to="/foods"
            variant="simple"
            className={
              location.pathname.startsWith('/foods') &&
              !location.pathname.includes('/propose') &&
              !location.pathname.includes('/my-proposals')
                ? 'active'
                : ''
            }
          >
            Aliments
          </Button>
          <Button
            to="/foods/propose"
            variant="simple"
            className={location.pathname === '/foods/propose' ? 'active' : ''}
          >
            Proposer
          </Button>
          <Button
            to="/calendar"
            variant="simple"
            className={location.pathname === '/calendar' ? 'active' : ''}
          >
            Calendrier
          </Button>
          {/* <Link to="/profile" className={linkBase}>Profil</Link> */}
        </>
      ) : (
        <></>
      )}
    </nav>
  );
};

export default Navbar;
