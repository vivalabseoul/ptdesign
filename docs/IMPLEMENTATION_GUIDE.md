# 인증 및 결제 시스템 구현 가이드

## 📋 구현 완료 사항

### ✅ 완료된 기능

1. **인증 시스템**
   - 회원가입/로그인 컴포넌트
   - 인증 컨텍스트 (AuthContext)
   - 보호된 라우트 (ProtectedRoute)
   - 사용자 역할 관리 (관리자, 일반 사용자)

2. **라우팅 시스템**
   - React Router 설정
   - 페이지별 라우트 구성
   - 리다이렉트 처리

3. **사용자 대시보드**
   - 사용자별 분석 기록 조회
   - 분석 기록 상세 보기
   - 로그아웃 기능

4. **관리자 대시보드**
   - 전체 분석 기록 조회
   - 관리자 전용 페이지
   - 권한 기반 접근 제어

5. **결제 시스템 준비**
   - Stripe 통합 준비
   - 결제 버튼 컴포넌트
   - 플랜별 결제 처리

## 🚀 설정 단계

### 1. 패키지 설치

```bash
npm install
```

설치되는 패키지:
- `react-router-dom`: 라우팅
- `@supabase/supabase-js`: Supabase 클라이언트
- `@stripe/stripe-js`: Stripe 결제 시스템

### 2. Supabase 데이터베이스 설정

#### 2.1 Supabase Dashboard 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택

#### 2.2 SQL Editor에서 스크립트 실행

1. Database > SQL Editor로 이동
2. `database/setup.sql` 파일의 내용을 복사하여 실행
3. 또는 SQL Editor에서 직접 실행

#### 2.3 테이블 확인

1. Database > Table Editor로 이동
2. 다음 테이블이 생성되었는지 확인:
   - `users`
   - `analyses`
   - `payments` (선택사항)

#### 2.4 RLS 정책 확인

1. Database > Table Editor > 각 테이블 선택
2. Policies 탭에서 정책 확인
3. 정책이 올바르게 설정되었는지 확인

### 3. Authentication 설정

#### 3.1 Email Provider 활성화

1. Authentication > Providers로 이동
2. Email provider 활성화
3. Email template 설정 (선택사항)

#### 3.2 Redirect URLs 설정

1. Authentication > URL Configuration으로 이동
2. Site URL 설정:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://your-domain.com`
3. Redirect URLs 추가:
   - `http://localhost:3000/**`
   - `https://your-domain.com/**`

### 4. 관리자 계정 생성

#### 방법 1: SQL 직접 실행

```sql
-- 1. Supabase Dashboard > Authentication > Users에서 관리자 계정 생성
-- 2. SQL Editor에서 다음 쿼리 실행

UPDATE users
SET role = 'admin'
WHERE email = 'admin@protouch.design';
```

#### 방법 2: Supabase Dashboard에서

1. Authentication > Users에서 관리자 계정 생성
2. Database > Table Editor > users 테이블 선택
3. 해당 사용자의 `role`을 `admin`으로 변경

### 5. Stripe 설정 (결제 기능 사용 시)

#### 5.1 Stripe 계정 생성

1. [Stripe](https://stripe.com) 가입
2. Dashboard > Developers > API keys에서 키 확인
3. Publishable key와 Secret key 확인

#### 5.2 환경 변수 설정

`.env` 파일 생성:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### 5.3 Stripe Products 및 Prices 생성

1. Stripe Dashboard > Products에서 제품 생성
2. 각 플랜에 대한 Price ID 확인
3. `utils/payment/stripe.ts`에서 Price ID 업데이트

#### 5.4 결제 세션 생성 API (백엔드 필요)

결제 세션을 생성하기 위한 API 엔드포인트가 필요합니다:

```typescript
// Supabase Edge Function 또는 백엔드 API
// POST /api/create-checkout-session
{
  planId: 'basic',
  priceId: 'price_...',
  userId: 'user_id'
}
```

## 🔄 사용자 플로우

### 1. 회원가입 플로우

1. 사용자가 `/signup` 페이지 접속
2. 이메일과 비밀번호 입력
3. 회원가입 완료
4. Supabase Auth에서 사용자 생성
5. 트리거가 자동으로 `users` 테이블에 프로필 생성
6. 로그인 상태로 전환
7. `/dashboard`로 리다이렉트

### 2. 로그인 플로우

1. 사용자가 `/login` 페이지 접속
2. 이메일과 비밀번호 입력
3. 로그인 완료
4. Supabase Auth에서 인증 확인
5. 세션 생성 및 저장
6. 사용자 프로필 로드
7. `/dashboard`로 리다이렉트

### 3. 분석 플로우

1. 사용자가 홈 페이지에서 URL 입력
2. 로그인 확인 (미로그인 시 로그인 페이지로)
3. 분석 실행
4. 분석 결과 표시
5. 분석 결과를 `analyses` 테이블에 저장
6. 사용자는 대시보드에서 분석 기록 확인

### 4. 결제 플로우

1. 사용자가 플랜 선택
2. `PaymentButton` 클릭
3. 로그인 확인 (미로그인 시 로그인 페이지로)
4. Stripe Checkout 세션 생성 (백엔드 API 호출)
5. Stripe 결제 페이지로 리다이렉트
6. 결제 완료 후 성공 페이지로 리다이렉트
7. 사용자 구독 상태 업데이트

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

## 📊 데이터베이스 구조

### users 테이블
- `id` (UUID): 사용자 ID (auth.users와 연결)
- `email` (TEXT): 이메일 주소
- `role` (TEXT): 사용자 역할 ('admin', 'user')
- `subscription_status` (TEXT): 구독 상태
- `subscription_plan` (TEXT): 구독 플랜
- `created_at` (TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP): 수정 일시

### analyses 테이블
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

### payments 테이블 (선택사항)
- `id` (UUID): 결제 기록 ID
- `user_id` (UUID): 사용자 ID (users 테이블 참조)
- `plan_id` (TEXT): 플랜 ID
- `amount` (INTEGER): 결제 금액
- `currency` (TEXT): 통화
- `status` (TEXT): 결제 상태
- `stripe_session_id` (TEXT): Stripe 세션 ID
- `stripe_payment_intent_id` (TEXT): Stripe Payment Intent ID
- `created_at` (TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP): 수정 일시

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
3. `analyses` 테이블에 레코드 생성 확인
4. 대시보드에서 분석 기록 확인
5. 다른 사용자로 로그인
6. 이전 사용자의 분석 기록이 보이지 않는지 확인

## 📝 다음 단계

### 1. 결제 시스템 구현

1. Stripe 계정 생성
2. Products 및 Prices 생성
3. 결제 세션 생성 API 구현
4. 웹훅 설정 (결제 완료 후 구독 상태 업데이트)

### 2. 구독 관리

1. 사용자 구독 상태 관리
2. 구독 플랜별 기능 제한
3. 구독 갱신 처리
4. 구독 취소 처리

### 3. 추가 기능

1. 이메일 인증
2. 비밀번호 재설정
3. 프로필 관리
4. 분석 기록 필터링 및 검색
5. 분석 기록 공유 기능

## ⚠️ 주의사항

1. **프로덕션 환경**: RLS 정책을 반드시 활성화하세요.
2. **비밀번호 정책**: Supabase Dashboard에서 비밀번호 정책 설정 가능
3. **이메일 인증**: 필요시 이메일 인증 활성화
4. **환경 변수**: 민감한 정보는 환경 변수로 관리
5. **에러 처리**: 모든 인증 관련 오류를 적절히 처리
6. **결제 시스템**: 실제 결제 전에 테스트 모드로 충분히 테스트

## 📚 참고 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [React Router 문서](https://reactrouter.com/)
- [Stripe 문서](https://stripe.com/docs)
- [Supabase Database 문서](https://supabase.com/docs/guides/database)

