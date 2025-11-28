# Supabase 데이터베이스 설정 - 단계별 가이드

## 🎯 현재 상태

데이터베이스 상태 확인 결과:
- ❌ `users` 테이블이 존재하지 않습니다
- ❌ `analyses` 테이블이 존재하지 않습니다
- ❌ `payments` 테이블이 존재하지 않습니다

**다음 단계를 따라 Supabase Dashboard에서 SQL을 실행하세요.**

## 🚀 빠른 실행 가이드 (3단계)

### 1단계: Supabase Dashboard 접속

1. **Supabase Dashboard 열기**
   - 브라우저에서 https://supabase.com/dashboard 접속
   - 로그인 (계정이 없으면 가입)

2. **프로젝트 선택**
   - 프로젝트 ID: `nbyihpfzzkluqfwexsvh`
   - 프로젝트 선택

### 2단계: SQL Editor에서 SQL 실행

1. **SQL Editor로 이동**
   - 왼쪽 메뉴에서 **Database** 클릭
   - **SQL Editor** 클릭
   - **New query** 버튼 클릭

2. **SQL 스크립트 복사 및 실행**
   - 아래 SQL 스크립트를 **전체 복사** (Ctrl+A, Ctrl+C)
   - SQL Editor에 **붙여넣기** (Ctrl+V)
   - **RUN** 버튼 클릭 (또는 Ctrl+Enter)

3. **결과 확인**
   - 모든 SQL 문이 성공적으로 실행되었는지 확인
   - 오류가 있으면 오류 메시지 확인

### 3단계: 설정 확인

1. **테이블 확인**
   - Database > Table Editor로 이동
   - 다음 테이블이 생성되었는지 확인:
     - ✅ `users`
     - ✅ `analyses`
     - ✅ `payments` (선택사항)

2. **RLS 정책 확인**
   - 각 테이블 클릭 > Policies 탭
   - 정책이 설정되었는지 확인

3. **로컬에서 확인**
   ```bash
   npm run check-db
   ```

## 📋 실행할 SQL 스크립트

아래 SQL 스크립트를 **전체 복사**하여 Supabase SQL Editor에서 실행하세요:

```sql
-- Pro Touch Design 데이터베이스 설정 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있을 경우)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- 정책 생성
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. analyses 테이블 생성
CREATE TABLE IF NOT EXISTS analyses (
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
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);

-- RLS 활성화
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있을 경우)
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON analyses;
DROP POLICY IF EXISTS "Admins can view all analyses" ON analyses;

-- 정책 생성
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. payments 테이블 생성 (선택사항)
CREATE TABLE IF NOT EXISTS payments (
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
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON payments(stripe_session_id);

-- RLS 활성화
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있을 경우)
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

-- 정책 생성
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. 사용자 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거 삭제 (있을 경우)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 트리거 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 완료 메시지
SELECT 'Database setup completed successfully!' AS message;
```

## ✅ 실행 후 확인

### 1. 로컬에서 확인

터미널에서 다음 명령어 실행:

```bash
npm run check-db
```

예상 결과:
- ✅ `users` 테이블이 존재합니다
- ✅ `analyses` 테이블이 존재합니다
- ✅ `payments` 테이블이 존재합니다 (선택사항)

### 2. Supabase Dashboard에서 확인

1. **Table Editor 확인**
   - Database > Table Editor로 이동
   - 테이블 목록에서 확인:
     - ✅ `users`
     - ✅ `analyses`
     - ✅ `payments` (선택사항)

2. **Policies 확인**
   - 각 테이블 클릭 > Policies 탭
   - 다음 정책이 있는지 확인:
     - `Users can view own profile` (users)
     - `Users can update own profile` (users)
     - `Admins can view all users` (users)
     - `Users can view own analyses` (analyses)
     - `Users can insert own analyses` (analyses)
     - `Admins can view all analyses` (analyses)

3. **Functions 확인**
   - Database > Functions로 이동
   - 다음 함수가 있는지 확인:
     - ✅ `handle_new_user()` - 사용자 프로필 자동 생성
     - ✅ `handle_updated_at()` - updated_at 자동 업데이트

4. **Triggers 확인**
   - Database > Triggers로 이동
   - 다음 트리거가 있는지 확인:
     - ✅ `on_auth_user_created` - auth.users에 사용자 생성 시 users 테이블에 프로필 생성
     - ✅ `update_users_updated_at` - users 테이블 업데이트 시 updated_at 업데이트
     - ✅ `update_analyses_updated_at` - analyses 테이블 업데이트 시 updated_at 업데이트
     - ✅ `update_payments_updated_at` - payments 테이블 업데이트 시 updated_at 업데이트

## 🔐 Authentication 설정

### 1. Email Provider 활성화

1. **Authentication > Providers로 이동**
2. **Email** provider 활성화
3. **Save** 클릭

### 2. Redirect URLs 설정

1. **Authentication > URL Configuration으로 이동**
2. **Site URL** 설정:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://your-domain.com`
3. **Redirect URLs** 추가:
   - `http://localhost:3000/**`
   - `https://your-domain.com/**`
4. **Save** 클릭

## 👤 관리자 계정 생성

### 방법 1: Supabase Dashboard에서

1. **Authentication > Users로 이동**
2. **Add user** 클릭
3. 이메일과 비밀번호 입력 (예: `admin@protouch.design`)
4. **Create user** 클릭
5. **Database > Table Editor > users**로 이동
6. 생성한 사용자의 `role`을 `admin`으로 변경

### 방법 2: SQL Editor에서

1. **Database > SQL Editor로 이동**
2. 다음 SQL 실행:

```sql
-- 먼저 Authentication > Users에서 관리자 계정 생성
-- 그 다음 다음 SQL 실행

UPDATE users
SET role = 'admin'
WHERE email = 'admin@protouch.design';
```

## 🧪 테스트

### 1. 회원가입 테스트

1. 개발 서버 실행: `npm run dev`
2. 회원가입 페이지 접속: `http://localhost:3000/signup`
3. 이메일과 비밀번호 입력
4. 회원가입 완료
5. Supabase Dashboard > Table Editor > users에서 레코드 생성 확인

### 2. 로그인 테스트

1. 로그인 페이지 접속: `http://localhost:3000/login`
2. 등록한 이메일과 비밀번호 입력
3. 로그인 완료
4. 대시보드로 리다이렉트 확인

### 3. 분석 기록 테스트

1. 로그인 후 분석 실행
2. 분석 결과 확인
3. Supabase Dashboard > Table Editor > analyses에서 레코드 생성 확인
4. 대시보드에서 분석 기록 확인

## 🐛 문제 해결

### SQL 실행 오류

**해결 방법:**
1. SQL Editor에서 오류 메시지 확인
2. 각 SQL 문을 개별적으로 실행
3. 오류가 있는 SQL 문 수정 후 재실행

### 테이블이 생성되지 않음

**해결 방법:**
1. SQL Editor에서 오류 메시지 확인
2. `CREATE TABLE IF NOT EXISTS` 문이 올바르게 실행되었는지 확인
3. Table Editor에서 테이블 존재 확인

### RLS 정책 오류

**해결 방법:**
1. Policies 탭에서 정책 확인
2. 정책이 올바르게 설정되었는지 확인
3. 필요시 정책 재생성

### 트리거 오류

**해결 방법:**
1. Functions 탭에서 함수 확인
2. Triggers 탭에서 트리거 확인
3. 필요시 함수 및 트리거 재생성

## 📚 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Supabase SQL Editor 가이드](https://supabase.com/docs/guides/database/tables)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Triggers 가이드](https://supabase.com/docs/guides/database/triggers)

## ⚠️ 주의사항

1. **프로덕션 환경**: RLS 정책을 반드시 활성화하세요.
2. **백업**: 데이터베이스 설정 전에 백업을 수행하세요.
3. **테스트**: 설정 후 반드시 테스트를 수행하세요.
4. **모니터링**: Supabase Dashboard에서 오류를 모니터링하세요.

## 🎉 완료!

설정이 완료되면 다음을 테스트하세요:

1. ✅ 회원가입 테스트
2. ✅ 로그인 테스트
3. ✅ 분석 기록 저장 테스트
4. ✅ 관리자 대시보드 테스트

문제가 있으면 `npm run check-db`를 실행하여 상태를 확인하세요.

