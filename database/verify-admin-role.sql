-- =====================================================
-- 관리자 권한 확인 스크립트
-- =====================================================
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- 현재 관리자 권한을 가진 사용자 확인
SELECT 
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at,
  updated_at
FROM users
WHERE role = 'admin'
ORDER BY created_at;

-- 모든 사용자 확인 (관리자 표시)
SELECT 
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at,
  updated_at,
  CASE 
    WHEN role = 'admin' THEN '✅ 관리자'
    ELSE '일반 사용자'
  END AS user_type
FROM users
ORDER BY role DESC, created_at DESC;

-- 관리자 권한이 제대로 부여되었는지 확인
SELECT 
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE role = 'admin') AS admin_users,
  COUNT(*) FILTER (WHERE role = 'user') AS regular_users
FROM users;

