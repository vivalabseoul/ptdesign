/**
 * 테스트 데이터 초기화 스크립트
 * 
 * 브라우저 콘솔에서 실행하여 모든 테스트 데이터를 삭제합니다.
 */

// 1. 로컬 스토리지 완전 초기화
console.log('🗑️ 로컬 스토리지 초기화 중...');
localStorage.clear();
console.log('✅ 로컬 스토리지 초기화 완료');

// 2. 세션 스토리지 초기화
console.log('🗑️ 세션 스토리지 초기화 중...');
sessionStorage.clear();
console.log('✅ 세션 스토리지 초기화 완료');

// 3. 쿠키 삭제 (있는 경우)
console.log('🗑️ 쿠키 삭제 중...');
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('✅ 쿠키 삭제 완료');

console.log('\n✨ 모든 테스트 데이터가 삭제되었습니다!');
console.log('페이지를 새로고침하세요: window.location.reload()');
