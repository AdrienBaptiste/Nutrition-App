import React, { useState } from 'react';
import AuthSection from '../components/organisms/AuthSection';
import MainLayout from '../components/templates/MainLayout';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [jwt, setJwt] = useState<string | null>(null);
  const navigate = useNavigate();

  // Callback après login réussi
  const handleLogin = (token: string) => {
    setJwt(token);
    localStorage.setItem('jwt', token);
    navigate('/dashboard');
    // Redirection ou affichage d'un message de succès possible ici
    // window.location.href = '/dashboard'; // Exemple de redirection
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
        <AuthSection onLogin={handleLogin} />
        {jwt && (
          <div className="mt-4 text-green-600 font-medium">Connexion réussie ! Token stocké.</div>
        )}
      </div>
    </MainLayout>
  );
};

export default AuthPage;
