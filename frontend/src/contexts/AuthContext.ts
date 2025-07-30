import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  roles?: string[];
}

export interface AuthContextType {
  jwt: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
