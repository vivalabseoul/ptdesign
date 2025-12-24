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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="max-w-lg mx-4 border-2 border-red-500 shadow-2xl">
        <CardHeader className="text-center">
          {/* 실패 애니메이션 */}
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-20"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-red-500 rounded-full">
              <span className="text-5xl text-white">✕</span>
            </div>
          </div>
          <CardTitle className="text-3xl mb-2 text-red-600">결제가 취소되었습니다</CardTitle>
          <CardDescription className="text-lg">
            결제가 완료되지 않았습니다. 다시 시도해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 실패 사유 안내 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">결제가 실패한 이유</h3>
            <ul className="text-sm text-red-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>카드 한도 초과 또는 잔액 부족</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>카드 정보 입력 오류</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>결제 승인 거부 (카드사 문의 필요)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>사용자가 결제를 취소함</span>
              </li>
            </ul>
          </div>

          {/* 해결 방법 안내 */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>해결 방법</span>
            </h3>
            <ul className="text-sm text-orange-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">1.</span>
                <span>카드 정보를 다시 확인하고 재시도해 주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">2.</span>
                <span>다른 결제 수단을 사용해 보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">3.</span>
                <span>카드사에 문의하여 결제 가능 여부를 확인하세요</span>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">도움이 필요하신가요?</h3>
            <p className="text-sm text-blue-800 mb-2">
              결제 문제가 계속되면 고객 지원팀에 문의해 주세요.
            </p>
            <div className="flex flex-col gap-1 text-sm text-blue-900">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>support@protouchdesign.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>1588-0000 (평일 09:00-18:00)</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-2">
            <Button onClick={() => navigate('/#pricing')} className="w-full btn-primary text-lg py-6">
              다시 결제하기
            </Button>
            <Button onClick={() => navigate('/#faq')} variant="outline" className="w-full">
              자주 묻는 질문 보기
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="ghost" className="w-full">
              대시보드로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

