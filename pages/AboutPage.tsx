import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import {
  Target,
  Award,
  Users,
  Lightbulb,
  TrendingUp,
  Shield,
} from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "정확성",
      description: "AI와 전문가의 이중 검증으로 정확한 분석을 제공합니다",
    },
    {
      icon: Lightbulb,
      title: "혁신",
      description: "최신 AI 기술과 UX 트렌드를 결합한 혁신적인 솔루션",
    },
    {
      icon: Users,
      title: "협업",
      description: "디자이너, 개발자, 기획자 모두를 위한 협업 도구",
    },
    {
      icon: Shield,
      title: "신뢰",
      description: "데이터 보안과 개인정보 보호를 최우선으로 합니다",
    },
  ];

  const milestones = [
    { year: "2022", event: "ProTouchDesign 설립" },
    { year: "2023.03", event: "AI 분석 엔진 1.0 출시" },
    { year: "2023.09", event: "100개 기업 분석 달성" },
    { year: "2024.01", event: "전문가 팀 확장 (10명)" },
    { year: "2024.06", event: "500개 기업 분석 돌파" },
    { year: "2024.11", event: "AI 지침서 메이커 출시" },
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
            About Us
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight text-white">
            더 나은 <span style={{ color: 'var(--accent)' }}>웹 경험</span>을<br />만들어갑니다
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ProTouchDesign은 AI와 전문가의 협업으로 웹사이트의 UX를 개선하고,<br className="hidden md:block" />
            실제 사용자 경험을 향상시키는 것을 목표로 합니다.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ color: "var(--primary)" }} className="mb-6">
                우리의 미션
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                모든 웹사이트가 사용자 중심의 훌륭한 경험을 제공할 수 있도록
                돕는 것이 우리의 미션입니다. AI의 빠른 분석 능력과 전문가의 깊이
                있는 인사이트를 결합하여, 누구나 쉽게 웹사이트를 개선할 수 있는
                환경을 만들어갑니다.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                단순한 분석 도구를 넘어, 실제 디자인 개선까지 이어질 수 있는
                실행 가능한 가이드를 제공하는 것이 우리의 차별점입니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[var(--accent)] rounded-2xl p-8 text-white">
                <div className="text-5xl font-bold mb-2">500+</div>
                <div>분석 완료</div>
              </div>
              <div className="bg-[var(--secondary)] rounded-2xl p-8 text-white">
                <div className="text-5xl font-bold mb-2">98%</div>
                <div>만족도</div>
              </div>
              <div className="bg-[var(--primary)] rounded-2xl p-8 text-white">
                <div className="text-5xl font-bold mb-2">24h</div>
                <div>평균 응답</div>
              </div>
              <div className="bg-[var(--warning)] rounded-2xl p-8 text-white">
                <div className="text-5xl font-bold mb-2">10+</div>
                <div>전문가 팀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: "var(--bg-light)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ color: "var(--primary)" }} className="mb-4">
              핵심 가치
            </h2>
            <p className="text-gray-600">
              ProTouchDesign이 추구하는 가치입니다
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "var(--accent)15" }}
                  >
                    <Icon
                      className="w-7 h-7"
                      style={{ color: "var(--accent)" }}
                    />
                  </div>
                  <h4 style={{ color: "var(--primary)" }} className="mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-base">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline - 나중에 다시 사용 예정 */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ color: 'var(--primary)' }} className="mb-4">
              성장의 발자취
            </h2>
            <p className="text-gray-600">ProTouchDesign의 주요 이정표</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5" style={{ background: 'var(--secondary)' }} />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="inline-block bg-white rounded-xl p-6 shadow-lg">
                      <div className="font-bold mb-2" style={{ color: 'var(--accent)' }}>
                        {milestone.year}
                      </div>
                      <div className="text-gray-700">{milestone.event}</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-white shadow-lg z-10" style={{ background: 'var(--accent)' }} />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="mb-6 text-white">ProTouchDesign과 함께 시작하세요</h2>
          <p className="text-white/90 text-xl mb-8">
            지금 바로 분석을 시작하고, 웹사이트의 UX를 개선하세요
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
              style={{ background: "var(--accent)", color: "white" }}
            >
              분석 시작
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl font-semibold bg-white/20 hover:bg-white/30 transition-all"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
