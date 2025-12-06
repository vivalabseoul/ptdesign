-- =====================================================
-- 관리자 계정 생성 스크립트
-- =====================================================
-- 이 스크립트는 새로운 관리자 계정을 생성합니다.
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- 주의사항:
-- 1. 먼저 Supabase Authentication에서 수동으로 사용자를 생성해야 합니다.
-- 2. 생성된 사용자의 이메일을 아래 admin_email 변수에 입력하세요.
-- 3. 이 스크립트는 기존 사용자의 role을 'admin'으로 변경합니다.

DO $$
DECLARE
  admin_email TEXT := 'vivalabseoul@gmail.com'; -- 관리자 이메일 주소
  user_exists BOOLEAN;
  admin_user_id UUID;
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE '관리자 계정 생성/업데이트 중...';
  RAISE NOTICE '================================================';

  -- 사용자 존재 여부 확인
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE email = admin_email
  ) INTO user_exists;

  IF user_exists THEN
    -- 기존 사용자를 관리자로 승격
    UPDATE public.users
    SET role = 'admin'
    WHERE email = admin_email
    RETURNING id INTO admin_user_id;

    RAISE NOTICE '기존 사용자를 관리자로 승격했습니다.';
    RAISE NOTICE '- 이메일: %', admin_email;
    RAISE NOTICE '- ID: %', admin_user_id;
  ELSE
    RAISE NOTICE '경고: 해당 이메일의 사용자를 찾을 수 없습니다: %', admin_email;
    RAISE NOTICE '';
    RAISE NOTICE '다음 단계를 수행하세요:';
    RAISE NOTICE '1. Supabase Dashboard > Authentication > Users로 이동';
    RAISE NOTICE '2. "Add User" 버튼을 클릭';
    RAISE NOTICE '3. 이메일(%): 과 비밀번호를 입력하여 사용자 생성', admin_email;
    RAISE NOTICE '4. 사용자 생성 후 이 스크립트를 다시 실행';
    RAISE EXCEPTION '사용자를 찾을 수 없습니다. 스크립트를 중단합니다.';
  END IF;

  RAISE NOTICE '================================================';
  RAISE NOTICE '완료!';
  RAISE NOTICE '================================================';
END $$;

-- 관리자 계정 확인
SELECT
  '관리자 계정 정보' AS category,
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at
FROM public.users
WHERE role = 'admin'
ORDER BY created_at;

SELECT '✅ 관리자 계정 설정이 완료되었습니다!' AS message;
