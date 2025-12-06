import { useState } from "react";
import { ArrowRight, BarChart2, FileText, CheckCircle } from "lucide-react";

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "guideline">("overview");

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "var(--primary)" }}>
      {/* Background Logo */}
      <div className="absolute top-0 w-full opacity-10 pointer-events-none select-none">
        <img src="/images/reporty_bg.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 
                className="text-3xl lg:text-4xl font-bold mb-6 leading-tight text-white"
              >
                데이터로 증명하는<br />
                <span className="text-white">확실한 개선 효과</span>
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                감에 의존하는 디자인은 이제 그만.<br />
                AI의 정밀한 데이터 분석과 전문가의 통찰력이 결합된
                상세 리포트를 받아보세요.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "객관적인 UX/UI 점수 및 등급 산정",
                "경쟁사 대비 성능/사용성 벤치마킹",
                "즉시 적용 가능한 구체적인 개선 가이드",
                "우선순위에 따른 단계별 실행 전략"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-white" />
                  <span className="text-white font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={scrollToContact}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:shadow-lg hover:scale-105"
              style={{ background: "var(--accent)" }}
            >
              무료 진단 신청하기
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Content - Image Showcase */}
          <div className="relative">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 p-1.5 rounded-xl inline-flex backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                    activeTab === "overview"
                      ? "text-white shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                  style={activeTab === "overview" ? { background: "var(--accent)" } : {}}
                >
                  <BarChart2 className="w-5 h-5" />
                  종합 분석
                </button>
                <button
                  onClick={() => setActiveTab("guideline")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                    activeTab === "guideline"
                      ? "text-white shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                  style={activeTab === "guideline" ? { background: "var(--accent)" } : {}}
                >
                  <FileText className="w-5 h-5" />
                  개선 지침
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-[16/10] bg-white/5 backdrop-blur-sm">
              <div 
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex items-start justify-center ${
                  activeTab === "overview" ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src="/images/report_mockup_overview.png"
                  alt="종합 분석 리포트 예시"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div 
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex items-start justify-center ${
                  activeTab === "guideline" ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src="/images/report_mockup_guideline.png"
                  alt="개선 지침서 예시"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div 
              className="absolute -z-10 top-1/2 -right-12 w-72 h-72 rounded-full blur-3xl opacity-30 bg-white"
            />
            <div 
              className="absolute -z-10 -bottom-12 -left-12 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: "var(--accent)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
