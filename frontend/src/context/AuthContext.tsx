import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
}

const AuthContext = createContext<AuthContextType>({ user: { uid: 'test-user', email: 'test@example.com' } });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: { uid: 'test-user', email: 'test@example.com' } }}>
      {children}
    </AuthContext.Provider>
  );
};
