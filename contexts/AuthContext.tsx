import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'expert' | 'admin';
  subscriptionTier: 'free' | 'basic' | 'professional' | 'enterprise';
  freeAnalysisUsed: boolean;
  subscription_status?: 'active' | 'inactive' | 'cancelled';
  subscription_plan?: 'free' | 'basic' | 'pro';
}

interface AuthResult {
  error?: Error | { message: string };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile & AuthResult>;
  signup: (email: string, password: string, name: string, role: 'customer' | 'expert' | 'admin') => Promise<UserProfile & AuthResult>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  // Aliases and Helpers
  isAuthenticated: boolean;
  isAdmin: boolean;
  appUser: UserProfile | null;
  signIn: (email: string, password: string) => Promise<UserProfile & AuthResult>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'customer' | 'expert' | 'admin') => Promise<UserProfile & AuthResult>;
}

const LOCAL_USER_KEY = 'protouchdesign:authUser';
const isBrowser = typeof window !== 'undefined';

const persistUserToStorage = (profile: UserProfile) => {
  if (!isBrowser) return;
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
};

const clearStoredUser = () => {
  if (!isBrowser) return;
  localStorage.removeItem(LOCAL_USER_KEY);
};

const loadStoredUser = (): UserProfile | null => {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(LOCAL_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({} as UserProfile),
  signup: async () => ({} as UserProfile),
  logout: async () => {},
  openAuthModal: () => {},
  isAuthenticated: false,
  isAdmin: false,
  appUser: null,
  signIn: async () => ({} as UserProfile),
  signOut: async () => {},
  signUp: async () => ({} as UserProfile),
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
}

export function AuthProvider({ children, onOpenAuthModal }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 세션 체크 - 로컬 스토리지에서 복원
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = loadStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('인증 초기화 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 로그인 - 로컬 스토리지 기반
  const login = async (email: string, password: string) => {
    try {
      // TODO: 실제 인증 API 연동 필요
      const profile: UserProfile = {
        id: email,
        email,
        name: email.split('@')[0],
        role: 'customer',
        subscriptionTier: 'free',
        freeAnalysisUsed: false,
      };

      setUser(profile);
      persistUserToStorage(profile);
      return { ...profile, error: undefined };
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  // 회원가입 - 로컬 스토리지 기반
  const signup = async (email: string, password: string, name: string, role: 'customer' | 'expert' | 'admin') => {
    try {
      // TODO: 실제 회원가입 API 연동 필요
      const profile: UserProfile = {
        id: email,
        email,
        name,
        role,
        subscriptionTier: 'free',
        freeAnalysisUsed: false,
      };

      setUser(profile);
      persistUserToStorage(profile);
      
      return { ...profile, error: undefined };
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  };

  // 로그아웃
  const logout = async () => {
    setUser(null);
    clearStoredUser();
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    onOpenAuthModal(mode);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    openAuthModal,
    // Aliases and Helpers
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    appUser: user,
    signIn: login,
    signOut: logout,
    signUp: signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}