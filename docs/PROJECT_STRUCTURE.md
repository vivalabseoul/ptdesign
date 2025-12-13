# 프로젝트 정리 완료

## 정리된 폴더 구조

### 📁 docs/
문서 파일들을 모아둔 폴더
- `GEMINI_API_SETUP.md` - Gemini API 설정 가이드

### 📁 scripts/
스크립트 파일들을 모아둔 폴더
- `clear-test-data.js` - 테스트 데이터 삭제 스크립트
- `test-gemini.js` - Gemini API 테스트 스크립트

## 프로젝트 루트 파일 (유지)

### 설정 파일 (루트에 유지 필수)
- `package.json` - 프로젝트 의존성
- `tsconfig.json` - TypeScript 설정
- `tsconfig.app.json` - 앱 TypeScript 설정
- `tsconfig.node.json` - Node TypeScript 설정
- `vite.config.ts` - Vite 빌드 설정
- `tailwind.config.js` - Tailwind CSS 설정
- `postcss.config.js` - PostCSS 설정
- `eslint.config.js` - ESLint 설정
- `.env` - 환경 변수
- `.gitignore` - Git 무시 파일

### 배포 설정
- `netlify.toml` - Netlify 배포 설정
- `vercel.json` - Vercel 배포 설정
- `_redirects` - 리다이렉트 규칙

### 엔트리 파일
- `index.html` - HTML 엔트리
- `main.tsx` - React 엔트리
- `App.tsx` - 메인 앱 컴포넌트

## 정리 결과

✅ 문서 파일 → `docs/` 폴더로 이동
✅ 스크립트 파일 → `scripts/` 폴더로 이동
✅ 설정 파일 → 루트에 유지 (프로젝트 작동에 필수)
✅ 깔끔한 프로젝트 구조 완성
