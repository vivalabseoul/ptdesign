# RLS 무한 재귀 문제 해결 가이드

## 🐛 문제

RLS 정책에서 무한 재귀 오류가 발생했습니다:
```
infinite recursion detected in policy for relation "users"
```

이 문제는 관리자 정책이 `users` 테이블을 조회하면서 다시 같은 정책을 확인하려고 해서 발생합니다.

## ✅ 해결 방법

`SECURITY DEFINER` 함수를 사용하여 RLS를 우회하고 관리자 권한을 확인합니다.

## 🚀 실행 방법

### 방법 1: 수정된 SQL 실행 (권장)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **SQL Editor로 이동**
   - Database > SQL Editor
   - New query 클릭

3. **수정된 SQL 실행**
   - `database/fix-rls-recursion.sql` 파일의 **전체 내용 복사**
   - SQL Editor에 **붙여넣기**
   - **RUN** 버튼 클릭

### 방법 2: setup.sql 재실행

1. **수정된 setup.sql 실행**
   - `database/setup.sql` 파일이 이미 수정되었습니다
   - Supabase Dashboard > SQL Editor에서 재실행

## 📋 실행할 SQL

`database/fix-rls-recursion.sql` 파일의 전체 내용:

```sql
-- RLS 무한 재귀 문제 해결 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 관리자 권한 확인 함수 생성 (SECURITY DEFINER로 RLS 우회)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. users 테이블 정책 수정
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 3. analyses 테이블 정책 수정
DROP POLICY IF EXISTS "Admins can view all analyses" ON analyses;

CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 4. payments 테이블 정책 수정 (선택사항)
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 완료 메시지
SELECT 'RLS recursion issue fixed successfully!' AS message;
```

## ✅ 실행 후 확인

### 1. 로컬에서 확인

```bash
npm run check-db
```

예상 결과:
- ✅ `users` 테이블이 존재합니다
- ✅ `analyses` 테이블이 존재합니다
- ✅ `payments` 테이블이 존재합니다 (선택사항)

### 2. Supabase Dashboard에서 확인

1. **Functions 확인**
   - Database > Functions
   - ✅ `is_admin` 함수 확인

2. **Policies 확인**
   - 각 테이블 > Policies 탭
   - ✅ 정책이 올바르게 설정되었는지 확인

## 🔍 문제 원인

기존 정책:
```sql
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users  -- ❌ 무한 재귀 발생!
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

이 정책은 `users` 테이블을 조회하면서 다시 같은 정책을 확인하려고 해서 무한 재귀가 발생합니다.

## ✅ 해결 방법

`SECURITY DEFINER` 함수를 사용하여 RLS를 우회:

```sql
-- SECURITY DEFINER 함수 생성 (RLS 우회)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 정책에서 함수 사용
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (public.is_admin(auth.uid()));  -- ✅ 재귀 없음!
```

`SECURITY DEFINER` 함수는 함수 소유자의 권한으로 실행되므로 RLS를 우회할 수 있습니다.

## 🎉 완료!

설정이 완료되면 다음을 테스트하세요:

1. ✅ 회원가입 테스트
2. ✅ 로그인 테스트
3. ✅ 분석 기록 저장 테스트
4. ✅ 관리자 대시보드 테스트

문제가 있으면 `npm run check-db`를 실행하여 상태를 확인하세요.

