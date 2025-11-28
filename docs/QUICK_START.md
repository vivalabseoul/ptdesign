# 🚀 빠른 시작 가이드

## 📋 현재 상태

✅ **코드 구현 완료**: 인증 시스템, 라우팅, 대시보드, 결제 시스템 준비 완료
❌ **데이터베이스 설정 필요**: Supabase Dashboard에서 SQL 실행 필요

## ⚡ 3단계로 시작하기

### 1단계: Supabase Dashboard에서 SQL 실행 (5분)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택 (projectId: `nbyihpfzzkluqfwexsvh`)

2. **SQL Editor로 이동**
   - Database > SQL Editor > New query

3. **SQL 실행**
   - `database/setup.sql` 파일의 **전체 내용 복사**
   - SQL Editor에 붙여넣기
   - **RUN** 버튼 클릭

4. **결과 확인**
   - 모든 SQL 문이 성공적으로 실행되었는지 확인
   - Table Editor에서 테이블 생성 확인

### 2단계: Authentication 설정 (2분)

1. **Email Provider 활성화**
   - Authentication > Providers > Email 활성화

2. **Redirect URLs 설정**
   - Authentication > URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

### 3단계: 테스트 (3분)

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **회원가입 테스트**
   - http://localhost:3000/signup 접속
   - 회원가입 완료
   - 대시보드로 리다이렉트 확인

3. **데이터베이스 확인**
   ```bash
   npm run check-db
   ```

## 📝 실행할 SQL (복사해서 사용)

`database/setup.sql` 파일의 전체 내용을 복사하여 Supabase SQL Editor에서 실행하세요.

또는 `SUPABASE_SETUP_STEPS.md` 파일에서 SQL 스크립트를 확인하세요.

## ✅ 설정 확인

### 로컬에서 확인

```bash
npm run check-db
```

예상 결과:
- ✅ `users` 테이블이 존재합니다
- ✅ `analyses` 테이블이 존재합니다

### Supabase Dashboard에서 확인

1. **Table Editor**: 테이블 생성 확인
2. **Policies**: RLS 정책 설정 확인
3. **Functions**: 함수 생성 확인
4. **Triggers**: 트리거 생성 확인

## 🎯 다음 단계

1. **관리자 계정 생성**
   - Authentication > Users에서 관리자 계정 생성
   - Database > Table Editor > users에서 `role`을 `admin`으로 변경

2. **테스트**
   - 회원가입/로그인 테스트
   - 분석 기록 저장 테스트
   - 관리자 대시보드 테스트

## 📚 상세 가이드

- [SUPABASE_SETUP_STEPS.md](./SUPABASE_SETUP_STEPS.md) - 단계별 설정 가이드
- [SUPABASE_QUICK_SETUP.md](./SUPABASE_QUICK_SETUP.md) - 빠른 설정 가이드
- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - 인증 설정 가이드
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - 구현 가이드

## 🐛 문제 해결

### SQL 실행 오류

- SQL Editor에서 오류 메시지 확인
- 각 SQL 문을 개별적으로 실행
- 오류가 있는 SQL 문 수정 후 재실행

### 테이블이 생성되지 않음

- SQL Editor에서 오류 메시지 확인
- Table Editor에서 테이블 존재 확인
- 필요시 SQL 재실행

### RLS 정책 오류

- Policies 탭에서 정책 확인
- 필요시 정책 재생성

## 🎉 완료!

설정이 완료되면 다음을 테스트하세요:

1. ✅ 회원가입 테스트
2. ✅ 로그인 테스트
3. ✅ 분석 기록 저장 테스트
4. ✅ 관리자 대시보드 테스트

문제가 있으면 `npm run check-db`를 실행하여 상태를 확인하세요.

