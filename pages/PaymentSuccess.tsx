import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { updateSubscriptionStatus, PaymentPlan } from '../utils/payment/nicepay';
import { useAuth } from '../contexts/AuthContext';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  const planId = searchParams.get('planId') as PaymentPlan | null;
  const userId = searchParams.get('userId');
  const orderId = searchParams.get('orderId') || `order_${Date.now()}`;

  useEffect(() => {
    // 이미 처리했으면 스킵
    if (hasProcessed.current) return;
    
    // 인증 로딩 중이면 대기
    if (authLoading) return;

    const updateSubscription = async () => {
      hasProcessed.current = true;
      
      console.log('[PaymentSuccess] 결제 처리 시작:', { planId, userId, orderId, user: user?.email });

      if (!planId || !userId) {
        console.log('[PaymentSuccess] 필수 파라미터 누락');
        setError('결제 정보가 올바르지 않습니다');
        setLoading(false);
        return;
      }

      try {
        const { success, error: updateError } = await updateSubscriptionStatus(
          userId,
          planId,
          orderId
        );

        console.log('[PaymentSuccess] 구독 업데이트 결과:', { success, updateError });

        if (!success) {
          setError(updateError || '구독 상태 업데이트에 실패했습니다');
          setLoading(false);
          return;
        }

        // 구독 상태 업데이트 성공 후 팝업 창에서 열린 경우 부모 창으로 메시지 전송
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'PAYMENT_SUCCESS', planId, userId, orderId },
            window.location.origin
          );
          // 팝업 창이면 2초 후 자동으로 닫기
          setTimeout(() => {
            window.close();
          }, 2000);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('[PaymentSuccess] Error updating subscription:', err);
        setError('구독 상태 업데이트 중 오류가 발생했습니다');
        setLoading(false);
      }
    };

    updateSubscription();
  }, [planId, userId, orderId, user, authLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">결제 처리 중...</div>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="max-w-md mx-4 border-2 border-red-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600 mb-2">오류 발생</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} className="w-full btn-primary">
              대시보드로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="max-w-lg mx-4 border-2 border-green-500 shadow-2xl">
        <CardHeader className="text-center">
          {/* 성공 애니메이션 */}
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-green-500 rounded-full">
              <span className="text-5xl">✓</span>
            </div>
          </div>
          <CardTitle className="text-3xl mb-2 text-green-700">결제가 완료되었습니다!</CardTitle>
          <CardDescription className="text-lg">
            {planId === 'basic' ? '베이직' : planId === 'pro' ? '프로' : '엔터프라이즈'} 플랜이 활성화되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 주문 정보 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3">주문 정보</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">주문 번호</span>
              <span className="font-mono text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">플랜</span>
              <span className="font-semibold text-gray-900">
                {planId === 'basic' ? '베이직 플랜' : planId === 'pro' ? '프로 플랜' : '엔터프라이즈 플랜'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">결제 일시</span>
              <span className="text-gray-900">{new Date().toLocaleString('ko-KR')}</span>
            </div>
          </div>

          {/* 다음 단계 안내 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <span>🎉</span>
              <span>다음 단계</span>
            </h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">1.</span>
                <span>이메일로 발송된 영수증을 확인하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">2.</span>
                <span>대시보드에서 웹사이트 URL을 입력하여 분석을 시작하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">3.</span>
                <span>분석 완료 후 상세 보고서를 확인하세요</span>
              </li>
            </ul>
          </div>

          {/* 보안 배지 */}
          <div className="flex items-center justify-center gap-4 py-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>🔒</span>
              <span>SSL 보안 결제</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>✓</span>
              <span>PCI-DSS 인증</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-2">
            <Button onClick={() => navigate('/dashboard')} className="w-full btn-primary text-lg py-6">
              분석 시작하기
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full"
            >
              홈으로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

