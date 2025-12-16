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

  const isPaid =
    appUser?.subscription_status === "active" &&
    appUser?.subscription_plan !== "guest";

  // 관리자는 항상 모든 콘텐츠를 볼 수 있음
  if (isAdmin || isPaid) {
    return <>{children}</>;
  }

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
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">
                전체 분석 결과를 보려면
              </CardTitle>
              <CardDescription className="text-lg">
                결제가 필요합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-900">
                  💡 SEO 및 전체 분석 결과와 상세 보고서를 보려면 결제가
                  필요합니다.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => handlePayment("basic")}
                  className="w-full btn-primary"
                >
                  베이직 플랜 결제하기 (₩50,000)
                </Button>
                <Button
                  onClick={() => handlePayment("pro")}
                  className="w-full btn-secondary"
                >
                  프로 플랜 결제하기 (₩120,000)
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 pb-0">
                또는{" "}
                <button
                  onClick={() => navigate("/#pricing")}
                  className="text-primary hover:underline"
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
