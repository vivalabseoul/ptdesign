# Supabase 데이터베이스 설정 실행 가이드

## 🚀 빠른 실행 방법

Supabase 클라이언트 라이브러리는 테이블 생성이나 RLS 정책 설정 같은 DDL 작업을 지원하지 않습니다.
따라서 **Supabase Dashboard의 SQL Editor**에서 직접 SQL을 실행해야 합니다.

## 📋 단계별 실행 가이드

### 1. Supabase Dashboard 접속

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 로그인

2. **프로젝트 선택**
   - 프로젝트 ID: `nbyihpfzzkluqfwexsvh`
   - 프로젝트 선택

### 2. SQL Editor로 이동

1. **왼쪽 메뉴에서 Database 클릭**
2. **SQL Editor 클릭**
3. **New query 클릭**

### 3. SQL 스크립트 실행

1. **`database/setup.sql` 파일 열기**
   - 프로젝트 폴더에서 `database/setup.sql` 파일 열기
   - 전체 내용 복사 (Ctrl+A, Ctrl+C)

2. **SQL Editor에 붙여넣기**
   - SQL Editor에 붙여넣기 (Ctrl+V)

3. **RUN 버튼 클릭**
   - 오른쪽 상단의 **RUN** 버튼 클릭
   - 또는 Ctrl+Enter

4. **결과 확인**
   - 모든 SQL 문이 성공적으로 실행되었는지 확인
   - 오류가 있으면 오류 메시지 확인

### 4. 테이블 확인

1. **Table Editor로 이동**
   - 왼쪽 메뉴에서 **Database** > **Table Editor** 클릭

2. **테이블 확인**
   - 다음 테이블이 생성되었는지 확인:
     - ✅ `users`
     - ✅ `analyses`
     - ✅ `payments` (선택사항)

### 5. RLS 정책 확인

1. **각 테이블 선택**
   - `users` 테이블 클릭
   - `analyses` 테이블 클릭
   - `payments` 테이블 클릭 (선택사항)

2. **Policies 탭 확인**
   - 각 테이블의 **Policies** 탭 클릭
   - 다음 정책이 설정되었는지 확인:
     - ✅ `Users can view own profile` (users)
     - ✅ `Users can update own profile` (users)
     - ✅ `Admins can view all users` (users)
     - ✅ `Users can view own analyses` (analyses)
     - ✅ `Users can insert own analyses` (analyses)
     - ✅ `Admins can view all analyses` (analyses)

### 6. 트리거 확인

1. **Database > Functions로 이동**
2. **다음 함수 확인:**
   - ✅ `handle_new_user()` - 사용자 프로필 자동 생성
   - ✅ `handle_updated_at()` - updated_at 자동 업데이트

3. **Database > Triggers로 이동**
4. **다음 트리거 확인:**
   - ✅ `on_auth_user_created` - auth.users에 사용자 생성 시 users 테이블에 프로필 생성
   - ✅ `update_users_updated_at` - users 테이블 업데이트 시 updated_at 업데이트
   - ✅ `update_analyses_updated_at` - analyses 테이블 업데이트 시 updated_at 업데이트
   - ✅ `update_payments_updated_at` - payments 테이블 업데이트 시 updated_at 업데이트

## 🔍 데이터베이스 상태 확인

로컬에서 데이터베이스 상태를 확인하려면:

```bash
npm run check-db
```

이 명령어는 다음을 확인합니다:
- ✅ `users` 테이블 존재 여부
- ✅ `analyses` 테이블 존재 여부
- ✅ `payments` 테이블 존재 여부 (선택사항)

## ✅ 설정 완료 확인

설정이 완료되면 다음을 확인하세요:

1. **테이블 생성 확인**
   - Table Editor에서 테이블 확인
   - 모든 테이블이 생성되었는지 확인

2. **RLS 정책 확인**
   - 각 테이블의 Policies 탭에서 정책 확인
   - 모든 정책이 설정되었는지 확인

3. **트리거 확인**
   - Database > Triggers에서 트리거 확인
   - 모든 트리거가 설정되었는지 확인

4. **인증 테스트**
   - 개발 서버 실행: `npm run dev`
   - 회원가입 페이지 접속: `http://localhost:3000/signup`
   - 회원가입 완료
   - `users` 테이블에 레코드 생성 확인

## 🐛 문제 해결

### 테이블이 생성되지 않음

**해결 방법:**
1. SQL Editor에서 오류 메시지 확인
2. 각 SQL 문을 개별적으로 실행
3. 오류가 있는 SQL 문 수정 후 재실행

### RLS 정책 오류

**해결 방법:**
1. Policies 탭에서 정책 확인
2. 정책이 올바르게 설정되었는지 확인
3. 필요시 정책 재생성

### 트리거 오류

**해결 방법:**
1. Functions 탭에서 함수 확인
2. Triggers 탭에서 트리거 확인
3. 필요시 함수 및 트리거 재생성

### 사용자 프로필 생성 안 됨

**해결 방법:**
1. `handle_new_user()` 함수 확인
2. `on_auth_user_created` 트리거 확인
3. 필요시 함수 및 트리거 재생성

## 📚 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Supabase SQL Editor 가이드](https://supabase.com/docs/guides/database/tables)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Triggers 가이드](https://supabase.com/docs/guides/database/triggers)

## ⚠️ 주의사항

1. **프로덕션 환경**: RLS 정책을 반드시 활성화하세요.
2. **백업**: 데이터베이스 설정 전에 백업을 수행하세요.
3. **테스트**: 설정 후 반드시 테스트를 수행하세요.
4. **모니터링**: Supabase Dashboard에서 오류를 모니터링하세요.

## 🎉 완료!

설정이 완료되면 다음을 테스트하세요:

1. ✅ 회원가입 테스트
2. ✅ 로그인 테스트
3. ✅ 분석 기록 저장 테스트
4. ✅ 관리자 대시보드 테스트

문제가 있으면 `npm run check-db`를 실행하여 상태를 확인하세요.

