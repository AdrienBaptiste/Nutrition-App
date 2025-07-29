import React, { useState } from 'react';
import LoginForm from '../molecules/LoginForm';
import RegisterForm from '../molecules/RegisterForm';

interface AuthSectionProps {
  onLogin?: (jwt: string) => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({ onLogin }) => {
  const [showRegister, setShowRegister] = useState(false);
  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[70vh]">
      {!showRegister ? (
        <div className="w-full">
          <LoginForm onLogin={onLogin} />
          <div className="text-center mt-4">
            <span>Pas encore de compte ? </span>
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setShowRegister(true)}
            >
              S'inscrire
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <RegisterForm onRegister={handleRegisterSuccess} />
          <div className="text-center mt-4">
            <span>Déjà inscrit ? </span>
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setShowRegister(false)}
            >
              Se connecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthSection;
