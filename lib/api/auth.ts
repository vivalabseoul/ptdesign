import { supabase } from '../supabase'

export interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'customer' | 'expert'
  subscription_status?: 'active' | 'inactive' | 'cancelled'
  subscription_plan?: 'free' | 'basic' | 'pro' | 'enterprise'
  created_at?: string
  updated_at?: string
}

/**
 * 이메일/비밀번호 로그인
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

/**
 * 이메일/비밀번호 회원가입
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      // 개발/테스트 중에는 이메일 인증 자동 확인
      // 운영 환경에서는 Supabase Dashboard에서 설정 필요
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    }
  })
  
  if (error) throw error
  
  // users 테이블에 프로필 생성
  if (data.user) {
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      email,
      role: 'customer',
      subscription_status: 'inactive',
      subscription_plan: 'free',
    })
    
    // 프로필 생성 실패는 무시 (이미 존재할 수 있음)
    if (profileError) {
      console.warn('Profile creation warning:', profileError)
    }
  }
  
  return data
}

/**
 * 구글 로그인
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) throw error
  return data
}

/**
 * 카카오 로그인
 */
export async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) throw error
  return data
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

  // 소셜 로그인은 users 테이블 없이도 작동
  // 필요시 users 테이블에서 추가 정보 가져오기
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // 프로필이 없으면 기본 정보 반환
  if (!profile) {
    return {
      id: session.user.id,
      email: session.user.email!,
      role: 'customer',
      subscription_status: 'inactive',
      subscription_plan: 'free',
    }
  }

  return profile as UserProfile
}

