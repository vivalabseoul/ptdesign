import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, FileText, Sparkles, Users, FolderKanban, ClipboardCheck, ExternalLink } from "lucide-react";

type DemoRole = "customer" | "expert" | "admin";

interface DemoPage {
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
  path: string;
  highlight?: boolean;
}

interface DemoSection {
  category: string;
  color: string;
  role: DemoRole;
  pages: DemoPage[];
}

export function DemoLinks() {
  const { login } = useAuth();

  const handleDemoLogin = async (role: DemoRole, path: string) => {
    const accounts = {
      customer: { email: "customer@test.com", password: "test1234" },
      expert: { email: "expert@test.com", password: "test1234" },
      admin: { email: "admin@test.com", password: "test1234" }
    };
    
    try {
      await login(accounts[role].email, accounts[role].password);
      // Login successful - user will be redirected by link
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const demoPages: DemoSection[] = [
    {
      category: "고객용 페이지",
      color: "var(--secondary)",
      role: "customer" as const,
      pages: [
        {
          icon: LayoutDashboard,
          title: "고객 대시보드",
          description: "분석 현황 및 새 분석 시작",
          path: "/customer/dashboard"
        },
        {
          icon: FileText,
          title: "분석 리포트",
          description: "AI 분석 결과 및 개선 지침서",
          path: "/customer/report/1",
          highlight: true
        }
      ]
    },
    {
      category: "전문가용 페이지",
      color: "var(--warning)",
      role: "expert" as const,
      pages: [
        {
          icon: ClipboardCheck,
          title: "전문가 대시보드",
          description: "배정된 검수 작업 관리",
          path: "/expert/dashboard"
        },
        {
          icon: FileText,
          title: "분석 검수",
          description: "AI 분석 검토 및 지침서 편집",
          path: "/expert/review/2"
        }
      ]
    },
    {
      category: "관리자용 페이지",
      color: "var(--accent)",
      role: "admin" as const,
      pages: [
        {
          icon: LayoutDashboard,
          title: "관리자 대시보드",
          description: "전체 시스템 통계 및 현황",
          path: "/admin/dashboard"
        },
        {
          icon: Sparkles,
          title: "AI 지침서 메이커",
          description: "템플릿 정의 및 AI 지침서 생성",
          path: "/admin/guideline-maker",
          highlight: true
        },
        {
          icon: Users,
          title: "회원 관리",
          description: "전체 회원 현황 관리",
          path: "/admin/members"
        },
        {
          icon: FolderKanban,
          title: "프로젝트 관리",
          description: "진행 중인 프로젝트 현황",
          path: "/admin/projects"
        }
      ]
    }
  ];

  return (
    <section id="demo" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ background: 'var(--accent)15' }}>
            <span className="font-semibold" style={{ color: 'var(--accent)' }}>
              🎯 데모 페이지
            </span>
          </div>
          <h2 style={{ color: 'var(--primary)' }} className="mb-4">
            모든 기능을 직접 체험해보세요
          </h2>
          <p className="text-gray-600 text-lg">
            로그인 없이 바로 각 페이지로 이동하여 기능을 확인할 수 있습니다
          </p>
        </div>

        <div className="space-y-12">
          {demoPages.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: section.color }}
                />
                <h3 style={{ color: 'var(--primary)' }}>{section.category}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.pages.map((page, pageIndex) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={pageIndex}
                      to={page.path}
                      onClick={() => handleDemoLogin(section.role, page.path)}
                      className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 ${
                        page.highlight ? 'border-[var(--accent)]' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      {page.highlight && (
                        <div className="mb-3">
                          <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: 'var(--accent)' }}>
                            핵심 기능
                          </span>
                        </div>
                      )}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                        style={{ background: `${section.color}15` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: section.color }} />
                      </div>
                      <h4 style={{ color: 'var(--primary)' }} className="mb-2 flex items-center gap-2">
                        {page.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-base text-gray-600">
                        {page.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Info */}
        <div className="mt-12 p-8 rounded-2xl" style={{ background: 'var(--bg-light)' }}>
          <div className="text-center">
            <h4 style={{ color: 'var(--primary)' }} className="mb-4">
              🚀 빠른 접근 방법
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="font-semibold mb-2" style={{ color: 'var(--secondary)' }}>
                  고객 계정
                </div>
                <div className="text-base text-gray-600 space-y-1">
                  <div>ID: customer@test.com</div>
                  <div>PW: test1234</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="font-semibold mb-2" style={{ color: 'var(--warning)' }}>
                  전문가 계정
                </div>
                <div className="text-base text-gray-600 space-y-1">
                  <div>ID: expert@test.com</div>
                  <div>PW: test1234</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                  관리자 계정
                </div>
                <div className="text-base text-gray-600 space-y-1">
                  <div>ID: admin@test.com</div>
                  <div>PW: test1234</div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-block px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105"
                style={{ background: 'var(--accent)' }}
              >
                로그인 페이지로 이동
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}