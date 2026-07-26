'use client';

import { createContext, useContext, useState } from 'react';

// 1. Definimos la estructura de los datos del usuario
interface UserData {
  UserId: string;
  Email: string;
  FullName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  loading: boolean;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  setLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => { },
  loading: false,
  userData: null,
  setUserData: () => { },
  setLoading: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('is_authenticated') === 'true' : false;
  });

  const [userData, setUserDataState] = useState<UserData | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('userData');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
      localStorage.setItem('is_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('is_authenticated');
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, userData, setUserData, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);