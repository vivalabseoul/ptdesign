import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    openAuthModal("login");
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300" 
      style={{ 
        background: isScrolled ? 'var(--primary)' : 'transparent', 
        borderColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
      }}
    >
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
            <Link
              to="/about"
              className="px-4 py-2 text-white hover:text-[var(--accent)] transition-colors"
            >
              회사소개
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 text-white hover:text-[var(--accent)] transition-colors"
            >
              요금제
            </Link>
            {user ? (
              <Link
                to={user.role === 'expert' ? '/expert/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                className="px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:opacity-90"
                style={{ background: '#EE6C4D', color: 'white' }}
              >
                {user.role === 'admin' || user.role === 'expert' ? '대시보드' : '마이페이지'}
              </Link>
            ) : (
              <button
                onClick={handleLoginClick}
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
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left py-2 text-white"
            >
              회사소개
            </Link>
            <Link
              to="/pricing"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left py-2 text-white"
            >
              요금제
            </Link>
            {user ? (
              <Link
                to={user.role === 'expert' ? '/expert/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                className="block w-full text-center px-6 py-2.5 rounded-lg"
                style={{ background: '#EE6C4D', color: 'white' }}
              >
                {user.role === 'admin' || user.role === 'expert' ? '대시보드' : '마이페이지'}
              </Link>
            ) : (
              <button
                onClick={handleLoginClick}
                className="block w-full text-center px-6 py-2.5 rounded-lg"
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