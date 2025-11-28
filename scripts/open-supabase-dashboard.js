/**
 * Supabase Dashboard를 브라우저에서 열어주는 스크립트
 * 
 * 사용 방법:
 * npm run open-supabase
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const projectId = "nbyihpfzzkluqfwexsvh";
const supabaseUrl = `https://supabase.com/dashboard/project/${projectId}`;

async function openSupabaseDashboard() {
  console.log('🚀 Supabase Dashboard를 열고 있습니다...\n');
  console.log(`📋 프로젝트 ID: ${projectId}`);
  console.log(`🔗 URL: ${supabaseUrl}\n`);

  try {
    // 운영 체제에 따라 브라우저 열기
    const platform = process.platform;
    let command;

    if (platform === 'win32') {
      // Windows
      command = `start ${supabaseUrl}`;
    } else if (platform === 'darwin') {
      // macOS
      command = `open ${supabaseUrl}`;
    } else {
      // Linux
      command = `xdg-open ${supabaseUrl}`;
    }

    await execAsync(command);
    
    console.log('✅ 브라우저에서 Supabase Dashboard가 열렸습니다.\n');
    console.log('📋 다음 단계:');
    console.log('1. Database > SQL Editor로 이동');
    console.log('2. New query 클릭');
    console.log('3. database/setup.sql 파일의 내용을 복사하여 붙여넣기');
    console.log('4. RUN 버튼 클릭\n');
    console.log('💡 팁: database/setup.sql 파일을 열어서 전체 내용을 복사하세요.\n');
  } catch (error) {
    console.error('❌ 브라우저를 열 수 없습니다.');
    console.error('다음 URL을 브라우저에서 직접 열어주세요:');
    console.error(supabaseUrl);
    console.error('\n또는 다음 단계를 따라주세요:');
    console.error('1. 브라우저에서 https://supabase.com/dashboard 접속');
    console.error('2. 프로젝트 선택');
    console.error('3. Database > SQL Editor로 이동');
    console.error('4. database/setup.sql 파일의 내용을 복사하여 실행\n');
  }
}

openSupabaseDashboard();

