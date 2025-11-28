/**
 * Supabase 데이터베이스 설정 스크립트
 * 
 * 이 스크립트는 Supabase Management API를 사용하여 데이터베이스를 설정합니다.
 * Supabase Dashboard > Settings > API > Project API keys에서 Service Role Key가 필요합니다.
 * 
 * 사용 방법:
 * 1. .env 파일에 SERVICE_ROLE_KEY 설정
 * 2. npm run setup-db 실행
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase 설정
const projectId = "nbyihpfzzkluqfwexsvh";
const supabaseUrl = `https://${projectId}.supabase.co`;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.');
  console.error('Supabase Dashboard > Settings > API > Project API keys에서 Service Role Key를 확인하세요.');
  process.exit(1);
}

// Service Role Key로 Supabase 클라이언트 생성 (관리자 권한)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// SQL 파일 읽기
const sqlFile = join(__dirname, '../database/setup.sql');
const sql = readFileSync(sqlFile, 'utf-8');

// SQL을 문장별로 분리
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && s !== 'SELECT \'Database setup completed successfully!\' AS message');

async function setupDatabase() {
  console.log('🚀 Supabase 데이터베이스 설정을 시작합니다...\n');

  try {
    // Supabase는 REST API를 통해 직접 SQL을 실행할 수 없습니다.
    // 대신 RPC 함수를 사용하거나, 각 작업을 개별적으로 수행해야 합니다.
    
    console.log('⚠️  주의: Supabase 클라이언트는 DDL 작업(SELECT, INSERT, UPDATE, DELETE 등)을 지원하지만,');
    console.log('   테이블 생성이나 RLS 정책 설정 같은 스키마 변경 작업은 지원하지 않습니다.\n');
    console.log('📋 다음 방법 중 하나를 선택하세요:\n');
    console.log('1. Supabase Dashboard에서 직접 실행 (권장)');
    console.log('   - Supabase Dashboard > Database > SQL Editor로 이동');
    console.log('   - database/setup.sql 파일의 내용을 복사하여 실행\n');
    console.log('2. Supabase CLI 사용');
    console.log('   - supabase db reset 명령어 사용\n');
    console.log('3. 수동 설정');
    console.log('   - 각 테이블과 정책을 수동으로 생성\n');

    // 테이블이 이미 존재하는지 확인
    console.log('🔍 기존 테이블 확인 중...\n');
    
    const { data: usersTable, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (usersError && usersError.code === 'PGRST116') {
      console.log('❌ users 테이블이 존재하지 않습니다.');
      console.log('   Supabase Dashboard에서 database/setup.sql을 실행하세요.\n');
    } else if (usersError) {
      console.log('⚠️  users 테이블 확인 중 오류:', usersError.message);
    } else {
      console.log('✅ users 테이블이 이미 존재합니다.');
    }

    const { data: analysesTable, error: analysesError } = await supabase
      .from('analyses')
      .select('id')
      .limit(1);

    if (analysesError && analysesError.code === 'PGRST116') {
      console.log('❌ analyses 테이블이 존재하지 않습니다.');
      console.log('   Supabase Dashboard에서 database/setup.sql을 실행하세요.\n');
    } else if (analysesError) {
      console.log('⚠️  analyses 테이블 확인 중 오류:', analysesError.message);
    } else {
      console.log('✅ analyses 테이블이 이미 존재합니다.');
    }

    console.log('\n📝 다음 단계:');
    console.log('1. Supabase Dashboard 접속: https://supabase.com/dashboard');
    console.log('2. 프로젝트 선택');
    console.log('3. Database > SQL Editor로 이동');
    console.log('4. database/setup.sql 파일의 내용을 복사하여 실행');
    console.log('5. 모든 SQL 문이 성공적으로 실행되었는지 확인\n');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

setupDatabase();

