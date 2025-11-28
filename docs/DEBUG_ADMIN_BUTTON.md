# 관리자 버튼이 안 보이는 문제 해결 가이드

## 🔍 디버깅 단계

### 1단계: 브라우저 콘솔 확인

1. **브라우저 개발자 도구 열기**: `F12` 또는 `Ctrl + Shift + I`
2. **Console 탭 확인**: 다음 로그 메시지들을 확인하세요

```
🔍 Loading user profile for userId: [사용자 ID]
✅ User profile loaded: { ... }
👤 User role: [역할]
🔐 Is admin? [true/false]
🔍 AuthContext - appUser: { ... }
🔍 AuthContext - role: [역할]
🔍 AuthContext - isAdmin: [true/false]
🔍 Navbar - isAuthenticated: [true/false]
🔍 Navbar - isAdmin: [true/false]
🔍 Navbar - appUser: { ... }
🔍 Navbar - appUser?.role: [역할]
```

### 2단계: 확인 사항

#### ✅ 정상적인 경우
- `User role: admin`이 표시되어야 합니다
- `Is admin? true`가 표시되어야 합니다
- `AuthContext - isAdmin: true`가 표시되어야 합니다
- `Navbar - isAdmin: true`가 표시되어야 합니다

#### ❌ 문제가 있는 경우

##### 문제 1: `User role: user`가 표시되는 경우
- **원인**: 데이터베이스에서 관리자 권한이 설정되지 않았습니다
- **해결**: 
  1. Supabase Dashboard에서 `users` 테이블 확인
  2. `role` 컬럼이 `'admin'`인지 확인
  3. 아니면 SQL로 업데이트:
     ```sql
     UPDATE users
     SET role = 'admin'
     WHERE email = 'your-email@example.com';
     ```
  4. **로그아웃 후 재로그인**

##### 문제 2: `Error loading user profile`이 표시되는 경우
- **원인**: RLS 정책 문제 또는 사용자 정보가 없습니다
- **해결**:
  1. Supabase Dashboard에서 `users` 테이블 확인
  2. 사용자 정보가 있는지 확인
  3. RLS 정책이 올바르게 설정되었는지 확인

##### 문제 3: `appUser is null`이 표시되는 경우
- **원인**: 사용자 프로필이 로드되지 않았습니다
- **해결**:
  1. 로그아웃 후 재로그인
  2. 브라우저 새로고침: `Ctrl + F5`
  3. 세션 확인

### 3단계: 로그아웃 후 재로그인

**중요**: 데이터베이스에서 관리자 권한을 변경한 후에는 반드시 로그아웃 후 재로그인해야 합니다.

1. **로그아웃**: 애플리케이션에서 로그아웃
2. **재로그인**: 같은 계정으로 재로그인
3. **콘솔 확인**: 관리자 권한이 제대로 로드되었는지 확인

### 4단계: 데이터베이스 확인

Supabase Dashboard에서 직접 확인:

```sql
-- 현재 사용자 확인
SELECT 
  id,
  email,
  role,
  created_at
FROM users
WHERE email = 'your-email@example.com';

-- 관리자 권한 확인
SELECT 
  id,
  email,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ 관리자'
    ELSE '❌ 일반 사용자'
  END AS status
FROM users
WHERE role = 'admin';
```

## 🚀 빠른 해결 방법

### 방법 1: 로그아웃 후 재로그인

1. 애플리케이션에서 로그아웃
2. 재로그인
3. 브라우저 새로고침: `Ctrl + F5`

### 방법 2: 데이터베이스에서 권한 확인 및 수정

1. Supabase Dashboard 접속
2. Database > Table Editor에서 `users` 테이블 확인
3. `role` 컬럼이 `'admin'`인지 확인
4. 아니면 SQL로 업데이트:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```
5. 로그아웃 후 재로그인

### 방법 3: 브라우저 캐시 지우기

1. 브라우저 개발자 도구 열기: `F12`
2. Network 탭에서 "Disable cache" 체크
3. 페이지 새로고침: `Ctrl + F5`

## 🔧 추가 디버깅

### 임시로 관리자 버튼 강제 표시 (테스트용)

개발 중에 테스트하려면 `components/Navbar.tsx`에서 임시로 강제 표시:

```tsx
{/* 임시 테스트용 */}
{(isAdmin || true) && (
  <Button>관리자</Button>
)}
```

**주의**: 테스트 후 반드시 원래대로 되돌리세요!

## 📋 체크리스트

- [ ] 데이터베이스에서 `role = 'admin'`인지 확인
- [ ] 로그아웃 후 재로그인
- [ ] 브라우저 콘솔에서 관리자 권한 확인
- [ ] 브라우저 새로고침: `Ctrl + F5`
- [ ] 세션이 제대로 로드되었는지 확인
- [ ] RLS 정책이 올바르게 설정되었는지 확인

## ⚠️ 주의사항

1. **세션 업데이트**: 데이터베이스에서 권한을 변경한 후에는 반드시 로그아웃 후 재로그인해야 합니다
2. **RLS 정책**: 관리자 권한이 제대로 작동하려면 RLS 정책이 올바르게 설정되어 있어야 합니다
3. **캐시**: 브라우저 캐시가 문제일 수 있으므로 `Ctrl + F5`로 새로고침하세요

