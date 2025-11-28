import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, openAuthModal } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: 'var(--primary)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ProTouchDesign"
              className="w-[200px] h-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("service")}
              className="px-4 py-2 text-white hover:text-[var(--accent)] transition-colors"
            >
              서비스 소개
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="px-4 py-2 text-white hover:text-[var(--accent)] transition-colors"
            >
              전문가 팀
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="px-4 py-2 text-white hover:text-[var(--accent)] transition-colors"
            >
              요금제
            </button>
            {user ? (
              <Link
                to={user.role === 'expert' ? '/expert/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                className="px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:opacity-90"
                style={{ background: '#EE6C4D', color: 'white' }}
              >
                대시보드
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:opacity-90"
                style={{ background: '#EE6C4D', color: 'white' }}
              >
                로그인
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t" style={{ background: 'var(--primary)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="px-4 py-6 space-y-4">
            <button
              onClick={() => scrollToSection("service")}
              className="block w-full text-left py-2 text-white"
            >
              서비스 소개
            </button>
            <button
              onClick={() => scrollToSection("cases")}
              className="block w-full text-left py-2 text-white"
            >
              사례
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="block w-full text-left py-2 text-white"
            >
              데모 체험
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="block w-full text-left py-2 text-white"
            >
              전문가 팀
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left py-2 text-white"
            >
              요금제
            </button>
            {user ? (
              <Link
                to={user.role === 'expert' ? '/expert/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                className="block w-full text-center px-6 py-2.5 rounded-lg"
                style={{ background: '#EE6C4D', color: 'white' }}
              >
                대시보드
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="w-full px-6 py-2.5 rounded-lg"
                style={{ background: '#EE6C4D', color: 'white' }}
              >
                로그인
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}