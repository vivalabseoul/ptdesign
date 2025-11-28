-- 현재 관리자 권한을 가진 사용자 확인
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

