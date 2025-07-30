import React, { useEffect } from 'react';
import AuthSection from '../components/organisms/AuthSection';
import MainLayout from '../components/templates/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Callback après login réussi
  const handleLogin = (token: string) => {
    login(token); // Utilise le contexte global
    navigate('/dashboard');
  };

  return (
    <MainLayout>
      <div className="items-center justify-center bg-transparent">
        <AuthSection onLogin={handleLogin} />
        {isAuthenticated && (
          <div className="mt-4 text-green-600 font-medium">Connexion réussie ! Redirection...</div>
        )}
      </div>
    </MainLayout>
  );
};

export default AuthPage;
