-- users 테이블에 phone 컬럼 추가
-- Supabase SQL Editor에서 실행하세요

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- 기존 사용자들의 phone 필드는 NULL로 유지됩니다
-- 새로 가입하는 사용자부터 전화번호가 저장됩니다

