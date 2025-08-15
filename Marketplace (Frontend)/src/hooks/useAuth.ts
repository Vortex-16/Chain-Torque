import { useContext, createContext } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

interface AuthContextType {
  user: ReturnType<typeof useUser>['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
