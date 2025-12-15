import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading, openAuthModal } = useAuth();

  useEffect(() => {
    // 로딩이 끝난 후 인증되지 않은 경우 모달 열기
    if (!loading && !isAuthenticated) {
      openAuthModal('login');
    }
  }, [loading, isAuthenticated, openAuthModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-subtle">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // 모달이 열리고 홈으로 리다이렉트
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <>{children}</>;
}
