-- =====================================================
-- 관리자 권한 부여 스크립트
-- =====================================================
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- 방법 1: 이메일로 관리자 권한 부여
-- 아래 이메일 주소를 실제 관리자 이메일로 변경하세요
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- 방법 2: 현재 등록된 모든 사용자를 관리자로 변경 (테스트용)
-- 주의: 실제 운영 환경에서는 사용하지 마세요
-- UPDATE users
-- SET role = 'admin'
-- WHERE role = 'user';

-- 방법 3: 특정 사용자 ID로 관리자 권한 부여
-- 아래 UUID를 실제 사용자 ID로 변경하세요
-- UPDATE users
-- SET role = 'admin'
-- WHERE id = 'user-uuid-here';

-- 현재 관리자 권한을 가진 사용자 확인
SELECT 
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at
FROM users
WHERE role = 'admin';

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

