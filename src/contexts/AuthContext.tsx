import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  balance: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const initialContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('moopaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    try {
      // In a real app, this would be an API call to validate credentials
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: '12345',
        name: 'John Doe',
        email,
        accountNumber: '202412345678',
        balance: 250000.00,
      };
      
      setUser(mockUser);
      localStorage.setItem('moopaUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    try {
      // In a real app, this would be an API call to register user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: '12345',
        name,
        email,
        accountNumber: '202412345678',
        balance: 10000.00,
      };
      
      setUser(mockUser);
      localStorage.setItem('moopaUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moopaUser');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        loading, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};