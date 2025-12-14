import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PaymentButton } from "../components/PaymentButton";
import { PaymentPlan } from "../utils/payment/nicepay";

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      id: "quick-scan",
      planId: "basic" as PaymentPlan,
      name: "퀵 스캔",
      price: "29K",
      priceNum: 29000,
      desc: "뭔가 이상한데? 빠른 점검",
      usp: "4시간 납기 · 긴급/점검용",
      features: [
        "메인/랜딩페이지",
        "기초 점검 레벨",
        "개선 프롬프트 1종",
        "1쪽 PDF 리포트 + TXT",
        "4시간 초고속 납기"
      ],
      badge: "가장 저렴!",
      highlight: false,
    },
    {
      id: "micro-analysis",
      planId: "basic" as PaymentPlan,
      name: "마이크로 분석",
      price: "99K",
      priceNum: 99000,
      desc: "스타트업, MVP, 긴급 진단",
      usp: "24시간 납기 · 1페이지 완전 분석",
      features: [
        "1페이지 (모바일/데스크톱)",
        "기초 분석 + 기본 CVR 분석",
        "개선 프롬프트 3종",
        "기초 접근성 감사 + 체크리스트",
        "2쪽 PDF 리포트 + TXT",
        "24시간 빠른 납기"
      ],
      badge: "가성비 최고!",
      highlight: false,
    },
    {
      id: "full-page-deep",
      planId: "pro" as PaymentPlan,
      name: "풀페이지 심층",
      price: "299K",
      priceNum: 299000,
      desc: "중소기업, 이커머스 (최대 3페이지)",
      usp: "72시간 납기 · 추가 페이지당 ₩80K",
      features: [
        "전체 1페이지 (크로스브라우징)",
        "심층 분석 + 심화 CVR 분석",
        "개선 프롬프트 5종 + 이미지 3개",
        "완전 접근성 감사 + 히트맵/세션",
        "5쪽 PDF 리포트 + TXT + 체크리스트",
        "72시간 납기"
      ],
      badge: "인기",
      highlight: true,
    },
    {
      id: "full-system",
      planId: "pro" as PaymentPlan,
      name: "전체 시스템",
      price: "협의",
      priceNum: 799000,
      desc: "대규모 플랫폼, 장기 시스템 (최소 799K)",
      usp: "72시간 납기 · 맞춤 견적 제공",
      features: [
        "전체 사이트 (크로스브라우징 심층)",
        "전문가 분석 + 고급 CVR (퍼널)",
        "개선 프롬프트 5종+ + 이미지 5개+",
        "CSS 가이드 (기본/전체)",
        "전사 접근성 표준화 + 심층 사용자 테스트",
        "8~20쪽 상세 PDF 리포트 + TXT + 상세 체크리스트",
        "72시간 납기"
      ],
      badge: "풀버전!",
      highlight: false,
    },
  ];

  const comparisonFeatures = [
    // 분석 범위
    { category: "분석 범위", name: "페이지 범위", quick: "메인페이지 혹은 랜딩페이지", micro: "1페이지", full: "전체 1페이지", system: "전체 사이트" },
    { category: "분석 범위", name: "환경 분석", quick: "모바일/데스크톱", micro: "모바일/데스크톱", full: "모바일 + 태블릿 + 데스크톱 (크로스브라우징)", system: "모바일 + 태블릿 + 데스크톱 (크로스브라우징) 심층" },
    
    // 분석 깊이
    { category: "분석 깊이", name: "분석 레벨", quick: "기초 점검", micro: "기초", full: "심층", system: "전문가" },
    { category: "분석 깊이", name: "CVR 분석", quick: false, micro: "기본", full: "심화", system: "고급 (퍼널)" },
    
    // 개선 제안
    { category: "개선 제안", name: "프롬프트", quick: "1종", micro: "3종", full: "5종", system: "5종+" },
    { category: "개선 제안", name: "CSS", quick: false, micro: false, full: false, system: "✓ 기본/전체" },
    
    // 추가 항목
    { category: "추가 항목", name: "접근성 감사", quick: false, micro: "기초", full: "완전", system: "전사 표준화" },
    { category: "추가 항목", name: "모바일 분석", quick: "포함", micro: "기본", full: "심화", system: "전문가" },
    { category: "추가 항목", name: "사용자 데이터", quick: false, micro: false, full: "히트맵/세션", system: "심층+테스트" },
    
    // 납품물
    { category: "납품물", name: "리포트", quick: "1쪽", micro: "2쪽", full: "5쪽", system: "8~20쪽" },
    { category: "납품물", name: "체크리스트", quick: false, micro: true, full: true, system: "✓ 상세" },
    { category: "납품물", name: "이미지 프롬프트", quick: false, micro: false, full: "3개", system: "5개+" },
    { category: "납품물", name: "납품 형식", quick: "PDF + TXT", micro: "PDF + TXT", full: "PDF + TXT", system: "PDF + TXT" },
    
    // 서비스 조건
    { category: "서비스 조건", name: "납기", quick: "4시간", micro: "24시간", full: "72시간", system: "72시간" },
    { category: "서비스 조건", name: "가격", quick: "₩29K", micro: "₩99K", full: "₩299K (최대 3페이지, +₩80K/페이지)", system: "협의 (최소 ₩799K)" },
    { category: "서비스 조건", name: "추천 대상", quick: "긴급/점검", micro: "스타트업/MVP", full: "중소기업/이커머스", system: "대규모/플랫폼" },
  ];

  const faqs = [
    {
      q: "환불 정책은 어떻게 되나요?",
      a: "단순 변심 환불 대신 대체 프롬프트 2종을 무상으로 제공해 드립니다. (7일 이내 요청 시)"
    },
    {
      q: "납기는 얼마나 걸리나요?",
      a: "퀵 스캔은 4시간 내, 마이크로 분석은 24시간 내, 그 외 상품은 영업일 기준 72시간 내 납품됩니다."
    },
    {
      q: "분석 범위를 초과하면 어떻게 되나요?",
      a: "지정된 범위를 초과하는 경우 상위 패키지로 전환을 안내해 드릴 수 있습니다."
    },
    {
      q: "여러 페이지를 분석하고 싶어요",
      a: "풀페이지 심층 또는 전체 시스템 패키지를 선택하시거나, 별도 문의를 통해 맞춤 견적을 받으실 수 있습니다."
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
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-white/10 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--secondary)' }}
          >
            Pricing
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight text-white">
            비즈니스 성장을 위한<br /><span style={{ color: 'var(--accent)' }}>최적의 솔루션</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            합리적인 가격으로 전문가의 분석과 AI의 정밀함을 경험하세요.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                <PaymentButton
                  planId={plan.planId}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                    plan.highlight
                      ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30 hover:shadow-[var(--accent)]/50"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  지금 시작하기
                </PaymentButton>
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
                    <th className="text-center p-6 text-white font-semibold">퀵 스캔</th>
                    <th className="text-center p-6 text-white font-semibold">마이크로 분석</th>
                    <th className="text-center p-6 text-white font-semibold bg-white/5">풀페이지 심층</th>
                    <th className="text-center p-6 text-white font-semibold">전체 시스템</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => (
                    <tr key={idx} className="border-b border-white/10 last:border-0">
                      <td className="p-6 text-gray-300">
                        {feature.category && idx > 0 && comparisonFeatures[idx - 1].category !== feature.category && (
                          <div className="font-bold text-white mb-2">{feature.category}</div>
                        )}
                        {idx === 0 && <div className="font-bold text-white mb-2">{feature.category}</div>}
                        <div className="pl-4">{feature.name}</div>
                      </td>
                      <td className="p-6 text-center text-gray-400">
                        {typeof feature.quick === 'boolean' ? (
                          feature.quick ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-gray-600" />
                        ) : feature.quick}
                      </td>
                      <td className="p-6 text-center text-gray-400">
                        {typeof feature.micro === 'boolean' ? (
                          feature.micro ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-gray-600" />
                        ) : feature.micro}
                      </td>
                      <td className="p-6 text-center text-gray-400 bg-white/5">
                        {typeof feature.full === 'boolean' ? (
                          feature.full ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-gray-600" />
                        ) : feature.full}
                      </td>
                      <td className="p-6 text-center text-gray-400">
                        {typeof feature.system === 'boolean' ? (
                          feature.system ? <Check className="w-5 h-5 mx-auto text-green-400" /> : <X className="w-5 h-5 mx-auto text-gray-600" />
                        ) : feature.system}
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
            ProTouchDesign의 전문적인 UX 분석 서비스로<br />
            웹사이트의 성과를 극대화하세요.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(238,108,77,0.5)]"
            style={{ background: 'var(--accent)' }}
          >
            상담 신청하기
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
