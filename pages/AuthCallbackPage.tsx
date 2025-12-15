import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // 로딩이 완료될 때까지 대기
    if (loading) return;

    // OAuth 콜백 후 사용자 역할에 따라 대시보드로 리다이렉트
    const timer = setTimeout(() => {
      if (user) {
        // 사용자 역할에 따른 리다이렉트
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'expert':
            navigate('/expert/dashboard');
            break;
          case 'customer':
          default:
            navigate('/customer/dashboard');
            break;
        }
      } else {
        // 사용자 정보가 없으면 홈으로
        navigate('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

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
