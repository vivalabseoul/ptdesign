/**
 * API 에러를 사용자 친화적인 메시지로 변환
 */
export function getAuthErrorMessage(error: any): string {
  const message = error?.message || ''

  // Supabase Auth 에러 메시지 매핑
  if (message.includes('User already registered')) {
    return '이미 가입된 이메일입니다.'
  }
  if (message.includes('Invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.'
  }
  if (message.includes('Email not confirmed')) {
    return '이메일 인증이 필요합니다. 이메일을 확인해주세요.'
  }
  if (message.includes('Password should be at least')) {
    return '비밀번호는 최소 6자 이상이어야 합니다.'
  }
  if (message.includes('Unable to validate email address')) {
    return '유효하지 않은 이메일 주소입니다.'
  }
  if (message.includes('Email rate limit exceeded')) {
    return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
  if (message.includes('Signup requires a valid password')) {
    return '유효한 비밀번호를 입력해주세요.'
  }

  // 기본 에러 메시지
  return error?.message || '오류가 발생했습니다. 다시 시도해주세요.'
}

/**
 * 네트워크 에러 확인
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('Network request failed') ||
    error?.name === 'TypeError'
  )
}
