import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../lib/api/auth';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'expert' | 'admin';
  subscriptionTier: 'free' | 'basic' | 'professional' | 'enterprise';
  freeAnalysisUsed: boolean;
  subscription_status?: 'active' | 'inactive' | 'cancelled';
  subscription_plan?: 'free' | 'basic' | 'pro' | 'enterprise';
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  appUser: UserProfile | null;
  // Aliases for compatibility
  login: () => Promise<void>;
  signup: () => Promise<void>;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithKakao: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  appUser: null,
  // Aliases
  login: async () => {},
  signup: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  openAuthModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
}

export function AuthProvider({ children, onOpenAuthModal }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 세션 체크 - Supabase 세션에서 복원
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          // Supabase users 테이블의 role을 UserProfile의 role 타입으로 매핑
          const mappedUser: UserProfile = {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.email.split('@')[0], // 이름이 없으면 이메일에서 추출
            role: currentUser.role === 'admin' ? 'admin' : 'customer',
            subscriptionTier: currentUser.subscription_plan === 'pro' ? 'professional' : 
                            currentUser.subscription_plan === 'basic' ? 'basic' : 
                            currentUser.subscription_plan === 'enterprise' ? 'enterprise' : 'free',
            freeAnalysisUsed: false,
            subscription_status: currentUser.subscription_status,
            subscription_plan: currentUser.subscription_plan,
          };
          setUser(mappedUser);
        }
      } catch (error) {
        console.error('인증 초기화 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      await authApi.signInWithGoogle();
      // OAuth는 리다이렉트되므로 여기서는 아무것도 하지 않음
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      throw error;
    }
  };

  // 카카오 로그인
  const signInWithKakao = async () => {
    try {
      await authApi.signInWithKakao();
      // OAuth는 리다이렉트되므로 여기서는 아무것도 하지 않음
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      throw error;
    }
  };

  // 로그아웃 - Supabase API
  const logout = async () => {
    try {
      await authApi.signOut();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithKakao,
    logout,
    // Aliases and Helpers
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    appUser: user,
    // Method aliases for compatibility
    login: signInWithGoogle,
    signup: signInWithGoogle,
    signIn: signInWithGoogle,
    signUp: signInWithGoogle,
    signOut: logout,
    openAuthModal: onOpenAuthModal || (() => {}),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

