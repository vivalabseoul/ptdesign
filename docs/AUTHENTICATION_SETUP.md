# 인증 시스템 설정 가이드

## 📋 개요

이 프로젝트는 Supabase Auth를 사용하여 사용자 인증 및 권한 관리를 구현합니다.

## 🎯 주요 기능

1. **회원가입/로그인**: 이메일과 비밀번호 기반 인증
2. **사용자 역할 관리**: 관리자(admin)와 일반 사용자(user) 구분
3. **보호된 라우트**: 인증이 필요한 페이지 보호
4. **사용자별 데이터 관리**: 각 사용자의 분석 기록 관리
5. **결제 시스템 통합**: Stripe를 통한 결제 처리

## 🚀 설정 단계

### 1. Supabase 데이터베이스 설정

#### 1.1 users 테이블 생성

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

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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
```

#### 1.2 analyses 테이블 생성

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
```

#### 1.3 사용자 프로필 자동 생성 함수

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Supabase Authentication 설정

#### 2.1 Email Provider 활성화

1. Supabase Dashboard 접속
2. Authentication > Providers로 이동
3. Email provider 활성화
4. Email template 설정 (선택사항)

#### 2.2 Redirect URLs 설정

1. Authentication > URL Configuration으로 이동
2. Site URL 설정: `http://localhost:3000` (개발), `https://your-domain.com` (프로덕션)
3. Redirect URLs 추가:
   - `http://localhost:3000/**`
   - `https://your-domain.com/**`

### 3. 관리자 계정 생성

#### 방법 1: SQL 직접 실행

```sql
-- 1. Supabase Dashboard > Authentication > Users에서 관리자 계정 생성
-- 2. Database > SQL Editor에서 다음 쿼리 실행

UPDATE users
SET role = 'admin'
WHERE email = 'admin@protouch.design';
```

#### 방법 2: Supabase Dashboard에서

1. Authentication > Users에서 관리자 계정 생성
2. Database > Table Editor에서 `users` 테이블 찾기
3. 해당 사용자의 `role`을 `admin`으로 변경

## 🔐 인증 플로우

### 1. 회원가입 플로우

1. 사용자가 이메일과 비밀번호 입력
2. `signUp` 함수 호출
3. Supabase Auth에서 사용자 생성
4. 트리거가 자동으로 `users` 테이블에 프로필 생성
5. 로그인 상태로 전환
6. 대시보드로 리다이렉트

### 2. 로그인 플로우

1. 사용자가 이메일과 비밀번호 입력
2. `signIn` 함수 호출
3. Supabase Auth에서 인증 확인
4. 세션 생성 및 저장
5. 사용자 프로필 로드
6. 대시보드로 리다이렉트

### 3. 로그아웃 플로우

1. 사용자가 로그아웃 버튼 클릭
2. `signOut` 함수 호출
3. Supabase Auth에서 세션 삭제
4. 로컬 상태 초기화
5. 홈 페이지로 리다이렉트

## 🛡️ 보호된 라우트

### 1. 일반 사용자 보호

```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

- 로그인한 사용자만 접근 가능
- 미로그인 시 `/login`으로 리다이렉트

### 2. 관리자 보호

```tsx
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

- 관리자만 접근 가능
- 일반 사용자 시 `/dashboard`로 리다이렉트
- 미로그인 시 `/login`으로 리다이렉트

## 💳 결제 시스템 통합

### 1. Stripe 설정

#### 1.1 Stripe 계정 생성

1. [Stripe](https://stripe.com) 가입
2. Dashboard > Developers > API keys에서 키 확인
3. Publishable key와 Secret key 확인

#### 1.2 환경 변수 설정

`.env` 파일 생성:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### 1.3 Stripe Products 및 Prices 생성

1. Stripe Dashboard > Products에서 제품 생성
2. 각 플랜에 대한 Price ID 확인
3. `utils/payment/stripe.ts`에서 Price ID 업데이트

### 2. 결제 플로우

1. 사용자가 플랜 선택
2. `PaymentButton` 클릭
3. 로그인 확인 (미로그인 시 로그인 페이지로)
4. Stripe Checkout 세션 생성
5. Stripe 결제 페이지로 리다이렉트
6. 결제 완료 후 성공 페이지로 리다이렉트
7. 사용자 구독 상태 업데이트

### 3. 웹훅 설정 (선택사항)

결제 완료 후 자동으로 구독 상태를 업데이트하려면 Stripe 웹훅을 설정해야 합니다.

1. Stripe Dashboard > Developers > Webhooks
2. Endpoint URL 설정: `https://your-domain.com/api/webhooks/stripe`
3. Events 선택: `checkout.session.completed`, `payment_intent.succeeded`
4. Supabase Edge Function 또는 백엔드 API에서 웹훅 처리

## 📊 사용자 데이터 관리

### 1. 분석 기록 저장

```typescript
// 분석 완료 후 자동으로 저장
const { error } = await supabase
  .from('analyses')
  .insert([
    {
      user_id: user.id,
      url: result.url,
      site_name: result.siteName,
      // ... 기타 필드
    },
  ]);
```

### 2. 사용자별 분석 기록 조회

```typescript
// 사용자 자신의 분석 기록만 조회 (RLS 정책에 의해 자동 필터링)
const { data, error } = await supabase
  .from('analyses')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### 3. 관리자 전체 기록 조회

```typescript
// 관리자는 모든 분석 기록 조회 가능 (RLS 정책에 의해 허용)
const { data, error } = await supabase
  .from('analyses')
  .select('*')
  .order('created_at', { ascending: false });
```

## 🔒 보안 고려사항

### 1. Row Level Security (RLS)

- 모든 테이블에 RLS 활성화
- 사용자는 자신의 데이터만 접근 가능
- 관리자는 모든 데이터 접근 가능

### 2. 인증 토큰

- Supabase Auth에서 자동으로 JWT 토큰 관리
- 토큰은 자동으로 갱신됨
- 로컬 스토리지에 안전하게 저장

### 3. API 키 보안

- Supabase API 키는 클라이언트에 노출됨 (정상)
- 민감한 작업은 Supabase Edge Functions에서 처리
- Stripe Secret Key는 서버에서만 사용

## 🧪 테스트

### 1. 회원가입 테스트

1. `/signup` 페이지 접속
2. 이메일과 비밀번호 입력
3. 회원가입 완료
4. `users` 테이블에 레코드 생성 확인
5. 대시보드로 리다이렉트 확인

### 2. 로그인 테스트

1. `/login` 페이지 접속
2. 등록한 이메일과 비밀번호 입력
3. 로그인 완료
4. 대시보드로 리다이렉트 확인
5. 사용자 프로필 로드 확인

### 3. 권한 테스트

1. 일반 사용자로 로그인
2. `/admin` 페이지 접속 시도
3. `/dashboard`로 리다이렉트 확인
4. 관리자로 로그인
5. `/admin` 페이지 접속 가능 확인

### 4. 분석 기록 테스트

1. 로그인 후 분석 실행
2. 분석 결과 확인
3. 대시보드에서 분석 기록 확인
4. 다른 사용자로 로그인
5. 이전 사용자의 분석 기록이 보이지 않는지 확인

## 📚 추가 리소스

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe 문서](https://stripe.com/docs)
- [React Router 문서](https://reactrouter.com/)

## ⚠️ 주의사항

1. **프로덕션 환경**: RLS 정책을 반드시 활성화하세요.
2. **비밀번호 정책**: Supabase Dashboard에서 비밀번호 정책 설정 가능
3. **이메일 인증**: 필요시 이메일 인증 활성화
4. **환경 변수**: 민감한 정보는 환경 변수로 관리
5. **에러 처리**: 모든 인증 관련 오류를 적절히 처리

