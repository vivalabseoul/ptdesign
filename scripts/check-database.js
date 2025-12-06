/**
 * Supabase 데이터베이스 상태 확인 스크립트
 * 
 * 사용 방법:
 * npm run check-db
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const projectId = "nbyihpfzzkluqfwexsvh";
const publicAnonKey = process.env.SUPABASE_ANON_KEY || "";

const supabaseUrl = `https://${projectId}.supabase.co`;

// Public anon key로 클라이언트 생성 (읽기 전용)
const supabase = createClient(supabaseUrl, publicAnonKey);

async function checkDatabase() {
  console.log('🔍 Supabase 데이터베이스 상태 확인 중...\n');

  // 1. users 테이블 확인
  console.log('1. users 테이블 확인 중...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('   ❌ users 테이블이 존재하지 않습니다.');
        console.log('   📝 database/setup.sql을 실행하세요.\n');
      } else {
        console.log('   ⚠️  오류:', error.message);
        console.log('   📝 RLS 정책이 설정되지 않았을 수 있습니다.\n');
      }
    } else {
      console.log('   ✅ users 테이블이 존재합니다.');
      if (data && data.length > 0) {
        console.log(`   📊 총 ${data.length}개의 사용자가 있습니다.`);
      }
      console.log('');
    }
  } catch (error) {
    console.log('   ❌ 오류:', error.message);
    console.log('');
  }

  // 2. analyses 테이블 확인
  console.log('2. analyses 테이블 확인 중...');
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('   ❌ analyses 테이블이 존재하지 않습니다.');
        console.log('   📝 database/setup.sql을 실행하세요.\n');
      } else {
        console.log('   ⚠️  오류:', error.message);
        console.log('   📝 RLS 정책이 설정되지 않았을 수 있습니다.\n');
      }
    } else {
      console.log('   ✅ analyses 테이블이 존재합니다.');
      console.log('');
    }
  } catch (error) {
    console.log('   ❌ 오류:', error.message);
    console.log('');
  }

  // 3. payments 테이블 확인 (선택사항)
  console.log('3. payments 테이블 확인 중...');
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('   ⚠️  payments 테이블이 존재하지 않습니다. (선택사항)');
        console.log('');
      } else {
        console.log('   ⚠️  오류:', error.message);
        console.log('');
      }
    } else {
      console.log('   ✅ payments 테이블이 존재합니다.');
      console.log('');
    }
  } catch (error) {
    console.log('   ⚠️  payments 테이블은 선택사항입니다.');
    console.log('');
  }

  console.log('📋 다음 단계:');
  console.log('1. 테이블이 존재하지 않으면: database/setup.sql 실행');
  console.log('2. RLS 정책 확인: Supabase Dashboard > Database > Policies');
  console.log('3. 인증 설정 확인: Supabase Dashboard > Authentication > Providers\n');
}

checkDatabase();
