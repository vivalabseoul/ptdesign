-- =====================================================
-- Pro Touch Design 데이터베이스 완전 초기화 스크립트
-- =====================================================
-- 경고: 이 스크립트는 모든 데이터를 삭제합니다!
-- 실전 운영 전 테스트 데이터와 데모 데이터를 모두 제거합니다.
-- 관리자 계정 1개만 남기고 모든 데이터를 삭제합니다.
-- =====================================================
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- =====================================================
-- 1단계: 모든 데이터 삭제 (관리자 계정 제외)
-- =====================================================

-- 주의: 이 스크립트를 실행하기 전에 반드시 다음을 확인하세요:
-- 1. 백업이 필요한 경우 먼저 백업을 수행하세요
-- 2. 남길 관리자 계정의 이메일을 확인하세요

DO $$
DECLARE
  admin_email TEXT := 'admin@protouchdesign.com'; -- 남길 관리자 이메일 주소를 여기에 입력
  admin_user_id UUID;
  deleted_analyses_count INT;
  deleted_payments_count INT;
  deleted_users_count INT;
  deleted_auth_users_count INT;
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE '데이터베이스 초기화 시작...';
  RAISE NOTICE '================================================';

  -- 관리자 계정 확인
  SELECT id INTO admin_user_id
  FROM public.users
  WHERE email = admin_email AND role = 'admin';

  IF admin_user_id IS NULL THEN
    RAISE NOTICE '경고: 관리자 계정을 찾을 수 없습니다: %', admin_email;
    RAISE NOTICE '모든 사용자를 삭제하려면 admin_email 변수를 NULL로 설정하세요.';
    RAISE EXCEPTION '관리자 계정을 찾을 수 없습니다. 스크립트를 중단합니다.';
  ELSE
    RAISE NOTICE '유지할 관리자 계정: % (ID: %)', admin_email, admin_user_id;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '1단계: 분석 기록 삭제 중...';
  RAISE NOTICE '================================================';

  -- 관리자의 분석 기록도 모두 삭제 (테스트 데이터 포함)
  DELETE FROM public.analyses;
  GET DIAGNOSTICS deleted_analyses_count = ROW_COUNT;
  RAISE NOTICE '삭제된 분석 기록: %개', deleted_analyses_count;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '2단계: 결제 기록 삭제 중...';
  RAISE NOTICE '================================================';

  -- 관리자의 결제 기록도 모두 삭제
  DELETE FROM public.payments;
  GET DIAGNOSTICS deleted_payments_count = ROW_COUNT;
  RAISE NOTICE '삭제된 결제 기록: %개', deleted_payments_count;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '3단계: 사용자 데이터 삭제 중...';
  RAISE NOTICE '================================================';

  -- 관리자를 제외한 모든 사용자 삭제 (public.users)
  DELETE FROM public.users
  WHERE id != admin_user_id;
  GET DIAGNOSTICS deleted_users_count = ROW_COUNT;
  RAISE NOTICE '삭제된 사용자 (public.users): %명', deleted_users_count;

  -- 관리자를 제외한 모든 인증 사용자 삭제 (auth.users)
  -- 주의: auth.users 삭제는 CASCADE로 인해 public.users도 함께 삭제됩니다
  DELETE FROM auth.users
  WHERE id != admin_user_id;
  GET DIAGNOSTICS deleted_auth_users_count = ROW_COUNT;
  RAISE NOTICE '삭제된 사용자 (auth.users): %명', deleted_auth_users_count;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '초기화 완료!';
  RAISE NOTICE '================================================';
  RAISE NOTICE '총 삭제된 데이터:';
  RAISE NOTICE '- 분석 기록: %개', deleted_analyses_count;
  RAISE NOTICE '- 결제 기록: %개', deleted_payments_count;
  RAISE NOTICE '- 사용자 (public): %명', deleted_users_count;
  RAISE NOTICE '- 사용자 (auth): %명', deleted_auth_users_count;
  RAISE NOTICE '';
  RAISE NOTICE '유지된 관리자 계정:';
  RAISE NOTICE '- 이메일: %', admin_email;
  RAISE NOTICE '- ID: %', admin_user_id;
  RAISE NOTICE '================================================';

END $$;

-- =====================================================
-- 2단계: 관리자 계정 정보 확인
-- =====================================================
SELECT
  '남은 사용자 계정' AS category,
  id,
  email,
  role,
  subscription_status,
  subscription_plan,
  created_at
FROM public.users
ORDER BY created_at;

-- =====================================================
-- 3단계: 테이블 상태 확인
-- =====================================================
SELECT
  '테이블 상태' AS info,
  'users' AS table_name,
  COUNT(*) AS count
FROM public.users

UNION ALL

SELECT
  '테이블 상태' AS info,
  'analyses' AS table_name,
  COUNT(*) AS count
FROM public.analyses

UNION ALL

SELECT
  '테이블 상태' AS info,
  'payments' AS table_name,
  COUNT(*) AS count
FROM public.payments;

-- =====================================================
-- 완료
-- =====================================================
SELECT '✅ 데이터베이스가 완전히 초기화되었습니다!' AS message;
SELECT '⚠️ 프로덕션 환경에서 안전하게 사용할 수 있습니다.' AS message;
