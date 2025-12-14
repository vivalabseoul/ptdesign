import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { pricingTranslations } from "../translations/pricing";

export function Pricing() {
  const { openAuthModal } = useAuth();
  const { language } = useLanguage();
  
  const t = pricingTranslations[language];
  const plans = t.plans;

  return (
    <section id="pricing" className="relative py-32 overflow-hidden" style={{ background: "#0a0a0a" }}>
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: "var(--accent)" }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: "var(--secondary)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white tracking-tight">
            비즈니스 성장을 위한<br />
            <span style={{ color: "var(--accent)" }}>
              최적의 솔루션
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            합리적인 가격으로 전문가의 분석과 AI의 정밀함을 경험하세요.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 items-stretch justify-center max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative rounded-3xl p-8 flex flex-col transition-all duration-500 group h-full
                ${plan.highlight 
                  ? "bg-white/10 border-2 border-[var(--accent)] shadow-[0_0_50px_-12px_rgba(238,108,77,0.3)] scale-105 z-10" 
                  : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2"
                }
              `}
              style={{ backdropFilter: "blur(20px)" }}
            >
              {/* Highlight Glow */}
              {plan.highlight && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[var(--accent)]/10 to-transparent pointer-events-none" />
              )}

              {/* Badge - Top Center Overlapping Border */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span 
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg border border-white/10 text-white ${plan.badgeColor}`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header - Centered */}
              <div className="text-center mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-gray-200"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <span className={`text-4xl lg:text-5xl font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-gray-100"}`}>
                    ₩{plan.price}
                  </span>
                </div>
                <p className={`text-sm min-h-[40px] leading-relaxed mx-auto max-w-[240px] ${plan.highlight ? "text-gray-200" : "text-gray-400"}`}>
                  {plan.usp}
                </p>
              </div>

              {/* Divider */}
              <div className={`h-px w-full mb-8 ${plan.highlight ? "bg-white/20" : "bg-white/10"}`} />

              {/* Features */}
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-start gap-3 text-sm ${plan.highlight ? "text-gray-100" : "text-gray-400"}`}>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.highlight ? "bg-[var(--accent)] text-white" : "bg-white/10 text-gray-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => openAuthModal("signup")}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  plan.highlight
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30 hover:shadow-[var(--accent)]/50"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                지금 시작하기
              </button>
            </div>
          ))}
        </div>

        {/* Footer Notes & Link */}
        <div className="border-t border-white/10 pt-10">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3 text-sm text-gray-500">
              <p className="flex items-start gap-2">
                <span className="text-[var(--accent)]">•</span>
                <span><strong>환불 정책:</strong> 단순 변심 환불 대신 대체 프롬프트 2종을 무상으로 제공해 드립니다. (7일 이내 요청 시)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[var(--accent)]">•</span>
                <span><strong>납기 기준:</strong> 퀵 스캔은 4시간 내, 마이크로 분석은 24시간 내, 그 외 상품은 영업일 기준 72시간 내 납품됩니다.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[var(--accent)]">•</span>
                <span><strong>범위 안내:</strong> 지정된 범위를 초과하는 경우 상위 패키지로 전환을 안내해 드릴 수 있습니다.</span>
              </p>
            </div>
            <div className="text-center lg:text-right">
              <a 
                href="/pricing-detail" 
                className="group inline-flex items-center gap-2 font-semibold transition-colors text-gray-400 hover:text-white"
              >
                더 많은 상품 보기 (캠페인 킷, 대량 바우처 등)
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
