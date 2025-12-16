import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe 공개 키 (실제 사용 시 환경 변수로 관리)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// 결제 플랜 타입
export type PaymentPlan = 'guest' | 'basic' | 'pro' | 'enterprise';

export interface PaymentPlanConfig {
  id: PaymentPlan;
  name: string;
  price: number;
  currency: string;
  features: string[];
  stripePriceId?: string;
}

// 결제 플랜 설정
export const paymentPlans: PaymentPlanConfig[] = [
  {
    id: 'guest',
    name: 'Guest',
    price: 0,
    currency: 'KRW',
    features: [
      '월 3회 분석',
      '기본 분석 보고서',
      'AI 작업 지침서',
      'PDF 다운로드',
    ],
  },
  {
    id: 'basic',
    name: '베이직',
    price: 50000,
    currency: 'KRW',
    features: [
      '1개 URL 분석',
      'PDF 분석 보고서',
      'AI 작업 지침서',
      '기본 UI/UX 점수',
      '24시간 이내 발송',
    ],
    stripePriceId: 'price_basic', // 실제 Stripe Price ID로 교체
  },
  {
    id: 'pro',
    name: '프로',
    price: 120000,
    currency: 'KRW',
    features: [
      '최대 3개 URL 분석',
      '상세 PDF 분석 보고서',
      'AI 작업 지침서',
      '종합 UI/UX 점수',
      '개선 우선순위 제안',
      '12시간 이내 발송',
    ],
    stripePriceId: 'price_pro', // 실제 Stripe Price ID로 교체
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

// 결제 세션 생성
export const createCheckoutSession = async (
  planId: PaymentPlan,
  userId: string
): Promise<{ sessionId: string; error?: string }> => {
  try {
    const plan = paymentPlans.find((p) => p.id === planId);
    if (!plan || !plan.stripePriceId) {
      return { sessionId: '', error: 'Invalid plan' };
    }

    // Supabase Edge Function 또는 백엔드 API 호출
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: plan.id,
        priceId: plan.stripePriceId,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { sessionId: '', error: error.message };
    }

    const { sessionId } = await response.json();
    return { sessionId };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { sessionId: '', error: 'Failed to create checkout session' };
  }
};

// 결제 처리
export const handlePayment = async (
  planId: PaymentPlan,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { sessionId, error } = await createCheckoutSession(planId, userId);
    if (error || !sessionId) {
      return { success: false, error };
    }

    const stripe = await getStripe();
    if (!stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (stripeError) {
      return { success: false, error: stripeError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling payment:', error);
    return { success: false, error: 'Payment processing failed' };
  }
};

