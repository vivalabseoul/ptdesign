import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface AnalysisLoadingProps {
  onComplete: () => void;
  isComplete?: boolean; // 실제 분석 완료 여부
}

export function AnalysisLoading({ onComplete, isComplete = false }: AnalysisLoadingProps) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("서버 연결 중...");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isError) return;

    if (isComplete) {
      // 실제 완료되면 100%로 설정하고 완료 처리
      setProgress(100);
      setMessage("분석이 완료되었습니다!");
      setTimeout(onComplete, 1500);
      return;
    }

    // 시간 추적 (30초 단위로 메시지 변경)
    const timeTracker = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        const seconds = Math.floor(newTime);
        
        // 5분(300초) 초과 시 에러 처리
        if (seconds >= 300) {
          setIsError(true);
          setMessage("분석 시간이 초과되었습니다.");
          return newTime;
        }
        
        // 30초 단위로 안내 메시지 변경
        if (seconds >= 90) {
          setMessage("분석이 오래 걸리고 있습니다. 잠시만 기다려주세요...");
        } else if (seconds >= 60) {
          setMessage("분석이 진행 중입니다. 조금 더 기다려주세요...");
        } else if (seconds >= 30) {
          setMessage("분석이 진행 중입니다. 잠시만 기다려주세요...");
        } else if (seconds >= 10) {
          setMessage("웹사이트 데이터 수집 및 AI 분석 수행 중...");
        } else {
          setMessage("서버 연결 및 초기 설정 중...");
        }
        
        return newTime;
      });
    }, 1000);

    // 완료되지 않았으면 95%까지만 천천히 증가
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          // 95%에서 멈추고 실제 완료를 기다림
          return 95;
        }

        // 천천히 증가 (95%까지만)
        const increment = Math.random() * 1.0 + 0.3;
        return Math.min(prev + increment, 95);
      });
    }, 200);

    return () => {
      clearInterval(timeTracker);
      clearInterval(progressTimer);
    };
  }, [onComplete, isComplete, isError]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const isCompleteState = progress === 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl" style={{ animation: 'slideUp 0.3s ease-out' }}>
        <div className="mb-8">
          <div 
            className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 transition-all duration-500 ${
              isError 
                ? 'bg-red-100' 
                : isCompleteState 
                  ? 'bg-green-100 scale-110' 
                  : 'bg-[var(--accent)]'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-10 h-10 text-red-600" />
            ) : (
              <span className="text-4xl">
                {isCompleteState ? '✅' : '🔍'}
              </span>
            )}
          </div>
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ color: isError ? '#DC2626' : isCompleteState ? '#059669' : 'var(--primary)' }}
          >
            {isError ? '분석 실패' : isCompleteState ? '분석 완료!' : 'AI 분석 진행 중'}
          </h2>
          
          {/* Timer - 에러가 아닐 때만 표시 */}
          {!isCompleteState && !isError && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                <span className="text-base font-semibold text-gray-700">
                  경과 시간: {Math.floor(elapsedTime / 60)}:{(Math.floor(elapsedTime % 60)).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-8">
            {message}<br />
            {!isCompleteState && !isError && <span className="text-base text-gray-500">(실제 분석 시간은 웹사이트 규모에 따라 다를 수 있습니다)</span>}
            {isError && (
              <span className="text-base text-gray-500 block mt-2">
                대상 웹사이트의 응답이 지연되거나 접근이 차단되었을 수 있습니다.
                <br />
                잠시 후 다시 시도해주세요.
              </span>
            )}
          </p>

          {isError && (
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ background: 'var(--primary)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              이전 페이지로 돌아가기
            </button>
          )}
        </div>

        {/* Progress Bar Container - 에러 시 숨김 */}
        {!isError && (
          <>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative mb-2">
              {/* Animated Progress Bar */}
              <div 
                className={`h-full transition-all duration-300 ease-out relative ${isCompleteState ? 'bg-green-500' : 'bg-[var(--accent)]'}`}
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                {!isCompleteState && (
                  <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]" 
                       style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} 
                  />
                )}
              </div>
            </div>
            
            <div className={`text-right text-base font-bold ${isCompleteState ? 'text-green-600' : 'text-[var(--accent)]'}`}>
              {Math.round(progress)}%
            </div>
          </>
        )}
      </div>
    </div>
  );
}
