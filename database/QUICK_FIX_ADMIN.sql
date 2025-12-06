-- =====================================================
-- 빠른 해결: 관리자 권한 부여
-- =====================================================
-- 콘솔에서 확인한 사용자 ID: bcdee429-0d46-4e2e-981e-f7038addfdf1
-- =====================================================

-- 1단계: 관리자 권한 부여
UPDATE users
SET role = 'admin',
    updated_at = NOW()
WHERE id = 'bcdee429-0d46-4e2e-981e-f7038addfdf1';

-- 2단계: 결과 확인
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

-- 3단계: 모든 관리자 확인
SELECT 
  id,
  email,
  role,
  created_at,
  updated_at
FROM users
WHERE role = 'admin'
ORDER BY created_at DESC;

