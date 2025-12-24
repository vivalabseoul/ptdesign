import { HelpCircle } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "분석은 얼마나 걸리나요?",
      answer:
        "선택하신 플랜에 따라 납기가 다릅니다. 퀵 스캔은 4시간, 마이크로 분석은 24시간, 풀페이지 심층은 48시간, 전체 시스템은 72시간 이내에 제공됩니다.",
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
      question: "팀원들과 함께 사용할 수 있나요?",
      answer:
        "전체 시스템 플랜에서는 팀 협업 기능이 제공됩니다. 팀원을 초대하여 분석 리포트를 공유하고 함께 검토할 수 있습니다.",
    },
    {
      question: "어떤 결제 수단을 사용할 수 있나요?",
      answer:
        "나이스페이를 통해 신용카드, 체크카드, 계좌이체, 가상계좌 등 다양한 결제 수단을 지원합니다. 모든 결제는 안전하게 암호화되어 처리됩니다.",
    },
    {
      question: "환불이 가능한가요?",
      answer:
        "분석 작업이 시작되기 전에는 전액 환불이 가능합니다. 분석이 진행 중이거나 완료된 경우에는 환불이 어려우니, 결제 전 플랜을 신중히 선택해 주세요.",
    },
    {
      question: "결제 정보는 안전한가요?",
      answer:
        "모든 결제는 나이스페이의 보안 시스템을 통해 처리되며, PCI-DSS 인증을 받은 안전한 결제 환경을 제공합니다. 카드 정보는 저장되지 않습니다.",
    },
    {
      question: "영수증은 어떻게 받나요?",
      answer:
        "결제 완료 후 등록하신 이메일로 영수증이 자동 발송됩니다. 대시보드의 결제 내역에서도 언제든지 영수증을 다운로드할 수 있습니다.",
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
