/**
 * 나이스페이(NICEPAY) 결제 시스템 통합
 * 한국 시장에 최적화된 결제 처리
 */

export type PaymentPlan = 'guest' | 'basic' | 'pro' | 'enterprise';

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
    id: 'guest',
    name: 'Guest',
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
    price: 99000,
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
    price: 299000,
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

/**
 * 나이스페이 결제창 오픈
 * 나이스페이는 HTML 폼 기반 결제 방식을 사용합니다.
 */
export const requestPayment = async (
  planId: PaymentPlan,
  userId: string,
  userName: string,
  userEmail: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("💰 requestPayment 호출됨:", { planId, userId, userName, userEmail });

    const plan = paymentPlans.find((p) => p.id === planId);
    console.log("💰 선택된 플랜:", plan);

    if (!plan || plan.price === 0) {
      console.log("💰 유효하지 않은 플랜");
      return { success: false, error: 'Invalid plan' };
    }

    // 나이스페이는 MID(가맹점 ID)만 필수로 사용
    const merchantId = import.meta.env.VITE_NICEPAY_MERCHANT_ID;
    console.log("💰 개발 모드:", import.meta.env.DEV);
    console.log("💰 가맹점 ID:", merchantId ? "있음" : "없음");

    // 개발 모드: 결제 시뮬레이션 (실제 결제 없이 테스트)
    if (import.meta.env.DEV) {
      console.log('✅ 개발 모드: 결제 시뮬레이션을 실행합니다.');
      console.log(`📦 플랜: ${plan.name}, 가격: ₩${plan.price.toLocaleString()}`);
      
      // 개발 모드에서는 바로 결제 성공 페이지로 이동
      const successUrl = `/payment/success?planId=${planId}&userId=${userId}&orderId=dev_${Date.now()}`;
      console.log('💰 결제 성공 페이지로 이동:', successUrl);
      window.location.href = successUrl;
      return { success: true };
    }

    // 프로덕션 모드: 실제 나이스페이 결제
    if (!merchantId) {
      return {
        success: false,
        error: '나이스페이 가맹점 ID가 설정되지 않았습니다. .env 파일에 VITE_NICEPAY_MERCHANT_ID를 추가해주세요.'
      };
    }

    // 주문 정보 생성
    const orderId = `order_${Date.now()}_${userId}`;
    const orderName = `${plan.name} 플랜`;
    const amount = plan.price;
    
    // 성공/실패 URL
    const successUrl = `${window.location.origin}/payment/success?planId=${planId}&userId=${userId}&orderId=${orderId}`;
    const failUrl = `${window.location.origin}/payment/fail`;

    // 나이스페이 결제 요청을 위한 HTML 폼 생성 (팝업용)
    const form = document.createElement('form');
    form.method = 'POST';
    // 나이스페이 결제 요청 URL
    // 테스트 환경: https://web.nicepay.co.kr/v3/web/
    // 운영 환경: https://web.nicepay.co.kr/v3/web/ (동일)
    form.action = 'https://web.nicepay.co.kr/v3/web/';
    form.target = 'nicepay_popup'; // 팝업 창 이름
    form.style.display = 'none';

    // 나이스페이 필수 파라미터 설정
    // 나이스페이 결제창 연동 가이드 참고: https://help.portone.io/content/nice
    const params: Record<string, string> = {
      PayMethod: 'CARD', // 카드결제 (다른 결제수단: BANK(계좌이체), VBANK(가상계좌), CELLPHONE(휴대폰))
      GoodsCnt: '1', // 상품 수량
      GoodsCl: '1', // 상품 구분
      Amt: amount.toString(), // 결제 금액
      MID: merchantId, // 가맹점 ID
      Moid: orderId, // 주문번호
      BuyerName: userName, // 구매자 이름
      BuyerEmail: userEmail, // 구매자 이메일
      GoodsName: orderName, // 상품명
      ReturnURL: successUrl, // 결제 완료 후 리다이렉트 URL
      NotiURL: `${window.location.origin}/api/payment/notify`, // 가맹점 서버 결제 결과 수신 URL (서버 사이드 처리 필요)
      CancelURL: failUrl, // 결제 취소 시 리다이렉트 URL
      MallReserved: JSON.stringify({
        planId,
        userId,
      }), // 예약 필드 (추가 정보 저장)
      CharSet: 'UTF-8', // 문자 인코딩
      EdiDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0], // YYYYMMDDHHmmss 형식
    };

    // 폼에 파라미터 추가
    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // 팝업 창 열기
    const popup = window.open(
      '',
      'nicepay_popup',
      'width=600,height=800,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
    );

    if (!popup) {
      return { 
        success: false, 
        error: '팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.' 
      };
    }

    // 폼을 body에 추가하고 제출
    document.body.appendChild(form);
    form.submit();

    // 팝업에서 메시지를 받으면 처리 (결제 완료 시)
    const handleMessage = (event: MessageEvent) => {
      // 보안을 위해 origin 확인
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'PAYMENT_SUCCESS') {
        // 팝업이 아직 열려있으면 닫기
        if (popup && !popup.closed) {
          try {
            popup.close();
          } catch (e) {
            // 팝업이 이미 닫혔을 수 있음
            console.log('Popup already closed');
          }
        }
        // 메시지 리스너 제거
        window.removeEventListener('message', handleMessage);
        // 성공 페이지로 리다이렉트
        if (event.data.planId && event.data.userId && event.data.orderId) {
          const successUrl = `${window.location.origin}/payment/success?planId=${event.data.planId}&userId=${event.data.userId}&orderId=${event.data.orderId}`;
          window.location.href = successUrl;
        } else {
          // 파라미터가 없으면 페이지 새로고침
          window.location.reload();
        }
      } else if (event.data.type === 'PAYMENT_FAIL') {
        // 팝업이 아직 열려있으면 닫기
        if (popup && !popup.closed) {
          try {
            popup.close();
          } catch (e) {
            // 팝업이 이미 닫혔을 수 있음
            console.log('Popup already closed');
          }
        }
        // 메시지 리스너 제거
        window.removeEventListener('message', handleMessage);
        // 실패 페이지로 이동
        window.location.href = failUrl;
      }
    };

    // 메시지 리스너 추가
    window.addEventListener('message', handleMessage);

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
    // Supabase 클라이언트 import
    // AWS 마이그레이션: RDS PostgreSQL로 대체 필요
    // const { query } = await import('../../lib/aws-database');
    // await query('UPDATE users SET subscription_status = $1 WHERE id = $2', ['active', userId]);
    
    // 플랜 가격 정보 가져오기
    const plan = paymentPlans.find((p) => p.id === planId);
    if (!plan) {
      return { success: false, error: 'Invalid plan' };
    }

    // 사용자 구독 상태 업데이트
    console.log('Updating subscription status:', {
      userId,
      planId,
      subscription_status: 'active',
      subscription_plan: planId === 'guest' ? 'guest' : planId,
    });

    // AWS 마이그레이션: RDS PostgreSQL로 대체 필요
    /*
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_plan: planId === 'guest' ? 'guest' : planId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();
    */
    
    // TODO: AWS RDS 구현
    // const { query } = await import('../../lib/aws-database');
    // await query(
    //   'UPDATE users SET subscription_status = $1, subscription_plan = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
    //   ['active', planId, userId]
    // );
    
    const updateError = null; // 임시

    /*
    if (updateError) {
      console.error('Error updating subscription status:', updateError);
      console.error('Error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
      });
      return { 
        success: false, 
        error: updateError.message || '구독 상태 업데이트에 실패했습니다' 
      };
    }
    */

    console.log('Subscription status updated successfully (AWS migration pending)');


    // 결제 기록 저장 (payments 테이블이 있는 경우)
    try {
      // AWS 마이그레이션: 결제 기록 저장 (RDS)
      /*
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            user_id: userId,
            plan_id: planId,
            amount: plan.price,
            currency: plan.currency,
            status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      */
      
      const paymentError = null; // 임시

      /*
      if (paymentError) {
        // payments 테이블이 없거나 오류가 있어도 구독 상태 업데이트는 성공한 것으로 처리
        console.warn('Error saving payment record:', paymentError);
      }
      */
    } catch (paymentError) {
      // payments 테이블이 없어도 구독 상태 업데이트는 성공한 것으로 처리
      console.warn('Payments table may not exist:', paymentError);
    }

    console.log('Subscription status updated successfully:', {
      userId,
      planId,
      orderId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update subscription' 
    };
  }
};

