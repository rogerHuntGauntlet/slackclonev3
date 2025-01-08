import { createContext, useContext, ReactNode, useState } from 'react'

interface Profile {
  name?: string;
  email?: string;
  status?: 'online' | 'away' | 'offline';
}

interface AuthContextType {
  user: { 
    id: string; 
    email: string;
    name?: string;
    status?: 'online' | 'away' | 'offline';
  } | null;
  updateUser: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null,
  updateUser: () => {} 
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null)

  const updateUser = (profile: Profile) => {
    if (user) {
      setUser({
        ...user,
        name: profile.name,
        status: profile.status
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
} 