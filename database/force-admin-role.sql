-- =====================================================
-- 관리자 권한 강제 부여 스크립트
-- =====================================================
-- Supabase SQL Editor에서 실행하세요
-- =====================================================
-- 주의: 이 스크립트는 현재 로그인한 사용자 또는 특정 사용자에게
-- 관리자 권한을 부여합니다.
-- =====================================================

-- 방법 1: 특정 사용자 ID로 관리자 권한 부여 (현재 로그인한 사용자)
-- 콘솔에서 확인한 userId 사용
UPDATE users
SET role = 'admin',
    updated_at = NOW()
WHERE id = 'bcdee429-0d46-4e2e-981e-f7038addfdf1';

-- 결과 확인
SELECT 
  id,
  email,
  role,
  updated_at,
  CASE 
    WHEN role = 'admin' THEN '✅ 관리자'
    ELSE '❌ 일반 사용자'
  END AS status
FROM users
WHERE id = 'bcdee429-0d46-4e2e-981e-f7038addfdf1';

-- 방법 2: 이메일로 관리자 권한 부여
-- 아래 이메일 주소를 실제 사용자 이메일로 변경하세요
-- UPDATE users
-- SET role = 'admin',
--     updated_at = NOW()
-- WHERE email = 'your-email@example.com';

-- 방법 3: 모든 사용자를 관리자로 변경 (테스트용)
-- ⚠️ 주의: 실제 운영 환경에서는 사용하지 마세요!
-- UPDATE users
-- SET role = 'admin',
--     updated_at = NOW()
-- WHERE role = 'user';

-- 결과 확인
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
    ELSE '❌ 일반 사용자'
  END AS status
FROM users
WHERE id = 'bcdee429-0d46-4e2e-981e-f7038addfdf1';

-- 모든 관리자 확인
SELECT 
  id,
  email,
  role,
  created_at,
  updated_at
FROM users
WHERE role = 'admin'
ORDER BY created_at DESC;

