'use client';

import { createContext, useContext, useState } from 'react';
import { httpClient } from '../utils/HttpClient';
import { useEffect } from 'react';

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
  profileData?: any; // Optional property for profile data
  fetchProfile?: () => Promise<void>; // Optional method to fetch profile data
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => { },
  loading: false,
  userData: null,
  setUserData: () => { },
  setLoading: () => { },
  profileData: null,
  fetchProfile: async () => { },
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

  const [profileData, setProfileData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('profileData');
      return savedProfile ? JSON.parse(savedProfile) : null;
    }
    return null;
  });

  const fetchProfile = async () => {
    if (!userData?.UserId) return;

    if (profileData) return;

    try {
      const response = await httpClient(`/api/v1/sp/users/:id/profile`, {
        method: 'GET',
        pathParams: { id: userData.UserId },
      })

      const Data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(Data));
      } else {
        setProfileData(Data);
        localStorage.setItem('profileData', JSON.stringify(Data.results));
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  useEffect(() => {
    if (isAuthenticated && userData?.UserId && !profileData) {
      fetchProfile();
    }
  }, [isAuthenticated, userData?.UserId]);

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
      localStorage.setItem('is_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('is_authenticated');
      localStorage.removeItem('profileData');
      setIsAuthenticated(false);
      setProfileData(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, userData, setUserData, setLoading, profileData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);