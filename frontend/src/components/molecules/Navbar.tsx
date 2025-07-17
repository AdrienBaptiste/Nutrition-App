import React from 'react';
import { useLocation } from 'react-router-dom';
import AppLink from '../atoms/AppLink';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<Omit<NavbarProps, 'onLogout'>> = ({ isAuthenticated }) => {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-around w-full h-[100px] gap-8">
      <AppLink to="/calculator" active={location.pathname === '/calculator'}>
        Calculateur
      </AppLink>
      {isAuthenticated ? (
        <>
          <AppLink to="/dashboard" active={location.pathname.startsWith('/dashboard')}>
            Dashboard
          </AppLink>
          <AppLink to="/foods" active={location.pathname.startsWith('/foods')}>
            Aliments
          </AppLink>
          <AppLink to="/meals" active={location.pathname.startsWith('/meals')}>
            Repas
          </AppLink>
          {/* <Link to="/profile" className={linkBase}>Profil</Link> */}
        </>
      ) : (
        <>
          <AppLink to="/auth" active={location.pathname === '/auth'}>
            Connexion
          </AppLink>
          {/* <Link to="/register" className={linkBase}>Inscription</Link> */}
        </>
      )}
    </nav>
  );
};

export default Navbar;
