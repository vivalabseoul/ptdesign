import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const planId = searchParams.get('planId');
  const orderId = searchParams.get('orderId');
  const userId = searchParams.get('userId');

  useEffect(() => {
    // 5초 카운트다운
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 카운트다운이 0이 되면 대시보드로 이동
  useEffect(() => {
    if (countdown === 0) {
      navigate('/customer/dashboard');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--primary)' }}>
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">
              결제가 완료되었습니다!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              ProTouchDesign을 선택해 주셔서 감사합니다.
            </p>

            {/* Order Info */}
            <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">주문 정보</h3>
              <div className="space-y-3 text-gray-300">
                {orderId && (
                  <div className="flex justify-between">
                    <span>주문 번호:</span>
                    <span className="font-mono text-white">{orderId}</span>
                  </div>
                )}
                {planId && (
                  <div className="flex justify-between">
                    <span>플랜:</span>
                    <span className="font-semibold text-white capitalize">{planId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>상태:</span>
                  <span className="text-green-400 font-semibold">결제 완료</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">다음 단계</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>결제 확인 이메일이 발송되었습니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>대시보드에서 분석을 시작할 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>분석 결과는 이메일로도 전송됩니다.</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/customer/dashboard')}
                className="w-full px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                대시보드로 이동
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-sm text-gray-400">
                {countdown}초 후 자동으로 이동합니다...
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-2">
              문의사항이 있으신가요?
            </p>
            <a 
              href="mailto:contact@protouchdesign.com"
              className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors"
            >
              contact@protouchdesign.com
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
