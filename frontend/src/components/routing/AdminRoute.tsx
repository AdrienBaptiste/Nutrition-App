import React from 'react';
import { Navigate } from 'react-router-dom';
import Title from '../atoms/Title';
import { useAuth } from '../../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Si l'utilisateur n'est pas encore chargé, on attend
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Vérification des permissions...</div>
      </div>
    );
  }

  // Vérification du rôle admin
  // Pour l'instant, on simule avec l'email ou le nom
  // Dans un vrai projet, il faudrait vérifier user.roles.includes('ROLE_ADMIN')
  const isAdmin = 
    user.email === 'admin@nutrition.app' || 
    user.email.includes('admin') ||
    user.name?.toLowerCase().includes('admin') ||
    user.roles?.includes('ROLE_ADMIN');

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Title level={1} className="text-red-600 mb-4">Accès refusé</Title>
          <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
