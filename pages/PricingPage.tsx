import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Check, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export function PricingPage() {
  const { openAuthModal } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      id: "micro-snap",
      name: "마이크로 스냅",
      price: "29,000",
      desc: "첫 화면만 빠르게 개선",
      usp: "24시간 내 납품",
      features: [
        "1 URL, 퍼스트 스크린 한정",
        "정량 점수 + 프롬프트 3종",
        "미니 CSS 토큰 제공",
        "PDF + 프롬프트 TXT 파일"
      ],
      badge: "추천",
      highlight: false,
    },
    {
      id: "snap",
      name: "스냅 (Entry)",
      price: "99,000",
      desc: "가성비 진단으로 이슈 파악",
      usp: "가성비 진단으로 이슈를 빠르게 파악",
      features: [
        "1페이지 전체 스냅 진단",
        "개선 프롬프트 5종",
        "상세 체크리스트 포함",
        "PDF + 프롬프트 TXT 파일"
      ],
      badge: "POPULAR",
      highlight: true,
    },
    {
      id: "cvr-booster",
      name: "CVR 부스터",
      price: "299,000",
      desc: "바로 테스트 가능한 AB 레디 팩",
      usp: "바로 테스트 가능한 AB 레디 팩",
      features: [
        "심층 분석 + A/B 카피 3세트",
        "이미지 프롬프트 5종",
        "전체 CSS 토큰 가이드",
        "PDF + 프롬프트 TXT 파일"
      ],
      badge: "베스트",
      highlight: false,
    },
  ];

  const comparisonFeatures = [
    { name: "분석 범위", micro: "퍼스트 스크린", snap: "1페이지 전체", cvr: "심층 분석" },
    { name: "개선 프롬프트", micro: "3종", snap: "5종", cvr: "A/B 카피 3세트" },
    { name: "CSS 토큰", micro: "미니", snap: "기본", cvr: "전체 가이드" },
    { name: "납품 형식", micro: "PDF + TXT", snap: "PDF + TXT", cvr: "PDF + TXT" },
    { name: "이미지 프롬프트", micro: false, snap: false, cvr: true },
    { name: "체크리스트", micro: false, snap: true, cvr: true },
    { name: "납기", micro: "24시간", snap: "72시간", cvr: "72시간" },
  ];

  const faqs = [
    {
      q: "환불 정책은 어떻게 되나요?",
      a: "단순 변심 환불 대신 대체 프롬프트 2종을 무상으로 제공해 드립니다. (7일 이내 요청 시)"
    },
    {
      q: "납기는 얼마나 걸리나요?",
      a: "마이크로 스냅은 24시간 내, 그 외 상품은 영업일 기준 72시간 내 납품됩니다."
    },
    {
      q: "분석 범위를 초과하면 어떻게 되나요?",
      a: "지정된 범위를 초과하는 경우 상위 패키지로 전환을 안내해 드릴 수 있습니다."
    },
    {
      q: "여러 페이지를 분석하고 싶어요",
      a: "CVR 부스터 패키지 이상을 선택하시거나, 별도 문의를 통해 맞춤 견적을 받으실 수 있습니다."
    },
    {
      q: "결제 방법은 무엇이 있나요?",
      a: "신용카드, 계좌이체, 법인카드 등 다양한 결제 방법을 지원합니다."
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--primary)" }}>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent)]/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--secondary)]/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight text-white">
            비즈니스 성장을 위한 <span style={{ color: 'var(--accent)' }}>최적의 솔루션</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            합리적인 가격으로 전문가의 분석과 AI의 정밀함을 경험하세요.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative rounded-3xl p-8 flex flex-col transition-all duration-500 group
                  ${plan.highlight 
                    ? "bg-white/10 border-2 border-[var(--accent)] shadow-[0_0_50px_-12px_rgba(238,108,77,0.3)] scale-105" 
                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2"
                  }
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span 
                      className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg border border-white/10 ${
                        plan.highlight 
                          ? "bg-[var(--accent)] text-white" 
                          : (plan.badge === "추천" ? "bg-[var(--secondary)] text-white" : "bg-white text-black")
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-gray-200"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className={`text-4xl lg:text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-100"}`}>
                      ₩{plan.price}
                    </span>
                  </div>
                  <p className={`text-sm min-h-[40px] ${plan.highlight ? "text-gray-200" : "text-gray-400"}`}>
                    {plan.usp}
                  </p>
                </div>

                <div className={`h-px w-full mb-8 ${plan.highlight ? "bg-white/20" : "bg-white/10"}`} />

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

                <button
                  onClick={() => openAuthModal("signup")}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-[1.02] ${
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
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            상세 기능 비교
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-gray-400 font-semibold">기능</th>
                    <th className="text-center p-6 text-white font-semibold">마이크로 스냅</th>
                    <th className="text-center p-6 text-white font-semibold bg-white/5">스냅 (Entry)</th>
                    <th className="text-center p-6 text-white font-semibold">CVR 부스터</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => (
                    <tr key={idx} className="border-b border-white/10 last:border-0">
                      <td className="p-6 text-gray-300">{feature.name}</td>
                      <td className="p-6 text-center text-gray-400">
                        {typeof feature.micro === 'boolean' ? (
                          feature.micro ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-gray-600" />
                        ) : feature.micro}
                      </td>
                      <td className="p-6 text-center text-gray-400 bg-white/5">
                        {typeof feature.snap === 'boolean' ? (
                          feature.snap ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-gray-600" />
                        ) : feature.snap}
                      </td>
                      <td className="p-6 text-center text-gray-400">
                        {typeof feature.cvr === 'boolean' ? (
                          feature.cvr ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-gray-600" />
                        ) : feature.cvr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              자주 묻는 질문
            </h2>
            <p className="text-gray-400 text-lg">
              궁금하신 점이 있으신가요? 아래에서 답변을 찾아보세요.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`
                  bg-white/5 border rounded-2xl overflow-hidden transition-all duration-300
                  ${openFaq === idx 
                    ? 'border-[var(--accent)] bg-white/10 shadow-[0_0_30px_-12px_rgba(238,108,77,0.3)]' 
                    : 'border-white/10 hover:border-white/20 hover:bg-white/8'
                  }
                `}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex items-start gap-4 transition-all"
                >
                  <div className="flex-shrink-0">
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                      openFaq === idx 
                        ? 'bg-[var(--accent)] text-white' 
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      Q
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className={`text-lg font-semibold block transition-colors ${
                      openFaq === idx ? 'text-white' : 'text-gray-200'
                    }`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    openFaq === idx 
                      ? 'bg-[var(--accent)] text-white rotate-180' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6 pl-[4.5rem]">
                    <div className="flex gap-3">
                      <span className="inline-block px-3 py-1 rounded-lg text-sm font-bold bg-[var(--secondary)] text-white flex-shrink-0 h-fit">
                        A
                      </span>
                      <div className="text-gray-300 leading-relaxed bg-white/5 rounded-xl p-4 flex-1">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-16 border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            지금 바로 시작하세요
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            14일 무료 체험으로 ProTouchDesign의 강력한 분석 기능을 경험해보세요.<br />
            신용카드 등록 없이 바로 시작할 수 있습니다.
          </p>
          <button
            onClick={() => openAuthModal("signup")}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(238,108,77,0.5)]"
            style={{ background: 'var(--accent)' }}
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
