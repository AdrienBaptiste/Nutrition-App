import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem('jwt'));

  useEffect(() => {
    if (jwt) {
      localStorage.setItem('jwt', jwt);
    } else {
      localStorage.removeItem('jwt');
    }
  }, [jwt]);

  const login = (token: string) => setJwt(token);
  const logout = () => setJwt(null);

  const value: AuthContextType = {
    jwt,
    isAuthenticated: !!jwt,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
