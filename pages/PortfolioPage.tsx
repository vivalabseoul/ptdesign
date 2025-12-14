import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ArrowUpRight, Layout, Smartphone, ShoppingCart, BarChart3, Globe } from "lucide-react";

export function PortfolioPage() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Redesign",
      category: "UI/UX Design",
      description: "사용자 경험 중심의 쇼핑몰 리뉴얼로 전환율 150% 상승",
      tags: ["Commerce", "Mobile First"],
      color: "var(--accent)",
      icon: ShoppingCart
    },
    {
      id: 2,
      title: "Fintech Dashboard",
      category: "Web Application",
      description: "복잡한 금융 데이터를 직관적으로 시각화한 대시보드",
      tags: ["B2B", "Dashboard"],
      color: "var(--secondary)",
      icon: BarChart3
    },
    {
      id: 3,
      title: "Healthcare App",
      category: "Mobile App",
      description: "고령층을 위한 접근성 최적화 헬스케어 서비스",
      tags: ["App", "Accessibility"],
      color: "var(--success)",
      icon: Smartphone
    },
    {
      id: 4,
      title: "SaaS Platform",
      category: "Product Design",
      description: "글로벌 협업 툴의 워크스페이스 UX 개선 프로젝트",
      tags: ["SaaS", "Productivity"],
      color: "var(--warning)",
      icon: Layout
    },
    {
      id: 5,
      title: "Corporate Website",
      category: "Web Design",
      description: "브랜드 아이덴티티를 강화한 기업 소개 사이트 구축",
      tags: ["Branding", "Responsive"],
      color: "#A78BFA",
      icon: Globe
    },
    {
      id: 6,
      title: "Analytics Tool",
      category: "Data Visualization",
      description: "대용량 데이터 처리를 위한 어드민 시스템 UI 설계",
      tags: ["Admin", "System"],
      color: "#F472B6",
      icon: ArrowUpRight
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen text-white" style={{ background: 'var(--primary)' }}>
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
              Our Works
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              Selected <span style={{ color: 'var(--accent)' }}>Projects</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              사용자 경험을 혁신하고 비즈니스 가치를 창출한<br className="hidden md:block" />
              ProTouchDesign의 주요 프로젝트를 소개합니다.
            </p>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s`,
                    animationFillMode: "backwards",
                  }}
                >
                  {/* Image Placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)] via-transparent to-transparent opacity-60" />
                    <project.icon 
                      className="w-20 h-20 opacity-20 group-hover:opacity-30 transition-opacity duration-500" 
                      style={{ color: project.color }} 
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[var(--accent)]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <span className="px-6 py-3 bg-white text-[var(--primary)] rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Case Study
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                        {project.category}
                      </span>
                      <div className="flex gap-2">
                        {project.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--secondary)] group-hover:translate-x-2 transition-transform duration-300">
                      자세히 보기 <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-32 text-center bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-16 border border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                다음 성공 사례의 주인공이 되어보세요
              </h2>
              <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                귀사의 서비스도 ProTouchDesign의 전문적인 분석과 디자인으로<br />
                놀라운 성과를 만들어낼 수 있습니다.
              </p>
              <a 
                href="/#pricing" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(238,108,77,0.5)]"
                style={{ background: 'var(--accent)' }}
              >
                상담 신청하기
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
