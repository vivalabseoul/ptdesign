# 🚀 시작하기 - Supabase 데이터베이스 설정

## ⚡ 빠른 시작 (3단계)

### 1단계: Supabase Dashboard 열기

터미널에서 다음 명령어 실행:

```bash
npm run open-supabase
```

이 명령어는 브라우저에서 Supabase Dashboard를 자동으로 열어줍니다.

**또는 수동으로:**
- 브라우저에서 https://supabase.com/dashboard 접속
- 프로젝트 선택 (projectId: `nbyihpfzzkluqfwexsvh`)

### 2단계: SQL Editor에서 SQL 실행

1. **SQL Editor로 이동**
   - Database > SQL Editor
   - New query 클릭

2. **SQL 스크립트 복사 및 실행**
   - `database/setup.sql` 파일을 열어서 **전체 내용 복사** (Ctrl+A, Ctrl+C)
   - SQL Editor에 **붙여넣기** (Ctrl+V)
   - **RUN** 버튼 클릭 (또는 Ctrl+Enter)

3. **결과 확인**
   - 모든 SQL 문이 성공적으로 실행되었는지 확인
   - 오류가 있으면 오류 메시지 확인

### 3단계: 설정 확인

로컬에서 확인:

```bash
npm run check-db
```

예상 결과:
- ✅ `users` 테이블이 존재합니다
- ✅ `analyses` 테이블이 존재합니다
- ✅ `payments` 테이블이 존재합니다 (선택사항)

## 📋 실행할 SQL

`database/setup.sql` 파일의 **전체 내용**을 복사하여 Supabase SQL Editor에서 실행하세요.

**파일 위치**: `database/setup.sql`

## ✅ 다음 단계

### 1. Authentication 설정

1. **Email Provider 활성화**
   - Authentication > Providers > Email 활성화

2. **Redirect URLs 설정**
   - Authentication > URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

### 2. 관리자 계정 생성

1. **Authentication > Users에서 관리자 계정 생성**
2. **Database > Table Editor > users에서 `role`을 `admin`으로 변경**

### 3. 테스트

1. 개발 서버 실행: `npm run dev`
2. 회원가입 테스트: http://localhost:3000/signup
3. 로그인 테스트: http://localhost:3000/login

## 🐛 문제 해결

### SQL 실행 오류

- SQL Editor에서 오류 메시지 확인
- 각 SQL 문을 개별적으로 실행
- 오류가 있는 SQL 문 수정 후 재실행

### 테이블이 생성되지 않음

- SQL Editor에서 오류 메시지 확인
- Table Editor에서 테이블 존재 확인
- 필요시 SQL 재실행

## 📚 상세 가이드

- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - 설정 가이드
- [SUPABASE_SETUP_STEPS.md](./SUPABASE_SETUP_STEPS.md) - 단계별 가이드
- [QUICK_START.md](./QUICK_START.md) - 빠른 시작 가이드

## 🎉 완료!

설정이 완료되면 다음을 테스트하세요:

1. ✅ 회원가입 테스트
2. ✅ 로그인 테스트
3. ✅ 분석 기록 저장 테스트
4. ✅ 관리자 대시보드 테스트

문제가 있으면 `npm run check-db`를 실행하여 상태를 확인하세요.

