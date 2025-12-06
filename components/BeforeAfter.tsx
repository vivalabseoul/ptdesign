import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function BeforeAfter() {
  // 한 개의 주요 사례만 표시
  const featuredCase = {
    id: 1,
    company: "음악서비스플랫폼",
    before: "/ui-before.png",
    after: "/ui-after.png",
    improvement: "+47%",
    metric: "전환율 증가",
    description: "복잡한 네비게이션 구조 개선 및 결제 프로세스 단순화로 사용자 경험을 혁신적으로 개선했습니다.",
    details: ["결제 프로세스 3단계 감소", "페이지 이탈률 35% 감소", "고객 만족도 92%"]
  };

  return (
    <section id="cases" className="relative overflow-hidden" style={{ background: "var(--bg-light)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 style={{ color: "var(--primary)" }} className="mb-4">
            실제 개선 사례
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ProTouchDesign의 분석과 개선 지침을 적용한 기업들의 실제 성과입니다
          </p>
        </div>

        {/* Featured Case - Dynamic Layout */}
        <div className="relative bg-white rounded-3xl p-12 shadow-2xl overflow-hidden">
          {/* Background Gradient Effect */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-50 to-transparent opacity-50" />

          {/* Company Badge */}
          <div className="relative z-10 flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6" style={{ color: "var(--accent)" }} />
            <h3 style={{ color: "var(--primary)" }} className="text-3xl font-bold">
              {featuredCase.company}
            </h3>
          </div>

          {/* Main Content Grid - 2:1 ratio for images vs metrics */}
          <div className="relative grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
            {/* Left Side - Side by Side Images (Larger) */}
            <div className="space-y-6">
              {/* Before and After Images - Side by Side */}
              <div className="grid grid-cols-2 gap-8">
                {/* Before Image */}
                <div className="space-y-4">
                  <div className="text-xl font-bold text-red-600 flex items-center gap-2 bg-red-50 px-5 py-3 rounded-lg w-fit">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    개선 전
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border-4 border-red-300 shadow-xl transform transition-all hover:scale-105">
                    <ImageWithFallback
                      src={featuredCase.before}
                      alt={`${featuredCase.company} 개선 전`}
                      className="w-full h-[500px] object-cover object-top grayscale opacity-60"
                    />
                  </div>
                  <p className="text-base text-gray-600 text-center font-medium">복잡한 UI, 낮은 전환율</p>
                </div>

                {/* After Image */}
                <div className="space-y-4">
                  <div className="text-xl font-bold flex items-center gap-2 bg-green-50 px-5 py-3 rounded-lg w-fit ml-auto" style={{ color: "var(--success)" }}>
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    개선 후
                  </div>
                  <div
                    className="relative rounded-2xl overflow-hidden border-4 shadow-2xl transform transition-all hover:scale-105 ring-4 ring-green-200"
                    style={{ borderColor: "var(--success)" }}
                  >
                    <ImageWithFallback
                      src={featuredCase.after}
                      alt={`${featuredCase.company} 개선 후`}
                      className="w-full h-[500px] object-cover object-top brightness-110 saturate-110"
                    />
                  </div>
                  <p className="text-base text-gray-600 text-center font-medium">직관적 UI, 높은 사용성</p>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Metrics with Design Elements */}
            <div className="relative z-10 space-y-6 lg:sticky lg:top-8">
              {/* Circular Progress Indicator */}
              <div className="relative">
                <div className="flex items-center justify-center">
                  {/* Outer Circle */}
                  <div className="relative w-48 h-48">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="552.92"
                        strokeDashoffset="275"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--accent)" />
                          <stop offset="100%" stopColor="var(--secondary)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-black" style={{ color: "var(--accent)" }}>
                        {featuredCase.improvement}
                      </div>
                      <div className="text-sm font-semibold text-gray-600 mt-1">
                        {featuredCase.metric}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sparkles decoration */}
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              </div>

              {/* Visual Stats Cards */}
              <div className="space-y-3">
                {featuredCase.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg group"
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, var(--accent) 2px, transparent 2px)',
                        backgroundSize: '12px 12px'
                      }} />
                    </div>

                    {/* Number Badge */}
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
                        style={{ background: 'var(--accent)' }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                          {detail}
                        </p>
                      </div>
                      {/* Checkmark */}
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          background: 'var(--accent)',
                          width: `${85 + idx * 5}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Description with Icon */}
              <div className="relative p-4 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50">
                <div className="flex gap-3">
                  <TrendingUp className="w-6 h-6 flex-shrink-0" style={{ color: "var(--accent)" }} />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {featuredCase.description}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                to="/case-detail"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all group shadow-lg hover:shadow-xl"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <span>상세 사례 보기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
