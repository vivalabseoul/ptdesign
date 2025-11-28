# Supabase 데이터베이스 설정 가이드

## 📊 필요한 테이블 생성

### 1. users 테이블

사용자 정보 및 역할을 저장하는 테이블입니다.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 정책 생성
-- 사용자는 자신의 정보만 조회 가능
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 정보만 수정 가능
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 관리자는 모든 사용자 정보 조회 가능
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. analyses 테이블

분석 기록을 저장하는 테이블입니다.

```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  site_address TEXT,
  analysis_date TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_contact TEXT NOT NULL,
  issues JSONB NOT NULL,
  score JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);

-- RLS 활성화
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- 정책 생성
-- 사용자는 자신의 분석 기록만 조회 가능
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 분석 기록만 생성 가능
CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 관리자는 모든 분석 기록 조회 가능
CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. payments 테이블 (선택사항)

결제 기록을 저장하는 테이블입니다.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'basic', 'pro', 'enterprise')),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_session_id);

-- RLS 활성화
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 정책 생성
-- 사용자는 자신의 결제 기록만 조회 가능
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 결제 기록만 생성 가능
CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 관리자는 모든 결제 기록 조회 가능
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🔧 함수 생성

### 사용자 프로필 자동 생성 함수

회원가입 시 자동으로 사용자 프로필을 생성하는 함수입니다.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔐 인증 설정

### 1. Supabase Dashboard에서 설정

1. **Authentication > Providers**에서 Email 설정 활성화
2. **Authentication > URL Configuration**에서 리다이렉트 URL 설정:
   - Site URL: `http://localhost:3000` (개발)
   - Redirect URLs: 
     - `http://localhost:3000/**`
     - `https://your-domain.com/**` (프로덕션)

### 2. 환경 변수 설정 (선택사항)

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://nbyihpfzzkluqfwexsvh.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

## 🎯 관리자 계정 생성

### 방법 1: SQL 직접 실행

```sql
-- 먼저 auth.users에 사용자 생성 (Supabase Dashboard에서)
-- 그 다음 users 테이블에 관리자 권한 부여
UPDATE users
SET role = 'admin'
WHERE email = 'admin@protouch.design';
```

### 방법 2: Supabase Dashboard에서

1. Authentication > Users에서 관리자 계정 생성
2. Database > Table Editor에서 `users` 테이블 찾기
3. 해당 사용자의 `role`을 `admin`으로 변경

## 📝 테이블 구조 확인

### users 테이블 구조
- `id` (UUID): 사용자 ID (auth.users와 연결)
- `email` (TEXT): 이메일 주소
- `role` (TEXT): 사용자 역할 ('admin', 'user')
- `subscription_status` (TEXT): 구독 상태 ('active', 'inactive', 'cancelled')
- `subscription_plan` (TEXT): 구독 플랜 ('free', 'basic', 'pro', 'enterprise')
- `created_at` (TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP): 수정 일시

### analyses 테이블 구조
- `id` (UUID): 분석 기록 ID
- `user_id` (UUID): 사용자 ID (users 테이블 참조)
- `url` (TEXT): 분석 대상 URL
- `site_name` (TEXT): 사이트 이름
- `site_address` (TEXT): 사이트 주소 (선택)
- `analysis_date` (TEXT): 분석 일자
- `author_name` (TEXT): 작성자 이름
- `author_contact` (TEXT): 작성자 연락처
- `issues` (JSONB): 이슈 목록
- `score` (JSONB): 점수 정보
- `created_at` (TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP): 수정 일시

## 🔒 보안 정책 (RLS)

### Row Level Security (RLS) 정책

1. **users 테이블**
   - 사용자는 자신의 정보만 조회/수정 가능
   - 관리자는 모든 사용자 정보 조회 가능

2. **analyses 테이블**
   - 사용자는 자신의 분석 기록만 조회/생성 가능
   - 관리자는 모든 분석 기록 조회 가능

3. **payments 테이블**
   - 사용자는 자신의 결제 기록만 조회/생성 가능
   - 관리자는 모든 결제 기록 조회 가능

## 🧪 테스트

### 1. 사용자 생성 테스트

```sql
-- 회원가입 후 users 테이블에 자동으로 레코드가 생성되는지 확인
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

### 2. 분석 기록 저장 테스트

```sql
-- 분석 기록이 올바르게 저장되는지 확인
SELECT * FROM analyses ORDER BY created_at DESC LIMIT 5;
```

### 3. 권한 테스트

```sql
-- 일반 사용자가 다른 사용자의 분석 기록을 조회할 수 없는지 확인
-- (RLS 정책이 올바르게 작동하는지 확인)
```

## 📚 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Database 문서](https://supabase.com/docs/guides/database)

## ⚠️ 주의사항

1. **보안**: 프로덕션 환경에서는 반드시 RLS 정책을 활성화하세요.
2. **백업**: 정기적으로 데이터베이스 백업을 수행하세요.
3. **모니터링**: Supabase Dashboard에서 API 사용량과 오류를 모니터링하세요.
4. **환경 변수**: 민감한 정보는 환경 변수로 관리하세요.

