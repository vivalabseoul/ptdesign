import { ArrowRight, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function BeforeAfter() {
  const cases = [
    {
      id: 1,
      company: "E-commerce 플랫폼",
      before: "/ui-before.png",
      after: "/ui-after.png",
      improvement: "+47%",
      metric: "전환율 증가",
      description: "복잡한 네비게이션 구조 개선 및 결제 프로세스 단순화",
    },
    {
      id: 2,
      company: "SaaS 대시보드",
      before: "/ui-before.png",
      after: "/ui-after.png",
      improvement: "+62%",
      metric: "사용자 만족도",
      description: "정보 계층 구조 재설계 및 시각적 가독성 향상",
    },
  ];

  return (
    <section id="cases" style={{ background: "var(--bg-light)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 style={{ color: "var(--primary)" }} className="mb-4">
            실제 개선 사례
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ProTouchDesign의 분석과 개선 지침을 적용한 기업들의 실제 성과입니다
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {cases.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Company Name */}
              <div className="flex items-center justify-between mb-6">
                <h4 style={{ color: "var(--primary)" }}>{item.company}</h4>
                <div
                  className="px-4 py-2 rounded-full"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <span className="font-bold">{item.improvement}</span>
                  <span className="text-base ml-1">{item.metric}</span>
                </div>
              </div>

              {/* Before / After Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-base font-semibold mb-2 text-gray-500">
                    개선 전
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-gray-200">
                    <ImageWithFallback
                      src={item.before}
                      alt={`${item.company} 개선 전`}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                </div>

                <div>
                  <div
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    개선 후
                  </div>
                  <div
                    className="relative aspect-[4/3] rounded-lg overflow-hidden border-2"
                    style={{ borderColor: "var(--accent)" }}
                  >
                    <ImageWithFallback
                      src={item.after}
                      alt={`${item.company} 개선 후`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg">
                      <TrendingUp
                        className="w-4 h-4"
                        style={{ color: "var(--success)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{item.description}</p>

              {/* CTA */}
              <button
                className="flex items-center gap-2 text-base font-semibold hover:gap-3 transition-all"
                style={{ color: "var(--accent)" }}
              >
                <span>상세 사례 보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            당신의 웹사이트도 이런 성과를 낼 수 있습니다
          </p>
          <button
            className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
            style={{ background: "var(--accent)", color: "white" }}
          >
            분석 시작하기
          </button>
        </div>
      </div>
    </section>
  );
}
