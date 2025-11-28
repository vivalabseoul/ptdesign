# Supabase 빠른 설정 가이드

## 🚀 빠른 시작

### 방법 1: Supabase Dashboard에서 직접 실행 (권장)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택 (projectId: `nbyihpfzzkluqfwexsvh`)

2. **SQL Editor로 이동**
   - 왼쪽 메뉴에서 **Database** 클릭
   - **SQL Editor** 클릭
   - **New query** 클릭

3. **SQL 스크립트 실행**
   - `database/setup.sql` 파일을 열어서 전체 내용 복사
   - SQL Editor에 붙여넣기
   - **RUN** 버튼 클릭
   - 모든 SQL 문이 성공적으로 실행되었는지 확인

4. **테이블 확인**
   - 왼쪽 메뉴에서 **Table Editor** 클릭
   - 다음 테이블이 생성되었는지 확인:
     - ✅ `users`
     - ✅ `analyses`
     - ✅ `payments` (선택사항)

5. **RLS 정책 확인**
   - 각 테이블을 클릭
   - **Policies** 탭에서 정책이 올바르게 설정되었는지 확인

### 방법 2: 데이터베이스 상태 확인

터미널에서 다음 명령어 실행:

```bash
npm run check-db
```

이 명령어는 데이터베이스 상태를 확인하고 다음을 체크합니다:
- ✅ `users` 테이블 존재 여부
- ✅ `analyses` 테이블 존재 여부
- ✅ `payments` 테이블 존재 여부 (선택사항)

### 방법 3: Supabase CLI 사용 (고급)

1. **Supabase CLI 설치**
   ```bash
   npm install -g supabase
   ```

2. **Supabase 로그인**
   ```bash
   supabase login
   ```

3. **프로젝트 연결**
   ```bash
   supabase link --project-ref nbyihpfzzkluqfwexsvh
   ```

4. **데이터베이스 마이그레이션 실행**
   ```bash
   supabase db push
   ```

## 🔐 Authentication 설정

### 1. Email Provider 활성화

1. **Supabase Dashboard 접속**
2. **Authentication** > **Providers**로 이동
3. **Email** provider 활성화
4. **Save** 클릭

### 2. Redirect URLs 설정

1. **Authentication** > **URL Configuration**으로 이동
2. **Site URL** 설정:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://your-domain.com`
3. **Redirect URLs** 추가:
   - `http://localhost:3000/**`
   - `https://your-domain.com/**`
4. **Save** 클릭

## 👤 관리자 계정 생성

### 방법 1: Supabase Dashboard에서

1. **Authentication** > **Users**로 이동
2. **Add user** 클릭
3. 이메일과 비밀번호 입력
4. **Create user** 클릭
5. **Database** > **Table Editor**로 이동
6. `users` 테이블 선택
7. 생성한 사용자의 `role`을 `admin`으로 변경

### 방법 2: SQL Editor에서

1. **Database** > **SQL Editor**로 이동
2. 다음 SQL 실행:

```sql
-- 먼저 Authentication > Users에서 관리자 계정 생성
-- 그 다음 다음 SQL 실행

UPDATE users
SET role = 'admin'
WHERE email = 'admin@protouch.design';
```

## ✅ 설정 확인

### 1. 데이터베이스 상태 확인

```bash
npm run check-db
```

### 2. 테이블 확인

Supabase Dashboard > Database > Table Editor에서 다음 테이블 확인:
- ✅ `users` - 사용자 정보
- ✅ `analyses` - 분석 기록
- ✅ `payments` - 결제 기록 (선택사항)

### 3. RLS 정책 확인

각 테이블의 **Policies** 탭에서 다음 정책 확인:
- ✅ `Users can view own profile` (users 테이블)
- ✅ `Users can view own analyses` (analyses 테이블)
- ✅ `Admins can view all analyses` (analyses 테이블)

### 4. 인증 테스트

1. 개발 서버 실행: `npm run dev`
2. 회원가입 페이지 접속: `http://localhost:3000/signup`
3. 회원가입 완료
4. `users` 테이블에 레코드 생성 확인

## 🐛 문제 해결

### 테이블이 존재하지 않음

**해결 방법:**
1. `database/setup.sql` 파일 확인
2. Supabase Dashboard > SQL Editor에서 SQL 실행
3. 오류 메시지 확인 및 수정

### RLS 정책 오류

**해결 방법:**
1. Supabase Dashboard > Database > Policies 확인
2. 정책이 올바르게 설정되었는지 확인
3. 필요시 정책 재생성

### 인증 오류

**해결 방법:**
1. Supabase Dashboard > Authentication > Providers 확인
2. Email provider 활성화 확인
3. Redirect URLs 설정 확인
4. 브라우저 콘솔에서 오류 확인

### 사용자 프로필 생성 안 됨

**해결 방법:**
1. `handle_new_user()` 함수 확인
2. 트리거가 올바르게 설정되었는지 확인
3. Supabase Dashboard > Database > Functions에서 함수 확인

## 📚 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Database 문서](https://supabase.com/docs/guides/database)

## ⚠️ 주의사항

1. **프로덕션 환경**: RLS 정책을 반드시 활성화하세요.
2. **비밀번호 정책**: Supabase Dashboard에서 비밀번호 정책 설정 가능
3. **이메일 인증**: 필요시 이메일 인증 활성화
4. **환경 변수**: 민감한 정보는 환경 변수로 관리
5. **백업**: 정기적으로 데이터베이스 백업 수행

## 🎉 완료!

설정이 완료되면 다음을 테스트하세요:

1. ✅ 회원가입 테스트
2. ✅ 로그인 테스트
3. ✅ 분석 기록 저장 테스트
4. ✅ 관리자 대시보드 테스트

문제가 있으면 `npm run check-db`를 실행하여 상태를 확인하세요.

