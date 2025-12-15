import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { requestPayment, PaymentPlan } from "../utils/payment/nicepay";
import { useNavigate } from "react-router-dom";

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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!isAuthenticated) {
      const confirmed = window.confirm(
        "결제를 진행하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmed) {
        navigate("/login");
      }
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
