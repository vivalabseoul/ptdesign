import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // OAuth 콜백 후 대시보드로 리다이렉트
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">로그인 중...</h2>
        <p className="text-gray-600">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
