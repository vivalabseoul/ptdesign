# Supabase 설정 자동화 가이드

## ⚠️ 중요 안내

Supabase 클라이언트 라이브러리는 **테이블 생성, RLS 정책 설정 등의 DDL 작업을 지원하지 않습니다**.
이러한 작업은 Supabase Dashboard의 SQL Editor에서 직접 실행해야 합니다.

## 🚀 자동화된 설정 방법

### 방법 1: Supabase Dashboard에서 직접 실행 (가장 간단)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **SQL Editor로 이동**
   - Database > SQL Editor
   - New query 클릭

3. **SQL 스크립트 실행**
   - `database/setup.sql` 파일의 전체 내용을 복사
   - SQL Editor에 붙여넣기
   - **RUN** 버튼 클릭

4. **결과 확인**
   - 모든 SQL 문이 성공적으로 실행되었는지 확인
   - Table Editor에서 테이블 생성 확인

### 방법 2: 데이터베이스 상태 확인 스크립트

```bash
npm run check-db
```

이 스크립트는 다음을 확인합니다:
- ✅ 테이블 존재 여부
- ✅ RLS 정책 설정 여부
- ✅ 기본 설정 상태

### 방법 3: 수동 설정 (단계별)

각 테이블과 정책을 수동으로 생성할 수 있습니다.
자세한 내용은 `SUPABASE_SETUP.md` 파일을 참고하세요.

## 📋 설정 체크리스트

### 데이터베이스 설정
- [ ] `users` 테이블 생성
- [ ] `analyses` 테이블 생성
- [ ] `payments` 테이블 생성 (선택사항)
- [ ] RLS 정책 설정
- [ ] 인덱스 생성
- [ ] 트리거 설정

### Authentication 설정
- [ ] Email provider 활성화
- [ ] Redirect URLs 설정
- [ ] Site URL 설정

### 관리자 계정
- [ ] 관리자 계정 생성
- [ ] 관리자 역할 부여

## 🎯 다음 단계

설정이 완료되면:

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **회원가입 테스트**
   - http://localhost:3000/signup 접속
   - 회원가입 완료
   - `users` 테이블에 레코드 생성 확인

3. **로그인 테스트**
   - http://localhost:3000/login 접속
   - 로그인 완료
   - 대시보드로 리다이렉트 확인

4. **분석 기록 테스트**
   - 분석 실행
   - `analyses` 테이블에 레코드 생성 확인
   - 대시보드에서 분석 기록 확인

## 📚 참고 문서

- [SUPABASE_QUICK_SETUP.md](./SUPABASE_QUICK_SETUP.md) - 빠른 설정 가이드
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - 상세 설정 가이드
- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - 인증 설정 가이드
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - 구현 가이드

