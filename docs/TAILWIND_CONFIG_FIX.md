# Tailwind CSS 경고 해결 가이드

## 문제
```
warn - Your `content` configuration includes a pattern which looks like it's accidentally matching all of `node_modules` and can cause serious performance issues.
warn - Pattern: `./**\*.ts`
```

## 해결 방법

### 1. tailwind.config.js 수정
`content` 설정을 구체적인 경로만 지정하도록 수정했습니다:

```javascript
content: [
  "./index.html",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./contexts/**/*.{js,ts,jsx,tsx}",
  "./utils/**/*.{js,ts,jsx,tsx}",
  "./App.tsx",
  "./main.tsx",
],
```

### 2. 개발 서버 재시작
경고가 사라지지 않으면 다음을 시도하세요:

1. 개발 서버 중지 (Ctrl+C)
2. 캐시 삭제 (선택사항)
   ```bash
   rm -rf node_modules/.vite
   ```
3. 개발 서버 재시작
   ```bash
   npm run dev
   ```

### 3. 확인
재시작 후 경고 메시지가 사라졌는지 확인하세요.

## 참고
- 이 경고는 성능에 영향을 줄 수 있지만, 기능에는 문제가 없습니다.
- `node_modules`를 스캔하면 빌드 시간이 느려질 수 있습니다.
- 구체적인 경로만 지정하면 성능이 개선됩니다.

