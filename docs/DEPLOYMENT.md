# Pro Touch Design - 배포 가이드

## 📦 배포 준비 상태

✅ **배포 가능**: 이 프로젝트는 정적 사이트로 빌드되어 모든 호스팅 플랫폼에 배포할 수 있습니다.

### 현재 프로젝트 상태
- ✅ Vite 빌드 설정 완료
- ✅ TypeScript 컴파일 설정 완료
- ✅ 정적 파일 생성 준비 완료
- ✅ Supabase 백엔드 연동 (환경 변수 필요 없음)

## 🚀 배포 옵션

### 1. Vercel (추천) ⭐

**장점:**
- 무료 플랜 제공
- GitHub 연동으로 자동 배포
- 전 세계 CDN으로 빠른 로딩
- 커스텀 도메인 지원
- SSL 인증서 자동 제공

**배포 방법:**

1. **GitHub에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Vercel 가입 및 배포**
   - [Vercel](https://vercel.com) 접속
   - "Import Project" 클릭
   - GitHub 저장소 선택
   - 빌드 설정 (자동 감지됨):
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - "Deploy" 클릭

3. **환경 변수 설정 (필요시)**
   - Vercel 대시보드 > Project Settings > Environment Variables
   - 현재는 Supabase 설정이 코드에 있으므로 추가 설정 불필요

**배포 후:**
- 자동으로 `https://your-project.vercel.app` URL 생성
- 커스텀 도메인 연결 가능

---

### 2. Netlify

**장점:**
- 무료 플랜 제공
- GitHub 연동으로 자동 배포
- 폼 처리 기능
- CDN 제공

**배포 방법:**

1. **GitHub에 코드 푸시** (위와 동일)

2. **Netlify 가입 및 배포**
   - [Netlify](https://www.netlify.com) 접속
   - "Add new site" > "Import an existing project"
   - GitHub 저장소 선택
   - 빌드 설정:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - "Deploy site" 클릭

3. **배포 후 설정**
   - Site settings > Build & deploy > Continuous Deployment
   - 커스텀 도메인 연결 가능

---

### 3. Cloudflare Pages

**장점:**
- 무료 플랜 제공
- 매우 빠른 CDN
- 무제한 대역폭
- GitHub 연동

**배포 방법:**

1. **GitHub에 코드 푸시** (위와 동일)

2. **Cloudflare Pages 배포**
   - [Cloudflare Pages](https://pages.cloudflare.com) 접속
   - "Create a project" 클릭
   - GitHub 저장소 선택
   - 빌드 설정:
     - Framework preset: `Vite`
     - Build command: `npm run build`
     - Build output directory: `dist`
   - "Save and Deploy" 클릭

---

### 4. GitHub Pages

**장점:**
- 완전 무료
- GitHub과 통합
- 커스텀 도메인 지원

**배포 방법:**

1. **Vite 설정 수정**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import path from 'path'
   import { fileURLToPath } from 'url'

   const __dirname = path.dirname(fileURLToPath(import.meta.url))

   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // GitHub 저장소 이름으로 변경
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './'),
       },
     },
     optimizeDeps: {
       include: ['html2pdf.js'],
     },
     server: {
       port: 3000,
       open: true,
     },
   })
   ```

2. **GitHub Actions 워크플로우 생성**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
         
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **GitHub 저장소 설정**
   - Settings > Pages
   - Source: `gh-pages` 브랜치 선택
   - Save

---

### 5. 일반 호스팅 (cPanel, FTP 등)

**장점:**
- 기존 호스팅 계정 활용
- 완전한 제어 가능

**배포 방법:**

1. **로컬에서 빌드**
   ```bash
   npm run build
   ```

2. **빌드 파일 확인**
   - `dist` 폴더에 빌드된 파일 생성
   - `dist/index.html` 파일 확인

3. **FTP로 업로드**
   - FTP 클라이언트 사용 (FileZilla, WinSCP 등)
   - `dist` 폴더의 모든 파일을 호스팅의 `public_html` 또는 `www` 폴더에 업로드

4. **설정 확인**
   - `index.html`이 루트 디렉토리에 있는지 확인
   - 모든 파일이 업로드되었는지 확인

**주의사항:**
- SPA(Single Page Application)이므로 서버 설정이 필요할 수 있음
- 모든 경로를 `index.html`로 리다이렉트해야 함
- `.htaccess` 파일 생성 (Apache):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🔧 배포 전 체크리스트

### 1. 빌드 테스트
```bash
npm run build
npm run preview
```
- 빌드가 성공적으로 완료되는지 확인
- 로컬에서 빌드된 사이트가 정상 작동하는지 확인

### 2. 환경 확인
- [ ] Supabase 설정이 올바른지 확인 (`utils/supabase/info.tsx`)
- [ ] API 엔드포인트가 올바른지 확인
- [ ] CORS 설정이 올바른지 확인

### 3. 성능 최적화
- [ ] 이미지 최적화 확인
- [ ] 번들 크기 확인
- [ ] 불필요한 의존성 제거

### 4. 보안 확인
- [ ] API 키가 안전하게 관리되는지 확인
- [ ] 민감한 정보가 코드에 하드코딩되지 않았는지 확인

---

## 📝 배포 후 확인 사항

### 1. 기본 기능 테스트
- [ ] 사이트가 정상적으로 로드되는지 확인
- [ ] Hero 섹션이 정상 표시되는지 확인
- [ ] 폼 제출이 정상 작동하는지 확인
- [ ] API 호출이 정상 작동하는지 확인

### 2. 반응형 디자인 테스트
- [ ] 모바일 화면에서 정상 표시되는지 확인
- [ ] 태블릿 화면에서 정상 표시되는지 확인
- [ ] 데스크톱 화면에서 정상 표시되는지 확인

### 3. 성능 테스트
- [ ] 페이지 로딩 속도 확인
- [ ] 이미지 로딩 속도 확인
- [ ] API 응답 시간 확인

### 4. SEO 확인
- [ ] 메타 태그가 올바르게 설정되어 있는지 확인
- [ ] 사이트맵이 있는지 확인 (필요시)
- [ ] robots.txt가 있는지 확인 (필요시)

---

## 🌐 커스텀 도메인 연결

### Vercel
1. Project Settings > Domains
2. 도메인 추가
3. DNS 설정 안내 따르기

### Netlify
1. Site settings > Domain management
2. Add custom domain
3. DNS 설정 안내 따르기

### Cloudflare Pages
1. Custom domains
2. Set up a custom domain
3. DNS 설정 안내 따르기

### GitHub Pages
1. Repository Settings > Pages
2. Custom domain 입력
3. DNS 설정 안내 따르기

---

## 🔄 지속적인 배포 (CI/CD)

### GitHub Actions 예시
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run preview
```

---

## 🐛 문제 해결

### 빌드 실패
- Node.js 버전 확인 (18.0 이상)
- 의존성 재설치: `rm -rf node_modules && npm install`
- 타입 오류 확인: `npm run build` 실행

### 배포 후 404 오류
- SPA 라우팅 설정 확인
- 서버 설정 확인 (`.htaccess` 등)
- base 경로 설정 확인

### API 호출 실패
- CORS 설정 확인
- Supabase 설정 확인
- 네트워크 요청 확인 (브라우저 개발자 도구)

### 스타일이 적용되지 않음
- CSS 파일 경로 확인
- Tailwind CSS 빌드 확인
- 캐시 클리어

---

## 📚 추가 리소스

- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [Vercel 문서](https://vercel.com/docs)
- [Netlify 문서](https://docs.netlify.com)
- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages)
- [GitHub Pages 문서](https://docs.github.com/pages)

---

## 💡 추천 배포 플랫폼

1. **Vercel** - 가장 추천 ⭐⭐⭐⭐⭐
   - 설정이 가장 쉬움
   - 자동 배포
   - 빠른 CDN
   - 무료 플랜 충분

2. **Netlify** - 추천 ⭐⭐⭐⭐
   - Vercel과 유사
   - 폼 처리 기능
   - 무료 플랜 충분

3. **Cloudflare Pages** - 추천 ⭐⭐⭐⭐
   - 매우 빠른 속도
   - 무제한 대역폭
   - 무료 플랜 충분

4. **GitHub Pages** - 적합 ⭐⭐⭐
   - 완전 무료
   - 설정이 조금 더 필요

5. **일반 호스팅** - 적합 ⭐⭐
   - 기존 호스팅 활용
   - 수동 업로드 필요

---

## ✅ 빠른 배포 가이드 (Vercel)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com) 가입
3. "Import Project" 클릭
4. GitHub 저장소 선택
5. "Deploy" 클릭
6. 완료! 🎉

---

**문의사항이 있으면 이슈를 생성하거나 문서를 참고하세요.**

