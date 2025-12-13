import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경 변수가 없으면 경고만 출력 (개발 모드)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다.')
  console.warn('⚠️ .env 파일에 다음 변수를 추가하세요:')
  console.warn('   VITE_SUPABASE_URL=your-project-url')
  console.warn('   VITE_SUPABASE_ANON_KEY=your-anon-key')
}

// 더미 값으로 클라이언트 생성 (환경 변수가 없을 때)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
