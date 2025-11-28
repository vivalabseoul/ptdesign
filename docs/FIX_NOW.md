# ⚠️ 즉시 실행 필요: RLS 무한 재귀 문제 해결

## 🐛 문제

RLS 정책에서 무한 재귀 오류가 발생했습니다:
```
infinite recursion detected in policy for relation "users"
```

## ✅ 해결 방법

Supabase Dashboard에서 `database/fix-rls-recursion.sql` 파일의 SQL을 실행하세요.

## 🚀 실행 단계

### 1단계: Supabase Dashboard 접속

1. **Supabase Dashboard 열기**
   - 브라우저에서 https://supabase.com/dashboard 접속
   - 프로젝트 선택

### 2단계: SQL Editor에서 SQL 실행

1. **SQL Editor로 이동**
   - Database > SQL Editor
   - New query 클릭

2. **SQL 스크립트 복사 및 실행**
   - `database/fix-rls-recursion.sql` 파일을 열어서 **전체 내용 복사** (Ctrl+A, Ctrl+C)
   - SQL Editor에 **붙여넣기** (Ctrl+V)
   - **RUN** 버튼 클릭 (또는 Ctrl+Enter)

3. **결과 확인**
   - 모든 SQL 문이 성공적으로 실행되었는지 확인
   - 오류가 있으면 오류 메시지 확인

### 3단계: 설정 확인

로컬에서 확인:

```bash
npm run check-db
```

예상 결과:
- ✅ `users` 테이블이 존재합니다
- ✅ `analyses` 테이블이 존재합니다
- ✅ `payments` 테이블이 존재합니다 (선택사항)

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

## 🔍 문제 원인

기존 정책이 `users` 테이블을 조회하면서 다시 같은 정책을 확인하려고 해서 무한 재귀가 발생합니다.

## ✅ 해결 원리

`SECURITY DEFINER` 함수를 사용하여 RLS를 우회:
- 함수는 함수 소유자의 권한으로 실행됨
- RLS 정책을 우회할 수 있음
- 재귀 없이 관리자 권한 확인 가능

## 🎉 완료 후

설정이 완료되면 다음을 테스트하세요:

1. ✅ 회원가입 테스트
2. ✅ 로그인 테스트
3. ✅ 분석 기록 저장 테스트
4. ✅ 관리자 대시보드 테스트

문제가 있으면 `npm run check-db`를 실행하여 상태를 확인하세요.

