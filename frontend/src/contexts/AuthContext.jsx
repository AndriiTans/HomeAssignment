import React, { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../utils/httpClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        token,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshAuthState = async () => {
    setIsLoading(true);
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
