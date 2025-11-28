/**
 * 토스페이먼츠 결제 시스템 통합
 * 한국 시장에 최적화된 결제 처리
 */

export type PaymentPlan = 'free' | 'basic' | 'pro' | 'enterprise';

export interface PaymentPlanConfig {
  id: PaymentPlan;
  name: string;
  price: number;
  currency: string;
  features: string[];
}

// 결제 플랜 설정
export const paymentPlans: PaymentPlanConfig[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'KRW',
    features: [
      'SEO 분석까지 무료',
      '기본 분석 보고서',
      'AI 작업 지침서',
    ],
  },
  {
    id: 'basic',
    name: '베이직',
    price: 50000,
    currency: 'KRW',
    features: [
      '전체 분석 결과 확인',
      'PDF 분석 보고서',
      'AI 작업 지침서',
      '기본 UI/UX 점수',
      '24시간 이내 발송',
    ],
  },
  {
    id: 'pro',
    name: '프로',
    price: 120000,
    currency: 'KRW',
    features: [
      '전체 분석 결과 확인',
      '상세 PDF 분석 보고서',
      'AI 작업 지침서',
      '종합 UI/UX 점수',
      '개선 우선순위 제안',
      '12시간 이내 발송',
    ],
  },
  {
    id: 'enterprise',
    name: '엔터프라이즈',
    price: 0,
    currency: 'KRW',
    features: [
      '무제한 URL 분석',
      '커스텀 보고서',
      '전담 매니저 배정',
      '월간 분석 리포트',
      '실시간 컨설팅',
      '즉시 발송',
    ],
  },
];

// 토스페이먼츠 결제 위젯 초기화
export const initializeTossPayments = async (clientKey: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    // 동적 import로 토스페이먼츠 SDK 로드
    const { loadTossPayments } = await import('@tosspayments/payment-sdk');
    
    return loadTossPayments(clientKey);
  } catch (error) {
    console.error('토스페이먼츠 SDK 로드 실패:', error);
    console.warn('토스페이먼츠 SDK를 설치해주세요: npm install @tosspayments/payment-sdk');
    return null;
  }
};

// 결제 요청 생성
export const requestPayment = async (
  planId: PaymentPlan,
  userId: string,
  userName: string,
  userEmail: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const plan = paymentPlans.find((p) => p.id === planId);
    if (!plan || plan.price === 0) {
      return { success: false, error: 'Invalid plan' };
    }

    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
    
    // 개발 모드: 클라이언트 키가 없으면 개발 모드로 처리
    if (!clientKey) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ 개발 모드: 토스페이먼츠 클라이언트 키가 없습니다.');
        console.warn('⚠️ 실제 결제를 테스트하려면 .env 파일에 VITE_TOSS_CLIENT_KEY를 추가하세요.');
        
        // 개발 모드에서는 결제 성공 페이지로 바로 이동 (테스트용)
        const confirmMessage = `[개발 모드] 결제를 시뮬레이션합니다.\n\n플랜: ${plan.name}\n가격: ₩${plan.price.toLocaleString()}\n\n결제 성공 페이지로 이동하시겠습니까?`;
        if (window.confirm(confirmMessage)) {
          window.location.href = `/payment/success?planId=${planId}&userId=${userId}&orderId=dev_${Date.now()}`;
          return { success: true };
        }
        return { success: false, error: '결제가 취소되었습니다.' };
      }
      
      return { 
        success: false, 
        error: '토스페이먼츠 클라이언트 키가 설정되지 않았습니다. .env 파일에 VITE_TOSS_CLIENT_KEY를 추가해주세요.' 
      };
    }

    const tossPayments = await initializeTossPayments(clientKey);
    if (!tossPayments) {
      return { 
        success: false, 
        error: '토스페이먼츠 초기화에 실패했습니다. SDK가 설치되어 있는지 확인해주세요.' 
      };
    }

    // 결제 정보 생성
    const paymentData = {
      amount: plan.price,
      orderId: `order_${Date.now()}_${userId}`,
      orderName: `${plan.name} 플랜`,
      customerName: userName,
      customerEmail: userEmail,
      successUrl: `${window.location.origin}/payment/success?planId=${planId}&userId=${userId}`,
      failUrl: `${window.location.origin}/payment/fail`,
    };

    // 결제 방법 선택 (카드, 계좌이체, 가상계좌, 휴대폰 등)
    const widget = tossPayments.widgets.requestPayment('카드', {
      ...paymentData,
      flowMode: 'DEFAULT',
      easyPay: '토스페이',
    });

    // 결제 위젯 열기
    await widget.requestPayment();

    return { success: true };
  } catch (error) {
    console.error('Payment error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment processing failed' 
    };
  }
};

// 결제 성공 후 구독 상태 업데이트
export const updateSubscriptionStatus = async (
  userId: string,
  planId: PaymentPlan,
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Supabase Edge Function 또는 API 호출
    const response = await fetch('/api/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        planId,
        orderId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update subscription' 
    };
  }
};

