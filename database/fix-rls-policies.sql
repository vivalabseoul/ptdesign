-- RLS 정책 수정 스크립트
-- 무한 재귀 문제 해결

-- 1. users 테이블 정책 수정
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- 관리자 정책: auth.users의 메타데이터에서 역할 확인 (재귀 방지)
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    OR
    (auth.jwt() ->> 'raw_user_meta_data')::jsonb ->> 'role' = 'admin'
  );

-- 2. analyses 테이블 정책 수정
DROP POLICY IF EXISTS "Admins can view all analyses" ON analyses;

-- 관리자 정책: auth.users의 메타데이터에서 역할 확인 (재귀 방지)
CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    OR
    (auth.jwt() ->> 'raw_user_meta_data')::jsonb ->> 'role' = 'admin'
  );

-- 3. payments 테이블 정책 수정 (선택사항)
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

-- 관리자 정책: auth.users의 메타데이터에서 역할 확인 (재귀 방지)
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    OR
    (auth.jwt() ->> 'raw_user_meta_data')::jsonb ->> 'role' = 'admin'
  );

-- 완료 메시지
SELECT 'RLS policies fixed successfully!' AS message;

