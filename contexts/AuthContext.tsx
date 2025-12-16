import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../lib/api/auth';
import type { UserProfile } from '../lib/api/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  appUser: UserProfile | null;
  // Aliases for compatibility
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithKakao: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
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
      console.log('[AuthContext DEBUG] initializeAuth 시작');
      try {
        const currentUser = await authApi.getCurrentUser();
        console.log('[AuthContext DEBUG] getCurrentUser 결과:', currentUser);
        if (currentUser) {
          console.log('[AuthContext DEBUG] 사용자 설정 - role:', currentUser.role);
          setUser(currentUser);
        } else {
          console.log('[AuthContext DEBUG] 사용자 없음');
        }
      } catch (error) {
        console.error('[AuthContext DEBUG] 인증 초기화 실패:', error);
      } finally {
        console.log('[AuthContext DEBUG] 로딩 완료');
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

  // 이메일 로그인
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { user: authUser } = await authApi.signInWithEmail(email, password);
      if (authUser) {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('이메일 로그인 실패:', error);
      throw error;
    }
  };

  // 이메일 회원가입
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    console.log('[AuthContext DEBUG] signUpWithEmail 호출 - email:', email);
    try {
      const data = await authApi.signUpWithEmail(email, password, name);
      console.log('[AuthContext DEBUG] signUpWithEmail 성공 - data.user:', data.user);
      // 회원가입 후 자동 로그인
      if (data.user) {
        console.log('[AuthContext DEBUG] 회원가입 후 getCurrentUser 호출');
        const currentUser = await authApi.getCurrentUser();
        console.log('[AuthContext DEBUG] 회원가입 후 currentUser:', currentUser);
        if (currentUser) {
          console.log('[AuthContext DEBUG] 회원가입 후 사용자 설정 - role:', currentUser.role);
        }
        setUser(currentUser);
      } else {
        console.warn('[AuthContext DEBUG] data.user가 없음');
      }
    } catch (error) {
      console.error('[AuthContext DEBUG] 이메일 회원가입 실패:', error);
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
    signInWithEmail,
    signUpWithEmail,
    logout,
    // Aliases and Helpers
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    appUser: user,
    // Method aliases for compatibility
    login: signInWithEmail,
    signup: signUpWithEmail,
    signIn: signInWithEmail,
    signUp: signUpWithEmail,
    signOut: logout,
    openAuthModal: onOpenAuthModal || (() => {}),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

