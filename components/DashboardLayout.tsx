import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderKanban,
  Settings,
  LogOut,
  Sparkles,
  ClipboardCheck,
  BarChart3,
  Eye,
  Activity,
  CreditCard,
  Crown,
} from "lucide-react";
import { Footer } from "./Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getMenuItems = () => {
    if (user?.role === "admin") {
      return [
        { icon: LayoutDashboard, label: "대시보드", path: "/admin/dashboard" },
        { icon: Sparkles, label: "지침서 메이커", path: "/admin/guideline-maker" },
        { icon: Users, label: "회원 등급 관리", path: "/admin/members" },
        { icon: Activity, label: "회원 사용량", path: "/admin/member-usage" },
        { icon: FolderKanban, label: "프로젝트 관리", path: "/admin/projects" },
        { icon: Eye, label: "템플릿 미리보기", path: "/admin/pdf-preview" },
      ];
    } else if (user?.role === "expert") {
      return [
        { icon: LayoutDashboard, label: "대시보드", path: "/expert/dashboard" },
        { icon: ClipboardCheck, label: "검수 작업", path: "/expert/dashboard" },
      ];
    } else {
      return [
        { icon: LayoutDashboard, label: "대시보드", path: "/customer/dashboard" },
        { icon: BarChart3, label: "분석 내역", path: "/customer/history" },
        { icon: Crown, label: "구독 관리", path: "/customer/subscription" },
        { icon: CreditCard, label: "결제 내역", path: "/customer/payment-history" },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg-light)' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <Link to="/" className="flex items-center justify-center">
            <img
              src="/logo_B.png"
              alt="ProTouchDesign"
              className="w-[180px] h-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    style={isActive ? { background: 'var(--accent)' } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 mb-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--primary)' }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate" style={{ color: 'var(--primary)' }}>
                {user?.email?.split('@')[0]}
              </div>
              <div className="text-sm text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}