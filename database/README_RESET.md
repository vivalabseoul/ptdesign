# 데이터베이스 완전 초기화 가이드

## ⚠️ 중요 경고

이 가이드는 **모든 테스트 데이터와 데모 데이터를 완전히 삭제**합니다.
실전 운영 전에만 사용하세요. **되돌릴 수 없습니다!**

---

## 📋 초기화 절차

### 1단계: 백업 (선택사항)

중요한 데이터가 있다면 먼저 백업하세요.

```sql
-- Supabase Dashboard > Database > Backups에서 수동 백업 생성
```

### 2단계: 관리자 계정 확인/생성

#### 2-1. 기존 관리자 계정 확인

Supabase SQL Editor에서 다음 쿼리를 실행하세요:

```sql
SELECT id, email, role, created_at
FROM public.users
WHERE role = 'admin'
ORDER BY created_at;
```

**결과가 있으면**: 3단계로 이동

**결과가 없으면**: 2-2단계로 이동

#### 2-2. 새로운 관리자 계정 생성

1. **Supabase Dashboard**로 이동

   - Authentication > Users 메뉴 선택
   - "Add User" 버튼 클릭

2. **사용자 정보 입력**

   - Email: `vivalabseoul@gmail.com` (또는 원하는 이메일)
   - Password: ptd123456&\*
   - "Create User" 클릭

3. **관리자 권한 부여**
   - `database/CREATE_ADMIN_ACCOUNT.sql` 파일을 엽니다
   - `admin_email` 변수를 생성한 이메일로 수정합니다:
     ```sql
     DECLARE
       admin_email TEXT := 'vivalabseoul@gmail.com'; -- 여기에 실제 이메일 입력
     ```
   - Supabase SQL Editor에서 전체 스크립트를 실행합니다

### 3단계: 완전 초기화 실행

1. **`database/COMPLETE_RESET.sql` 파일 열기**

2. **관리자 이메일 설정**

   - 5번째 줄 근처에 있는 `admin_email` 변수를 수정:
     ```sql
     DECLARE
       admin_email TEXT := 'vivalabseoul@gmail.com'; -- 남길 관리자 이메일 입력
     ```

3. **Supabase SQL Editor에서 실행**

   - Supabase Dashboard > SQL Editor로 이동
   - "New query" 클릭
   - `COMPLETE_RESET.sql`의 전체 내용을 복사하여 붙여넣기
   - "Run" 버튼 클릭

4. **결과 확인**
   - 실행 결과 로그에서 삭제된 데이터 수를 확인
   - 남은 사용자 계정 정보 확인
   - 테이블 상태 확인

---

## 📊 초기화 후 상태

### 삭제되는 데이터:

- ✅ 모든 분석 기록 (`analyses` 테이블)
- ✅ 모든 결제 기록 (`payments` 테이블)
- ✅ 관리자를 제외한 모든 사용자 계정
- ✅ 모든 테스트 및 데모 데이터

### 유지되는 데이터:

- ✅ 관리자 계정 1개
- ✅ 데이터베이스 스키마 (테이블 구조)
- ✅ RLS 정책
- ✅ 트리거 및 함수

---

## 🔍 초기화 후 확인 사항

### 1. 사용자 수 확인

```sql
SELECT COUNT(*) as total_users FROM public.users;
-- 결과: 1 (관리자만 남아있어야 함)
```

### 2. 관리자 계정 확인

```sql
SELECT email, role FROM public.users WHERE role = 'admin';
-- 결과: 설정한 관리자 이메일이 표시되어야 함
```

### 3. 분석 기록 확인

```sql
SELECT COUNT(*) as total_analyses FROM public.analyses;
-- 결과: 0 (모두 삭제되어야 함)
```

### 4. 결제 기록 확인

```sql
SELECT COUNT(*) as total_payments FROM public.payments;
-- 결과: 0 (모두 삭제되어야 함)
```

---

## 🚀 초기화 후 다음 단계

1. **관리자 계정으로 로그인 테스트**

   - 프론트엔드 애플리케이션에서 관리자 계정으로 로그인
   - 대시보드 접근 확인

2. **새로운 사용자 등록 테스트**

   - 신규 사용자 가입 프로세스 테스트
   - 사용자 권한이 올바르게 설정되는지 확인

3. **프로덕션 배포**
   - 모든 기능이 정상 작동하는지 확인 후 배포

---

## ❓ 문제 해결

### "관리자 계정을 찾을 수 없습니다" 오류

- 2단계로 돌아가서 관리자 계정을 먼저 생성하세요
- `admin_email` 변수가 실제 존재하는 계정의 이메일과 일치하는지 확인하세요

### 실행 권한 오류

- Supabase Dashboard의 SQL Editor를 사용하고 있는지 확인하세요
- 프로젝트 소유자 또는 관리자 권한이 있는지 확인하세요

### 데이터가 삭제되지 않음

- RLS 정책 때문에 직접 삭제가 안될 수 있습니다
- 제공된 SQL 스크립트는 RLS를 우회하여 삭제하므로 반드시 스크립트를 사용하세요

---

## 📞 지원

문제가 계속되면 Supabase 대시보드의 Logs를 확인하거나
프로젝트 관리자에게 문의하세요.

---

**최종 수정일**: 2025-12-06
