# 나이스페이 결제창 연동 가이드

## 📋 현재 구현 상태

나이스페이 결제창이 이미 구현되어 있습니다:

- ✅ `utils/payment/nicepay.ts` - 나이스페이 결제 로직
- ✅ `components/PaymentButton.tsx` - 결제 버튼 컴포넌트
- ✅ `components/PaymentGate.tsx` - 결제 게이트 컴포넌트
- ✅ `components/Pricing.tsx` - 가격 정책 페이지 (결제 버튼 포함)
- ✅ 팝업 방식 결제창 구현
- ✅ 결제 성공/실패 페이지

## 🔧 설정 필요 사항

### 1. 환경 변수 설정

`.env` 파일에 나이스페이 가맹점 ID 추가:

```env
VITE_NICEPAY_MERCHANT_ID=your_merchant_id_here
```

### 2. 나이스페이 가맹점 계약

1. **나이스페이 가맹점 가입**: https://www.nicepay.co.kr
2. **상점 아이디(MID) 발급**: 계약 완료 후 발급받은 MID를 `.env`에 설정
3. **테스트 환경 확인**: 테스트 MID로 먼저 테스트

## 🚀 결제 플로우

### 현재 구현된 플로우

1. **결제 버튼 클릭**: `PaymentButton` 또는 `PaymentGate`에서 결제 시작
2. **로그인 확인**: 로그인되지 않은 경우 로그인 페이지로 이동
3. **결제창 팝업**: 나이스페이 결제창이 팝업으로 열림
4. **결제 진행**: 사용자가 나이스페이 결제창에서 결제 진행
5. **결제 완료**: 결제 완료 후 `PaymentSuccess` 페이지로 리다이렉트
6. **구독 상태 업데이트**: `updateSubscriptionStatus` 함수로 구독 상태 업데이트
7. **팝업 닫기**: 부모 창으로 메시지 전송 후 팝업 닫기

## 📝 나이스페이 파라미터

### 필수 파라미터

- `PayMethod`: 결제 수단 (CARD, BANK, VBANK, CELLPHONE)
- `Amt`: 결제 금액
- `MID`: 가맹점 ID
- `Moid`: 주문번호
- `BuyerName`: 구매자 이름
- `BuyerEmail`: 구매자 이메일
- `GoodsName`: 상품명
- `ReturnURL`: 결제 완료 후 리다이렉트 URL
- `CancelURL`: 결제 취소 시 리다이렉트 URL
- `EdiDate`: 거래일시 (YYYYMMDDHHmmss)

### 선택 파라미터

- `NotiURL`: 가맹점 서버 결제 결과 수신 URL (서버 사이드 처리 필요)
- `MallReserved`: 예약 필드 (추가 정보 저장)

## 🔍 문제 해결

### 문제 1: 결제창이 열리지 않는 경우

1. **팝업 차단 확인**: 브라우저 팝업 차단 설정 확인
2. **MID 확인**: `.env` 파일에 `VITE_NICEPAY_MERCHANT_ID`가 올바르게 설정되었는지 확인
3. **콘솔 확인**: 브라우저 개발자 도구에서 에러 확인

### 문제 2: 결제 완료 후 처리되지 않는 경우

1. **ReturnURL 확인**: `ReturnURL`이 올바르게 설정되었는지 확인
2. **서버 사이드 처리**: `NotiURL`을 통해 서버 사이드에서 결제 결과를 처리해야 할 수 있음
3. **구독 상태 업데이트**: `updateSubscriptionStatus` 함수가 제대로 작동하는지 확인

### 문제 3: 개발 모드에서 테스트하는 경우

개발 모드에서는 `VITE_NICEPAY_MERCHANT_ID`가 없으면 결제 시뮬레이션 모드로 작동합니다:

- 결제 확인 대화상자 표시
- 결제 성공 페이지로 바로 이동
- 실제 결제는 진행되지 않음

## 📚 참고 자료

- 나이스페이 개발자 가이드: https://help.portone.io/content/nice
- 나이스페이 공식 웹사이트: https://www.nicepay.co.kr

## ⚠️ 주의사항

1. **보안**: 실제 운영 환경에서는 서버 사이드에서 결제 요청을 처리하는 것이 권장됩니다
2. **테스트**: 실제 결제 전에 테스트 환경에서 충분히 테스트하세요
3. **NotiURL**: 서버 사이드에서 결제 결과를 처리하려면 `NotiURL`을 설정해야 합니다

