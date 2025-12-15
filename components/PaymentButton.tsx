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
    if (!isAuthenticated) {
      // 모달로 로그인 유도
      openAuthModal("login");
      return;
    }

    if (!user) {
      alert("사용자 정보를 찾을 수 없습니다");
      return;
    }

    setLoading(true);

    try {
      const { success, error } = await requestPayment(
        planId,
        user.id,
        user.email || "사용자",
        user.email || ""
      );
      if (!success) {
        alert(error || "결제 처리 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("Payment error:", error);
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
