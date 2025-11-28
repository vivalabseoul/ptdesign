# Vercel 배포 가이드

## 🚀 Vercel 배포 단계

### 1. GitHub 저장소 준비

1. **Git 저장소 초기화 (아직 안 했다면)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```

2. **GitHub에 저장소 생성**
   - [GitHub](https://github.com) 접속
   - New repository 클릭
   - 저장소 이름 입력 (예: `protouchdesign`)
   - Public 또는 Private 선택
   - Create repository 클릭

3. **로컬 저장소를 GitHub에 푸시**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Vercel 배포

1. **Vercel 가입**
   - [Vercel](https://vercel.com) 접속
   - "Sign Up" 클릭
   - GitHub 계정으로 로그인 (권장)

2. **프로젝트 Import**
   - Vercel 대시보드에서 "Add New..." → "Project" 클릭
   - "Import Git Repository" 선택
   - GitHub 저장소 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: `Vite` (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 감지됨)
   - **Output Directory**: `dist` (자동 감지됨)
   - **Install Command**: `npm install` (기본값)

4. **환경 변수 설정 (선택사항)**
   - Environment Variables 섹션에서 추가:
     - `VITE_TOSS_CLIENT_KEY`: Toss Payments 클라이언트 키 (프로덕션 키 사용)
   - 각 환경별로 설정 가능:
     - Production
     - Preview
     - Development

5. **Deploy 클릭**
   - 배포가 자동으로 시작됩니다
   - 약 1-2분 소요

### 3. 배포 후 확인

1. **배포 완료 후**
   - 자동으로 `https://your-project-name.vercel.app` URL 생성
   - 이 URL로 접속하여 사이트 확인

2. **커스텀 도메인 연결 (선택사항)**
   - Project Settings → Domains
   - 원하는 도메인 입력
   - DNS 설정 안내 따르기

### 4. Supabase 설정

1. **Supabase Dashboard 접속**
   - [Supabase Dashboard](https://app.supabase.com)

2. **Authentication → URL Configuration**
   - Site URL에 Vercel URL 추가: `https://your-project-name.vercel.app`
   - Redirect URLs에 추가:
     - `https://your-project-name.vercel.app/**`
     - `https://your-project-name.vercel.app/auth/callback`

3. **RLS 정책 확인**
   - Database → Policies에서 모든 정책이 활성화되어 있는지 확인

### 5. Toss Payments 설정

1. **Toss Payments Dashboard 접속**
   - [Toss Payments](https://www.toss.im/payments) 접속

2. **결제 성공/실패 URL 설정**
   - 결제 성공 URL: `https://your-project-name.vercel.app/payment/success`
   - 결제 실패 URL: `https://your-project-name.vercel.app/payment/fail`

3. **프로덕션 키 발급**
   - 테스트 키 대신 프로덕션 키 사용
   - Vercel 환경 변수에 프로덕션 키 설정

## 🔄 자동 배포 설정

Vercel은 GitHub에 푸시할 때마다 자동으로 배포됩니다:

1. **로컬에서 코드 수정**
2. **Git에 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. **Vercel이 자동으로 배포 시작**
4. **배포 완료 후 자동으로 업데이트**

## 📝 주의사항

1. **환경 변수**
   - `.env` 파일은 Git에 커밋하지 않음 (`.gitignore`에 포함됨)
   - Vercel 대시보드에서 환경 변수 직접 설정

2. **빌드 오류**
   - 배포 실패 시 Vercel 대시보드의 Deployments 탭에서 로그 확인
   - 로컬에서 `npm run build` 실행하여 오류 확인

3. **Supabase Edge Functions**
   - Supabase Functions는 별도로 배포 필요:
     ```bash
     supabase functions deploy server
     ```

## 🎉 완료!

배포가 완료되면 `https://your-project-name.vercel.app`에서 사이트를 확인할 수 있습니다!

