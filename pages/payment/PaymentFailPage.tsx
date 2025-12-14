import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorMessage = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.';
  const errorCode = searchParams.get('code');

  const handleRetry = () => {
    navigate('/pricing');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--primary)' }}>
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Fail Card */}
          <div className="bg-white/5 border border-red-500/30 rounded-3xl p-12 text-center backdrop-blur-sm">
            {/* Fail Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-16 h-16 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">
              결제에 실패했습니다
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              결제 처리 중 문제가 발생했습니다.
            </p>

            {/* Error Info */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-red-400 mb-4">오류 정보</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-400">오류 메시지:</span>
                  <span className="text-white">{errorMessage}</span>
                </div>
                {errorCode && (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-400">오류 코드:</span>
                    <span className="font-mono text-red-400">{errorCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Common Reasons */}
            <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">일반적인 원인</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>카드 한도 초과 또는 잔액 부족</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>카드 정보 입력 오류</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>네트워크 연결 문제</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>결제 시스템 일시적 오류</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="w-full px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                <RefreshCw className="w-5 h-5" />
                다시 시도하기
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2 border border-white/20 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                홈으로 돌아가기
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-2">
              문제가 계속되면 고객 지원팀에 문의해 주세요.
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
