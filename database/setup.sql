-- =====================================================
-- Pro Touch Design 데이터베이스 설정 스크립트 (최종)
-- =====================================================
-- Supabase SQL Editor에서 이 파일 전체를 실행하세요
-- =====================================================
-- 기존 데이터와 정책은 보존되며, 안전하게 실행됩니다
-- =====================================================

-- =====================================================
-- 1. 관리자 권한 확인 함수 생성 (재귀 방지)
-- =====================================================
-- SECURITY DEFINER로 RLS를 우회하여 관리자 권한을 확인합니다
-- 이 함수는 정책보다 먼저 정의되어야 합니다
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. users 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (존재하지 않을 때만)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON users(email);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
    CREATE INDEX idx_users_role ON users(role);
  END IF;
END $$;

-- RLS 활성화 (이미 활성화되어 있어도 안전)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (기존 정책이 없을 때만)
DO $$
BEGIN
  -- 사용자 프로필 조회 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON users FOR SELECT
      USING (auth.uid() = id);
  END IF;

  -- 사용자 프로필 수정 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON users FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  -- 관리자 정책: 기존 정책이 있으면 삭제 후 재생성 (재귀 방지를 위해)
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Admins can view all users'
  ) THEN
    DROP POLICY "Admins can view all users" ON users;
  END IF;
  CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (public.is_admin(auth.uid()));
END $$;

-- =====================================================
-- 3. analyses 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  site_address TEXT,
  analysis_date TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_contact TEXT NOT NULL,
  issues JSONB NOT NULL,
  score JSONB NOT NULL,
  screenshot_url TEXT,
  improved_design_urls JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (존재하지 않을 때만)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analyses_user_id') THEN
    CREATE INDEX idx_analyses_user_id ON analyses(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analyses_created_at') THEN
    CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
  END IF;
END $$;

-- RLS 활성화
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (기존 정책이 없을 때만)
DO $$
BEGIN
  -- 사용자 분석 기록 조회 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'analyses' 
    AND policyname = 'Users can view own analyses'
  ) THEN
    CREATE POLICY "Users can view own analyses"
      ON analyses FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  -- 사용자 분석 기록 생성 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'analyses' 
    AND policyname = 'Users can insert own analyses'
  ) THEN
    CREATE POLICY "Users can insert own analyses"
      ON analyses FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- 관리자 정책: 기존 정책이 있으면 삭제 후 재생성 (재귀 방지를 위해)
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'analyses' 
    AND policyname = 'Admins can view all analyses'
  ) THEN
    DROP POLICY "Admins can view all analyses" ON analyses;
  END IF;
  CREATE POLICY "Admins can view all analyses"
    ON analyses FOR SELECT
    USING (public.is_admin(auth.uid()));
END $$;

-- =====================================================
-- 4. payments 테이블 생성 (선택사항)
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'basic', 'pro', 'enterprise')),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (존재하지 않을 때만)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_user_id') THEN
    CREATE INDEX idx_payments_user_id ON payments(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
    CREATE INDEX idx_payments_status ON payments(status);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_stripe_session_id') THEN
    CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_session_id);
  END IF;
END $$;

-- RLS 활성화
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (기존 정책이 없을 때만)
DO $$
BEGIN
  -- 사용자 결제 기록 조회 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'payments' 
    AND policyname = 'Users can view own payments'
  ) THEN
    CREATE POLICY "Users can view own payments"
      ON payments FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  -- 사용자 결제 기록 생성 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'payments' 
    AND policyname = 'Users can insert own payments'
  ) THEN
    CREATE POLICY "Users can insert own payments"
      ON payments FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- 관리자 정책: 기존 정책이 있으면 삭제 후 재생성 (재귀 방지를 위해)
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'payments' 
    AND policyname = 'Admins can view all payments'
  ) THEN
    DROP POLICY "Admins can view all payments" ON payments;
  END IF;
  CREATE POLICY "Admins can view all payments"
    ON payments FOR SELECT
    USING (public.is_admin(auth.uid()));
END $$;

-- =====================================================
-- 5. 사용자 프로필 자동 생성 함수
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (기존 트리거가 있으면 삭제 후 재생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 6. updated_at 자동 업데이트 함수
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성 (기존 트리거가 있으면 삭제 후 재생성)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_analyses_updated_at ON analyses;
CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 완료 메시지
-- =====================================================
SELECT '✅ 데이터베이스 설정이 완료되었습니다!' AS message;
