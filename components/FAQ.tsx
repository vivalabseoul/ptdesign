import { HelpCircle } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "서비스 체험은 어떻게 이용하나요?",
      answer:
        "회원가입 후 신용카드 등록 없이 바로 14일 체험을 시작할 수 있습니다. 체험 기간 동안 선택한 플랜의 모든 기능을 제한 없이 사용하실 수 있습니다.",
    },
    {
      question: "분석은 얼마나 걸리나요?",
      answer:
        "AI 1차 분석은 즉시 완료되며, 전문가 검증을 포함한 최종 리포트는 평균 24시간 이내에 제공됩니다. Enterprise 플랜의 경우 우선 처리가 가능합니다.",
    },
    {
      question: "플랜은 언제든지 변경할 수 있나요?",
      answer:
        "네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 업그레이드 시 즉시 적용되며, 다운그레이드는 다음 결제 주기부터 적용됩니다.",
    },
    {
      question: "어떤 웹사이트든 분석 가능한가요?",
      answer:
        "네, 공개된 URL이 있는 모든 웹사이트를 분석할 수 있습니다. 로그인이 필요한 페이지나 내부 시스템의 경우 별도 상담이 필요합니다.",
    },
    {
      question: "환불 정책은 어떻게 되나요?",
      answer:
        "체험 기간 내 취소 시 비용이 발생하지 않습니다. 유료 플랜 결제 후 7일 이내 서비스에 만족하지 못하신 경우 전액 환불해드립니다.",
    },
    {
      question: "팀원들과 함께 사용할 수 있나요?",
      answer:
        "Professional 플랜부터 팀 협업 기능이 제공됩니다. 팀원을 초대하여 분석 리포트를 공유하고 함께 검토할 수 있습니다.",
    },
  ];

  return (
    <section id="faq" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ color: "var(--primary)" }}>
            궁금하신 점이 있으신가요?
          </h2>
          <p className="text-gray-600">
            ProTouchDesign 서비스에 대해 자주 묻는 질문들을 모았습니다
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 border-2 border-gray-200 hover:border-[var(--secondary)] hover:shadow-lg transition-all duration-300"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "var(--accent)" }}
                >
                  <span className="text-white text-base font-bold">Q</span>
                </div>
                <h4 style={{ color: "var(--primary)" }}>{faq.question}</h4>
              </div>
              <p className="text-gray-600 pl-9">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
