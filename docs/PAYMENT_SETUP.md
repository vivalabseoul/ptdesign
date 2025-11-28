# 토스페이먼츠 결제 시스템 설정 가이드

## 1. 토스페이먼츠 계정 생성 및 설정

### 1.1 계정 생성
1. [토스페이먼츠](https://www.toss.im/payments) 접속
2. 회원가입 및 사업자 정보 등록
3. 테스트 모드 활성화 (개발 단계)

### 1.2 클라이언트 키 발급
1. 토스페이먼츠 대시보드 > 개발 > 키 관리
2. **클라이언트 키** 복사 (테스트/운영 모드 각각 발급)

## 2. 환경 변수 설정

### 2.1 `.env` 파일 생성
프로젝트 루트에 `.env` 파일을 생성하고 다음을 추가:

```env
VITE_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxx
```

### 2.2 Supabase Edge Function 환경 변수 (결제 성공 후 처리)
Supabase Dashboard > Edge Functions > Environment Variables에서 설정:

```
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxx
```

## 3. 토스페이먼츠 SDK 설치

```bash
npm install @tosspayments/payment-sdk
```

## 4. 결제 플로우

### 4.1 결제 요청
1. 사용자가 플랜 선택
2. `PaymentButton` 또는 `PaymentGate` 컴포넌트에서 결제 요청
3. 토스페이먼츠 결제 위젯 열림

### 4.2 결제 완료
1. 결제 성공 시 `/payment/success`로 리다이렉트
2. `PaymentSuccess` 페이지에서 구독 상태 업데이트
3. 사용자 대시보드로 이동

### 4.3 결제 실패
1. 결제 실패 시 `/payment/fail`로 리다이렉트
2. 사용자에게 오류 메시지 표시

## 5. 구독 상태 관리

### 5.1 데이터베이스 업데이트
결제 성공 후 `users` 테이블의 다음 필드를 업데이트:
- `subscription_status`: `'active'`
- `subscription_plan`: `'basic'` | `'pro'` | `'enterprise'`

### 5.2 Supabase Edge Function 생성 (선택사항)
결제 성공 후 자동으로 구독 상태를 업데이트하려면:

```typescript
// supabase/functions/update-subscription/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { userId, planId, orderId } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { error } = await supabase
    .from("users")
    .update({
      subscription_status: "active",
      subscription_plan: planId,
    })
    .eq("id", userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

## 6. 콘텐츠 접근 제어

### 6.1 무료 사용자
- SEO 분석까지 무료로 확인 가능
- SEO 이후 섹션은 블러 처리 및 결제 안내 표시

### 6.2 유료 사용자
- 전체 분석 결과 확인 가능
- PDF 보고서 다운로드
- AI 작업 지침서 다운로드

## 7. 테스트

### 7.1 테스트 카드 정보
토스페이먼츠 테스트 모드에서 제공하는 테스트 카드 사용:
- 카드번호: `4242 4242 4242 4242`
- 유효기간: 미래 날짜
- CVC: 임의 3자리
- 비밀번호: 임의 4자리

### 7.2 테스트 시나리오
1. 무료 회원가입 → SEO까지 확인 가능
2. 결제 진행 → 전체 결과 확인 가능
3. 결제 취소 → 오류 페이지 표시

## 8. 운영 모드 전환

1. 토스페이먼츠 대시보드에서 운영 모드 활성화
2. 운영 모드 클라이언트 키로 환경 변수 업데이트
3. 실제 결제 테스트 진행

## 참고 자료

- [토스페이먼츠 개발자 문서](https://docs.toss.im/payments)
- [토스페이먼츠 SDK 문서](https://docs.toss.im/payments/develop/sdk)

