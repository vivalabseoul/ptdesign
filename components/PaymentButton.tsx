import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { requestPayment, PaymentPlan } from "../utils/payment/nicepay";

interface PaymentButtonProps {
  planId: PaymentPlan;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function PaymentButton({
  planId,
  className,
  style,
  children,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const handleClick = async () => {
    console.log("💳 결제 버튼 클릭됨");
    console.log("💳 인증 상태:", isAuthenticated);
    console.log("💳 사용자 정보:", user);

    if (!isAuthenticated) {
      console.log("💳 미인증 사용자 - 로그인 모달 열기");
      // 모달로 로그인 유도
      openAuthModal("login");
      return;
    }

    if (!user) {
      console.log("💳 사용자 정보 없음");
      alert("사용자 정보를 찾을 수 없습니다");
      return;
    }

    console.log("💳 결제 요청 시작:", {
      planId,
      userId: user.id,
      userName: user.email,
      userEmail: user.email,
    });

    setLoading(true);

    try {
      const { success, error } = await requestPayment(
        planId,
        user.id,
        user.email || "사용자",
        user.email || ""
      );
      console.log("💳 결제 요청 결과:", { success, error });
      if (!success) {
        alert(error || "결제 처리 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("💳 Payment error:", error);
      alert("결제 처리 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} className={className} style={style}>
      {loading ? "처리 중..." : children}
    </Button>
  );
}
