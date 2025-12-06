import { useLocation, useNavigate } from 'react-router-dom';
import { Results as ResultsComponent } from '../components/Results';
import type { AnalysisResult } from '../components/Results';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as AnalysisResult | undefined;
  const returnTo = location.state?.returnTo as string | undefined;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">분석 결과를 찾을 수 없습니다</h2>
          <p className="text-muted mb-4">홈으로 돌아가서 다시 분석해주세요.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleBackToList = () => {
    // returnTo가 있으면 해당 경로로 돌아가기
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
    // returnTo가 있으면 해당 경로로, 없으면 기본적으로 /dashboard로 이동
    navigate(returnTo || '/dashboard');
  };

  return <ResultsComponent result={result} onReset={handleReset} onBackToList={returnTo ? handleBackToList : undefined} returnTo={returnTo} />;
}

