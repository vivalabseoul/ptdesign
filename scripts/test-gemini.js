/**
 * Gemini API 테스트 스크립트
 * 
 * 실행 방법:
 * 1. .env 파일에 VITE_GEMINI_API_KEY 설정
 * 2. 터미널에서: node scripts/test-gemini.js
 */

import { analyzeWebsite } from '../lib/gemini.ts';

async function testGeminiAPI() {
  console.log('🧪 Gemini API 테스트 시작...\n');
  
  const testUrl = 'https://www.google.com';
  console.log(`📊 테스트 URL: ${testUrl}\n`);
  
  try {
    console.log('⏳ 분석 중...');
    const result = await analyzeWebsite(testUrl);
    
    console.log('\n✅ 분석 성공!\n');
    console.log('📈 결과:');
    console.log(`- 총점: ${result.totalScore}/100`);
    console.log(`- 평가 항목 수: ${result.evaluationCriteria?.length || 0}`);
    console.log(`- 개선 사항 수: ${result.improvements?.length || 0}`);
    
    if (result.evaluationCriteria && result.evaluationCriteria.length > 0) {
      console.log('\n📋 평가 항목:');
      result.evaluationCriteria.forEach((criteria, index) => {
        console.log(`  ${index + 1}. ${criteria.category}: ${criteria.score}점`);
      });
    }
    
    console.log('\n✨ Gemini API가 정상적으로 작동합니다!');
    return true;
    
  } catch (error) {
    console.error('\n❌ 테스트 실패:');
    console.error(error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key')) {
      console.error('\n💡 해결 방법:');
      console.error('1. https://makersuite.google.com/app/apikey 에서 API 키 발급');
      console.error('2. .env 파일에 VITE_GEMINI_API_KEY=발급받은키 추가');
      console.error('3. 개발 서버 재시작');
    }
    
    return false;
  }
}

// 테스트 실행
testGeminiAPI()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('예상치 못한 오류:', error);
    process.exit(1);
  });
