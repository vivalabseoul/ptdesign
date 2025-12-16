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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="max-w-md mx-4 border-2 border-primary">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <CardTitle className="text-2xl mb-2">결제가 완료되었습니다!</CardTitle>
          <CardDescription>
            {planId === 'basic' ? '베이직' : planId === 'pro' ? '프로' : '엔터프라이즈'} 플랜이 활성화되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              이제 전체 분석 결과와 상세 보고서를 확인할 수 있습니다.
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="w-full btn-primary">
            대시보드로 이동
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

