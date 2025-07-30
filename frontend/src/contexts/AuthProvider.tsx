import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType, User } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem('jwt'));
  const [user, setUser] = useState<User | null>(null);

  // Récupérer le profil utilisateur quand on a un JWT
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (jwt) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // JWT invalide, déconnecter
            logout();
          }
        } catch {
          // Erreur réseau, déconnecter
          logout();
        }
      } else {
        setUser(null);
      }
    };

    fetchUserProfile();
  }, [jwt]);

  useEffect(() => {
    if (jwt) {
      localStorage.setItem('jwt', jwt);
    } else {
      localStorage.removeItem('jwt');
    }
  }, [jwt]);

  const login = (token: string) => setJwt(token);
  const logout = () => {
    setJwt(null);
    setUser(null);
  };

  const value: AuthContextType = {
    jwt,
    isAuthenticated: !!jwt,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
