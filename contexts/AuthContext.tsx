import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../lib/api/auth';
import { getAuthErrorMessage } from '../lib/api/errors';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'expert' | 'admin';
  subscriptionTier: 'free' | 'basic' | 'professional' | 'enterprise';
  freeAnalysisUsed: boolean;
  subscription_status?: 'active' | 'inactive' | 'cancelled';
  subscription_plan?: 'free' | 'basic' | 'pro' | 'enterprise';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
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

  // 로그인 - Supabase API
  const login = async (email: string, password: string) => {
    try {
      const apiUser = await authApi.signIn({ email, password });
      
      // Supabase users 테이블의 role을 UserProfile의 role 타입으로 매핑
      const profile: UserProfile = {
        id: apiUser.id,
        email: apiUser.email,
        name: email.split('@')[0],
        role: apiUser.role === 'admin' ? 'admin' : 'customer',
        subscriptionTier: apiUser.subscription_plan === 'pro' ? 'professional' : 
                        apiUser.subscription_plan === 'basic' ? 'basic' : 
                        apiUser.subscription_plan === 'enterprise' ? 'enterprise' : 'free',
        freeAnalysisUsed: false,
        subscription_status: apiUser.subscription_status,
        subscription_plan: apiUser.subscription_plan,
      };

      setUser(profile);
      return { ...profile, error: undefined };
    } catch (error) {
      console.error('로그인 실패:', error);
      const errorMessage = getAuthErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  // 회원가입 - Supabase API
  const signup = async (email: string, password: string, name: string, role: 'customer' | 'expert' | 'admin') => {
    try {
      // Supabase에 회원가입 (role은 'admin' 또는 'user'로 매핑)
      const apiUser = await authApi.signUp({
        email,
        password,
        name,
        role: role === 'admin' ? 'admin' : 'user',
      });

      const profile: UserProfile = {
        id: apiUser.id,
        email: apiUser.email,
        name,
        role,
        subscriptionTier: 'free',
        freeAnalysisUsed: false,
        // 전문가 회원가입은 승인 대기 상태로 설정
        approvalStatus: role === 'expert' ? 'pending' : 'approved',
        subscription_status: apiUser.subscription_status,
        subscription_plan: apiUser.subscription_plan,
      };

      setUser(profile);
      return { ...profile, error: undefined };
    } catch (error) {
      console.error('회원가입 실패:', error);
      const errorMessage = getAuthErrorMessage(error);
      throw new Error(errorMessage);
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
