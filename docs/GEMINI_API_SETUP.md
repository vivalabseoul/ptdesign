# Google Gemini API 설정 가이드

## 1. API 키 발급

1. Google AI Studio 방문: https://makersuite.google.com/app/apikey
2. Google 계정으로 로그인
3. "Create API Key" 버튼 클릭
4. API 키 복사

## 2. 환경 변수 설정

`.env` 파일을 열고 다음 내용을 추가하세요:

```
VITE_GEMINI_API_KEY=여기에_발급받은_API_키_붙여넣기
```

예시:
```
VITE_GEMINI_API_KEY=AIzaSyABC123def456GHI789jkl012MNO345pqr
```

## 3. 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작하세요:

```bash
# Ctrl+C로 서버 중지 후
npm run dev
```

## 4. 무료 사용량

- **분당 요청**: 15회
- **일일 요청**: 1,500회
- **비용**: 완전 무료

## 5. 주의사항

⚠️ API 키는 절대 GitHub에 커밋하지 마세요!
✅ `.env` 파일은 `.gitignore`에 포함되어 있습니다.

## 문제 해결

### API 키 오류
- API 키가 올바르게 복사되었는지 확인
- `.env` 파일 이름이 정확한지 확인 (`.env.example`이 아님)
- 개발 서버를 재시작했는지 확인

### 사용량 초과
- 잠시 후 다시 시도
- 무료 티어는 분당 15회로 제한됨
