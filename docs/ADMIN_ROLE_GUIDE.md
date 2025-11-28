# 관리자 권한 확인 가이드

## 📋 관리자 권한이란?

관리자 권한은 `users` 테이블의 `role` 컬럼이 `'admin'`인 사용자에게 있습니다.

## 🔍 현재 관리자 확인 방법

### 방법 1: Supabase Dashboard에서 확인

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **Database > SQL Editor로 이동**
   - New query 클릭
   - 다음 SQL 실행:

```sql
-- 관리자 권한을 가진 사용자 확인
SELECT 
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at;
```

3. **결과 확인**
   - `role = 'admin'`인 사용자가 관리자입니다

### 방법 2: Table Editor에서 확인

1. **Database > Table Editor로 이동**
2. **users 테이블 선택**
3. **role 컬럼 확인**
   - `role = 'admin'`인 사용자가 관리자입니다

### 방법 3: SQL 파일 실행

1. **`database/check-admin-users.sql` 파일 열기**
2. **Supabase SQL Editor에서 실행**
3. **결과 확인**

## 🎯 관리자 권한 부여 방법

### 방법 1: SQL로 직접 부여

```sql
-- 특정 사용자에게 관리자 권한 부여
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 방법 2: Supabase Dashboard에서 부여

1. **Database > Table Editor로 이동**
2. **users 테이블 선택**
3. **해당 사용자 행 찾기**
4. **role 컬럼을 `'admin'`으로 변경**
5. **저장**

## 📊 모든 사용자 확인 (관리자 포함)

```sql
-- 모든 사용자 확인 (관리자 표시)
SELECT 
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at,
  CASE 
    WHEN role = 'admin' THEN '관리자'
    ELSE '일반 사용자'
  END AS user_type
FROM users
ORDER BY role DESC, created_at DESC;
```

## 🔒 관리자 권한 기능

관리자는 다음 기능을 사용할 수 있습니다:

1. **모든 분석 기록 확인**
   - 모든 사용자의 분석 결과를 볼 수 있습니다
   - `/admin` 페이지에서 확인 가능

2. **결제 없이 모든 콘텐츠 확인**
   - PaymentGate에서 블러 처리 없이 모든 콘텐츠를 볼 수 있습니다
   - `isAdmin`이 `true`이면 모든 콘텐츠 접근 가능

3. **모든 사용자 정보 확인**
   - RLS 정책에 의해 모든 사용자 정보를 볼 수 있습니다

## ⚠️ 주의사항

1. **관리자 권한은 신중하게 부여해야 합니다**
   - 관리자는 모든 데이터에 접근할 수 있습니다
   - 보안을 위해 최소한의 관리자만 권한을 부여하세요

2. **기본값은 'user'입니다**
   - 새로 가입한 사용자는 모두 `'user'` 역할입니다
   - 관리자 권한을 부여하려면 수동으로 변경해야 합니다

3. **관리자 권한 확인은 데이터베이스에서 직접 확인해야 합니다**
   - 현재 애플리케이션에서는 관리자 목록을 확인하는 UI가 없습니다
   - Supabase Dashboard에서 확인하거나 SQL을 실행해야 합니다

## 🚀 다음 단계

관리자 대시보드에 사용자 목록 확인 기능을 추가하려면:
1. `AdminDashboard.tsx`에 사용자 목록 섹션 추가
2. `users` 테이블에서 모든 사용자 조회
3. 관리자 권한 표시 및 관리 기능 추가

