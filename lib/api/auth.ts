import { supabase } from '../supabase'

export interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'user'
  subscription_status?: 'active' | 'inactive' | 'cancelled'
  subscription_plan?: 'free' | 'basic' | 'pro' | 'enterprise'
  created_at?: string
  updated_at?: string
}

export interface SignUpData {
  email: string
  password: string
  name?: string
  role?: 'admin' | 'user'
}

export interface SignInData {
  email: string
  password: string
}

/**
 * 회원가입
 */
export async function signUp(data: SignUpData): Promise<UserProfile> {
  // 1. Supabase Auth에 사용자 등록
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        role: data.role || 'user',
      },
    },
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('회원가입에 실패했습니다.')

  // 2. users 테이블에서 프로필 정보 가져오기
  // (트리거가 자동으로 프로필을 생성함)
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError) {
    // 프로필이 아직 생성되지 않았을 수 있으므로 재시도
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { data: retryProfile, error: retryError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    if (retryError) throw retryError
    return retryProfile as UserProfile
  }

  return profile as UserProfile
}

/**
 * 로그인
 */
export async function signIn(data: SignInData): Promise<UserProfile> {
  // 1. Supabase Auth로 로그인
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('로그인에 실패했습니다.')

  // 2. users 테이블에서 프로필 정보 가져오기
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError) throw profileError
  if (!profile) throw new Error('사용자 프로필을 찾을 수 없습니다.')

  return profile as UserProfile
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * 현재 세션 확인
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return profile as UserProfile | null
}

/**
 * 비밀번호 재설정 이메일 전송
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) throw error
}

/**
 * 비밀번호 업데이트
 */
export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) throw error
}
