import { ArrowLeft, TrendingUp, Users, DollarSign, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export function CaseDetailPage() {
  const caseStudy = {
    company: "음악서비스플랫폼",
    industry: "음악 스트리밍",
    timeline: "3개월",
    improvement: "+47%",
    metric: "전환율 증가",
    before: "/ui-before.png",
    after: "/ui-after.png",
    challenge: "기존 음악 스트리밍 플랫폼은 복잡한 네비게이션 구조와 비직관적인 검색 기능으로 인해 사용자들이 원하는 음악을 찾는 데 어려움을 겪고 있었습니다. 특히 신규 사용자의 이탈률이 높았고, 유료 전환율이 업계 평균에 크게 못 미치는 상황이었습니다.",
    solution: "ProTouchDesign은 사용자 행동 분석을 통해 핵심 문제점을 파악하고, 사용자 중심의 UI/UX 개선안을 제시했습니다. 검색 알고리즘을 개선하고, 개인화된 추천 시스템을 도입했으며, 결제 프로세스를 단순화했습니다.",
    results: [
      {
        icon: TrendingUp,
        title: "전환율 47% 증가",
        description: "유료 구독 전환율이 기존 대비 47% 향상되었습니다."
      },
      {
        icon: Users,
        title: "이탈률 35% 감소",
        description: "페이지 이탈률이 35% 감소하여 사용자 체류 시간이 증가했습니다."
      },
      {
        icon: DollarSign,
        title: "매출 60% 증가",
        description: "개선 후 3개월간 매출이 60% 증가했습니다."
      },
      {
        icon: Clock,
        title: "검색 시간 50% 단축",
        description: "개선된 검색 기능으로 사용자가 원하는 음악을 찾는 시간이 절반으로 줄었습니다."
      }
    ],
    keyFeatures: [
      "결제 프로세스 3단계 감소",
      "페이지 이탈률 35% 감소",
      "고객 만족도 92%",
      "모바일 최적화로 모바일 사용자 65% 증가",
      "개인화 추천 알고리즘 도입",
      "검색 정확도 85% 향상"
    ],
    testimonial: {
      text: "ProTouchDesign의 분석과 개선 지침 덕분에 우리 플랫폼의 사용자 경험이 완전히 바뀌었습니다. 특히 유료 전환율 증가는 기대 이상이었습니다.",
      author: "김민수",
      position: "CEO, 음악서비스플랫폼"
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--primary)" }}>
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative" style={{ background: "var(--primary)", paddingTop: "8rem", paddingBottom: "5rem" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/#cases"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>사례 목록으로 돌아가기</span>
            </Link>

            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "var(--accent)" }}>
                  {caseStudy.industry}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-semibold">
                  {caseStudy.timeline}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6">{caseStudy.company}</h1>
              <p className="text-2xl text-white/90 mb-8">
                사용자 경험 개선으로 전환율 47% 향상 달성
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl font-black mb-2" style={{ color: "var(--accent)" }}>
                    +47%
                  </div>
                  <div className="text-lg">전환율 증가</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl font-black mb-2" style={{ color: "var(--accent)" }}>
                    -35%
                  </div>
                  <div className="text-lg">이탈률 감소</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl font-black mb-2" style={{ color: "var(--accent)" }}>
                    92%
                  </div>
                  <div className="text-lg">고객 만족도</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--primary)" }}>
              도전 과제
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              {caseStudy.challenge}
            </p>
          </div>
        </section>

        {/* Before & After Section */}
        <section className="py-20" style={{ background: "var(--bg-light)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--primary)" }}>
              개선 전후 비교
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="space-y-4">
                <div className="text-xl font-bold text-red-600 flex items-center gap-2 bg-red-50 px-5 py-3 rounded-lg w-fit">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  개선 전
                </div>
                <div className="relative rounded-2xl overflow-hidden border-4 border-red-300 shadow-xl">
                  <ImageWithFallback
                    src={caseStudy.before}
                    alt={`${caseStudy.company} 개선 전`}
                    className="w-full h-[600px] object-cover object-top grayscale opacity-60"
                  />
                </div>
                <p className="text-lg text-gray-600 font-medium">
                  복잡한 네비게이션, 비직관적인 검색, 긴 결제 프로세스
                </p>
              </div>

              {/* After */}
              <div className="space-y-4">
                <div className="text-xl font-bold flex items-center gap-2 bg-green-50 px-5 py-3 rounded-lg w-fit ml-auto" style={{ color: "var(--success)" }}>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  개선 후
                </div>
                <div
                  className="relative rounded-2xl overflow-hidden border-4 shadow-2xl ring-4 ring-green-200"
                  style={{ borderColor: "var(--success)" }}
                >
                  <ImageWithFallback
                    src={caseStudy.after}
                    alt={`${caseStudy.company} 개선 후`}
                    className="w-full h-[600px] object-cover object-top brightness-110 saturate-110"
                  />
                </div>
                <p className="text-lg text-gray-600 font-medium text-right">
                  직관적인 UI, 개인화 추천, 간편한 결제
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--primary)" }}>
              솔루션
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              {caseStudy.solution}
            </p>

            {/* Key Features */}
            <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--primary)" }}>
              주요 개선 사항
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudy.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:border-purple-200 transition-all"
                >
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: "var(--success)" }} />
                  <p className="text-lg text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20" style={{ background: "var(--bg-light)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--primary)" }}>
              성과
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {caseStudy.results.map((result, idx) => {
                const Icon = result.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: "var(--accent)15" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "var(--accent)" }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                      {result.title}
                    </h3>
                    <p className="text-gray-600">
                      {result.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-12">
              <div className="absolute top-8 left-8 text-6xl opacity-20" style={{ color: "var(--accent)" }}>
                "
              </div>
              <p className="text-2xl text-gray-800 leading-relaxed mb-8 relative z-10">
                {caseStudy.testimonial.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: "var(--accent)" }}>
                  {caseStudy.testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg" style={{ color: "var(--primary)" }}>
                    {caseStudy.testimonial.author}
                  </div>
                  <div className="text-gray-600">
                    {caseStudy.testimonial.position}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20" style={{ background: "var(--primary)" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              당신의 프로젝트도 성공시킬 수 있습니다
            </h2>
            <p className="text-xl text-white/90 mb-8">
              ProTouchDesign과 함께 사용자 경험을 개선하고 비즈니스 성과를 높이세요
            </p>
            <Link
              to="/"
              className="inline-block px-12 py-5 rounded-2xl text-lg font-bold transition-all hover:shadow-2xl hover:scale-105"
              style={{ background: "var(--accent)", color: "white" }}
            >
              무료로 분석 시작하기
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
