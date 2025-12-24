import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { requestPayment, PaymentPlan } from "../utils/payment/nicepay";

interface PaymentGateProps {
  children: React.ReactNode;
  showBlur?: boolean;
}

/**
 * 결제가 필요한 콘텐츠를 보호하는 컴포넌트
 * 비결제 사용자에게는 블러 처리와 결제 안내를 표시
 */
export function PaymentGate({ children, showBlur = true }: PaymentGateProps) {
  const { user, appUser, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // 디버깅 로그
  console.log('[PaymentGate] 체크:', {
    user: user?.email,
    appUser: appUser?.email,
    subscription_status: appUser?.subscription_status,
    subscription_plan: appUser?.subscription_plan,
    isAdmin,
    isAuthenticated
  });

  const isPaid =
    appUser?.subscription_status === "active" &&
    appUser?.subscription_plan !== "guest";

  console.log('[PaymentGate] isPaid:', isPaid);

  // 관리자는 항상 모든 콘텐츠를 볼 수 있음
  if (isAdmin || isPaid) {
    console.log('[PaymentGate] 접근 허용 - isAdmin:', isAdmin, 'isPaid:', isPaid);
    return <>{children}</>;
  }

  console.log('[PaymentGate] 결제 게이트 표시');


  const handlePayment = async (planId: PaymentPlan = "basic") => {
    if (!isAuthenticated || !user) {
      const confirmed = window.confirm(
        "결제를 진행하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmed) {
        navigate("/login");
      }
      return;
    }

    try {
      const userEmail = user.email || appUser?.email || "사용자";
      const userName = appUser?.email?.split("@")[0] || "사용자";

      const { success, error } = await requestPayment(
        planId,
        user.id,
        userName,
        userEmail
      );

      if (!success) {
        alert(error || "결제 처리 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("결제 처리 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="relative">
      {/* 블러 처리된 콘텐츠 */}
      <div
        className={showBlur ? "blur-md pointer-events-none select-none" : ""}
      >
        {children}
      </div>

      {/* 결제 안내 오버레이 - 팝업 카드 크기만큼만 */}
      <div className="absolute inset-0 flex justify-center items-start pt-6 sm:pt-10 lg:pt-16 z-10 pointer-events-none">
        <div className="relative max-w-md mx-4 pointer-events-auto">
          {/* 카드 주변 블러 영역 */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-lg -z-10 scale-110"></div>
          <Card className="border-2 border-primary shadow-2xl">
            <CardHeader className="text-center">
              <div className="text-5xl mb-3">🔒</div>
              <CardTitle className="text-2xl mb-2">
                전체 분석 결과를 보려면
              </CardTitle>
              <CardDescription className="text-lg">
                결제가 필요합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              {/* 혜택 안내 */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-900 font-semibold mb-2">
                  💡 결제 시 제공되는 혜택
                </p>
                <ul className="text-xs text-orange-800 space-y-1">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>전체 SEO 및 UI/UX 분석 결과</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>상세 PDF 보고서 다운로드</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>AI 기반 개선 제안</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>우선순위별 작업 지침서</span>
                  </li>
                </ul>
              </div>

              {/* 결제 버튼 */}
              <div className="space-y-2">
                <Button
                  onClick={() => handlePayment("basic")}
                  className="w-full btn-primary"
                >
                  <div className="flex flex-col items-center py-1">
                    <span className="font-bold">베이직 플랜 결제하기</span>
                    <span className="text-xs opacity-90">₩99,000</span>
                  </div>
                </Button>
                <Button
                  onClick={() => handlePayment("pro")}
                  className="w-full btn-secondary"
                >
                  <div className="flex flex-col items-center py-1">
                    <span className="font-bold">프로 플랜 결제하기</span>
                    <span className="text-xs opacity-90">₩299,000</span>
                  </div>
                </Button>
              </div>

              {/* 신뢰도 요소 */}
              <div className="flex items-center justify-center gap-4 py-2 border-t border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span>🔒</span>
                  <span>안전결제</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span>✓</span>
                  <span>환불보장</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span>⚡</span>
                  <span>빠른발송</span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 pb-0">
                또는{" "}
                <button
                  onClick={() => navigate("/#pricing")}
                  className="text-primary hover:underline font-semibold"
                >
                  가격 정책 보기
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
