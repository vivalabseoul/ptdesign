import {
  BarChart3,
  FileText,
  Sparkles,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

export function ServiceFeatures() {
  const features = [
    {
      icon: BarChart3,
      title: "데이터 기반 분석 리포트",
      description:
        "UI 디자인, UX 플로우, 접근성, 모바일 대응 등 핵심 지표를 수치화하고 등급으로 시각화합니다",
      color: "var(--accent)",
    },
    {
      icon: FileText,
      title: "AI 작업 지침서",
      description:
        "디자이너 인사이트를 기반으로 한 실행 가능한 프롬프트 형태의 개선 가이드를 제공합니다",
      color: "var(--secondary)",
    },
    {
      icon: Sparkles,
      title: "AI + 전문가 검증",
      description:
        "AI가 1차 분석을 진행하고, 실무 경험이 풍부한 UX 전문가가 검수하여 정확도를 보장합니다",
      color: "var(--warning)",
    },
    {
      icon: Clock,
      title: "빠른 분석 속도",
      description:
        "URL 입력 후 평균 24시간 이내 완성된 리포트와 지침서를 받아볼 수 있습니다",
      color: "var(--success)",
    },
    {
      icon: Shield,
      title: "보안 및 개인정보 보호",
      description:
        "웹사이트 데이터는 암호화되어 처리되며, 분석 완료 후 안전하게 관리됩니다",
      color: "var(--primary)",
    },
    {
      icon: Zap,
      title: "지속적인 모니터링",
      description:
        "정기적인 재분석을 통해 개선 전후를 비교하고 지속적인 UX 향상을 지원합니다",
      color: "var(--accent)",
    },
  ];

  return (
    <section id="service" className="relative py-32 overflow-hidden" style={{ background: "var(--primary)" }}>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{ background: "var(--accent)" }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{ background: "var(--secondary)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white tracking-tight">
            왜 <span style={{ color: "var(--accent)" }}>ProTouchDesign</span>인가?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            단순한 분석 도구를 넘어, 실제 개선까지 이어지는 실행 가능한
            인사이트를 제공합니다
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="group p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-start text-left hover:-translate-y-2 backdrop-blur-sm"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s`,
                  animationFillMode: "backwards",
                }}
              >
                {/* Title */}
                <h4 
                  className="text-3xl font-bold mb-4"
                  style={{ color: feature.color === "var(--primary)" ? "white" : feature.color }}
                >
                  {feature.title}
                </h4>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
