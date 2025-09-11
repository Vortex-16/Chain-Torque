import { useEffect, useState, createContext } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

interface AuthContextType {
  user: ReturnType<typeof useUser>['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
