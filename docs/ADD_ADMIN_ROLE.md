# 관리자 권한 부여 가이드

## 🚨 현재 상황

Supabase 데이터베이스에 관리자 권한을 가진 사용자가 없습니다.

## ✅ 해결 방법

### 방법 1: Supabase Dashboard에서 직접 수정 (가장 간단)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **Database > Table Editor로 이동**
   - `users` 테이블 선택

3. **현재 사용자 찾기**
   - 등록된 사용자의 이메일 확인
   - 해당 행 클릭

4. **role 컬럼 수정**
   - `role` 컬럼을 `'user'`에서 `'admin'`으로 변경
   - 저장 버튼 클릭

### 방법 2: SQL Editor에서 실행 (권장)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **Database > SQL Editor로 이동**
   - New query 클릭

3. **SQL 실행**
   - 아래 SQL을 복사하여 실행
   - **이메일 주소를 실제 관리자 이메일로 변경하세요**

```sql
-- 관리자 권한 부여
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- 결과 확인
SELECT 
  id,
  email,
  role,
  created_at
FROM users
WHERE role = 'admin';
```

### 방법 3: 모든 사용자를 관리자로 변경 (테스트용)

⚠️ **주의**: 실제 운영 환경에서는 사용하지 마세요!

```sql
-- 모든 사용자를 관리자로 변경
UPDATE users
SET role = 'admin'
WHERE role = 'user';

-- 결과 확인
SELECT 
  id,
  email,
  role,
  created_at
FROM users;
```

## 📋 단계별 가이드

### 1단계: 현재 사용자 확인

```sql
-- 모든 사용자 확인
SELECT 
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at
FROM users
ORDER BY created_at DESC;
```

### 2단계: 관리자 권한 부여

```sql
-- 특정 이메일에 관리자 권한 부여
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 3단계: 결과 확인

```sql
-- 관리자 권한 확인
SELECT 
  id,
  email,
  role,
  created_at
FROM users
WHERE role = 'admin';
```

## 🔍 문제 해결

### 사용자가 없는 경우

1. **회원가입 먼저**: 애플리케이션에서 회원가입을 먼저 진행하세요
2. **사용자 확인**: Supabase Dashboard에서 `users` 테이블에 사용자가 있는지 확인
3. **권한 부여**: 사용자가 있으면 위의 방법으로 관리자 권한 부여

### 권한이 적용되지 않는 경우

1. **브라우저 새로고침**: `Ctrl + F5` (캐시 지우고 새로고침)
2. **로그아웃 후 재로그인**: 세션 정보가 업데이트되도록 합니다
3. **콘솔 확인**: 브라우저 개발자 도구에서 에러 확인

### RLS 정책 오류

관리자 권한이 적용되지 않는다면 RLS 정책을 확인하세요:

```sql
-- RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users';
```

## 📝 파일 위치

- **SQL 스크립트**: `database/add-admin-role.sql`
- **가이드 문서**: `docs/ADD_ADMIN_ROLE.md`

## 🚀 다음 단계

1. **관리자 권한 부여**: 위의 방법 중 하나를 사용하여 관리자 권한 부여
2. **로그아웃 후 재로그인**: 관리자 권한이 적용되도록 합니다
3. **기능 테스트**: 관리자 페이지 접근 및 기능 테스트

## ⚠️ 주의사항

1. **이메일 주소 확인**: SQL 실행 시 이메일 주소를 정확히 입력하세요
2. **보안**: 관리자 권한은 신중하게 부여하세요
3. **테스트**: 관리자 권한 부여 후 기능이 제대로 작동하는지 확인하세요

