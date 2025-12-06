import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function PaymentFail() {
  const navigate = useNavigate();

  // 팝업 창에서 열린 경우 부모 창으로 메시지 전송
  useEffect(() => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { type: 'PAYMENT_FAIL' },
        window.location.origin
      );
      // 팝업 창이면 2초 후 자동으로 닫기
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="max-w-md mx-4 border-2 border-red-500">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <CardTitle className="text-2xl mb-2 text-red-600">결제가 취소되었습니다</CardTitle>
          <CardDescription>
            결제가 완료되지 않았습니다. 다시 시도해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => navigate('/#pricing')} className="w-full btn-primary">
            가격 정책 보기
          </Button>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
            대시보드로 이동
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

