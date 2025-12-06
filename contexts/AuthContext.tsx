import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, USE_SUPABASE } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

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
  supabaseUser: User | null;
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

type MockUserRecord = UserProfile & { password: string };

const LOCAL_USER_KEY = 'protouchdesign:authUser';
const CUSTOM_USERS_KEY = 'protouchdesign:customUsers';
const isBrowser = typeof window !== 'undefined';

const BUILT_IN_USERS: MockUserRecord[] = [
  {
    id: 'mock-test-account',
    email: 'test@protouch.com',
    name: '테스트계정',
    role: 'customer',
    subscriptionTier: 'free',
    freeAnalysisUsed: false,
    password: 'test1234',
  },
];

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `mock-${Date.now()}`;
};

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

const loadCustomUsers = (): MockUserRecord[] => {
  if (!isBrowser) return [];
  const raw = localStorage.getItem(CUSTOM_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MockUserRecord[];
  } catch {
    return [];
  }
};

const saveCustomUsers = (users: MockUserRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(users));
};

const getMockUserByEmail = (email: string): MockUserRecord | null => {
  const builtIn = BUILT_IN_USERS.find((user) => user.email === email);
  if (builtIn) return builtIn;
  const customUsers = loadCustomUsers();
  return customUsers.find((user) => user.email === email) ?? null;
};

const getMockUserById = (userId: string): UserProfile | null => {
  const builtIn = BUILT_IN_USERS.find((user) => user.id === userId);
  if (builtIn) {
    const { password, ...profile } = builtIn;
    return profile;
  }
  const customUsers = loadCustomUsers();
  const match = customUsers.find((user) => user.id === userId);
  if (!match) return null;
  const { password, ...profile } = match;
  return profile;
};

const authenticateMockUser = (email: string, password: string): UserProfile | null => {
  const user = getMockUserByEmail(email);
  if (user && user.password === password) {
    const { password: _password, ...profile } = user;
    return profile;
  }
  return null;
};

const mockSignup = (email: string, password: string, name: string, role: 'customer' | 'expert' | 'admin'): UserProfile => {
  const existing = getMockUserByEmail(email);
  if (existing) {
    throw new Error('이미 등록된 이메일입니다.');
  }
  const profile: UserProfile = {
    id: generateId(),
    email,
    name,
    role,
    subscriptionTier: 'free',
    freeAnalysisUsed: false,
  };
  const customUsers = loadCustomUsers();
  customUsers.push({ ...profile, password });
  saveCustomUsers(customUsers);
  return profile;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
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
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const useSupabase = USE_SUPABASE;

  const hydrateFromStorage = () => {
    const storedUser = loadStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  };

  // 사용자 프로필 가져오기
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!useSupabase) {
      return getMockUserById(userId);
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile | null;
  };

  // 초기 세션 체크
  useEffect(() => {
    if (!useSupabase) {
      hydrateFromStorage();
      setLoading(false);
      return;
    }

    let isMounted = true;

    const initializeSupabase = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (session?.user) {
          setSupabaseUser(session.user);
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            persistUserToStorage(profile);
          }
        } else {
          hydrateFromStorage();
        }
      } catch (error) {
        console.error('Supabase 세션을 불러오지 못했습니다. 로컬 세션으로 대체합니다.', error);
        hydrateFromStorage();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeSupabase();

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setSupabaseUser(session.user);
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
          persistUserToStorage(profile);
        }
      } else {
        setSupabaseUser(null);
        
        // Mock User 세션 유지 로직
        // Supabase 세션이 없더라도 로컬에 Mock User가 저장되어 있다면 유지합니다.
        const stored = loadStoredUser();
        if (stored && stored.id.startsWith('mock-')) {
          setUser(stored);
        } else {
          setUser(null);
          hydrateFromStorage();
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [useSupabase]);

  // 로그인
  const login = async (email: string, password: string) => {
    let lastError: Error | null = null;

    if (useSupabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          const profile = await fetchUserProfile(data.user.id);

          if (!profile) {
            throw new Error('사용자 프로필을 찾을 수 없습니다. 관리자에게 문의하세요.');
          }

          setUser(profile);
          setSupabaseUser(data.user);
          persistUserToStorage(profile);
          return { ...profile, error: undefined };
        }
      } catch (error) {
        console.warn('Supabase 로그인에 실패했습니다. 로컬 테스트 계정으로 시도합니다.', error);
        lastError = error as Error;
      }
    }

    const mockProfile = authenticateMockUser(email, password);
    if (mockProfile) {
      setUser(mockProfile);
      setSupabaseUser(null);
      persistUserToStorage(mockProfile);
      return { ...mockProfile, error: undefined };
    }

    if (lastError) {
      throw lastError;
    }

    throw new Error('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
  };

  // 회원가입
  const signup = async (email: string, password: string, name: string, role: 'customer' | 'expert' | 'admin') => {
    if (useSupabase) {
      try {
        console.log('회원가입 시작:', { email, name, role });

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log('Auth 회원가입 결과:', { authData, authError });

        if (authError) {
          console.error('Auth 에러:', authError);
          throw authError;
        }
        if (!authData.user) {
          console.error('사용자 생성 실패: authData.user가 없음');
          throw new Error('User creation failed');
        }

        console.log('Auth 사용자 생성 성공:', authData.user.id);

        const profileData = {
          id: authData.user.id,
          email,
          name,
          role,
        };

        console.log('프로필 생성 시도:', profileData);

        const { error: profileError } = await supabase
          .from('users')
          .insert(profileData);

        console.log('프로필 생성 결과:', { profileError });

        if (profileError) {
          console.error('프로필 생성 에러:', profileError);
          throw profileError;
        }

        const profile: UserProfile = {
          id: authData.user.id,
          email,
          name,
          role,
          subscriptionTier: 'free',
          freeAnalysisUsed: false,
        };

        console.log('회원가입 완료:', profile);

        setUser(profile);
        setSupabaseUser(authData.user);
        persistUserToStorage(profile);
        return { ...profile, error: undefined };
      } catch (error) {
        console.error('회원가입 전체 에러:', error);
        throw error;
      }
    }

    const profile = mockSignup(email, password, name, role);
    setUser(profile);
    setSupabaseUser(null);
    persistUserToStorage(profile);
    return { ...profile, error: undefined };
  };

  // 로그아웃
  const logout = async () => {
    if (useSupabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }

    setUser(null);
    setSupabaseUser(null);
    clearStoredUser();
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    onOpenAuthModal(mode);
  };

  const value = {
    user,
    supabaseUser,
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