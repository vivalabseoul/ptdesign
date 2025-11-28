import { Lock } from "lucide-react";

interface SubscriptionLockOverlayProps {
  onUpgrade: () => void;
}

export function SubscriptionLockOverlay({
  onUpgrade,
}: SubscriptionLockOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
      <div className="text-center max-w-md px-6">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "var(--accent)" }}
        >
          <Lock className="w-10 h-10 text-white" />
        </div>

        <h3
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--primary)" }}
        >
          구독이 필요한 기능입니다
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed">
          체험 분석은 1회만 제공됩니다. 계속해서 전체 분석 결과를 확인하시려면
          구독을 시작해주세요.
        </p>

        <button
          onClick={onUpgrade}
          className="px-8 py-4 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105"
          style={{ background: "var(--accent)" }}
        >
          구독 플랜 보기
        </button>

        <p className="text-base text-gray-500 mt-4">
          Basic 플랜부터 모든 분석 결과를 무제한으로 확인하실 수 있습니다
        </p>
      </div>
    </div>
  );
}
