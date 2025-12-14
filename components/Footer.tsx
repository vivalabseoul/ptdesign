import { Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer style={{ background: 'var(--primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Company Info - Logo and Slogan Side by Side */}
          <div className="flex items-center gap-4">
            <img
              src="/protouch_logo_W.png"
              alt="ProTouchDesign"
              className="w-[200px] h-auto flex-shrink-0 object-contain"
            />
            <div>
              <p className="text-gray-400 text-base">
                AI와 전문가의 협업으로 웹사이트 UX를 개선합니다
              </p>
            </div>
          </div>

          {/* Contact - Email Only (Right Aligned) */}
          <div>
            <a href="mailto:contact@protouchdesign.com" className="text-gray-400 hover:text-[#EE6C4D] transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" />
              contact@protouchdesign.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t" style={{ borderColor: '#2A2A2A' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-base text-gray-500">
              © 2024 ProTouchDesign. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {/* All Links */}
              <div className="flex gap-6 text-base text-gray-500">
                <Link to="/about" className="hover:text-[var(--accent)] transition-colors">
                  회사소개
                </Link>
                {/* <Link to="/portfolio" className="hover:text-[var(--accent)] transition-colors">
                  포트폴리오
                </Link> */}
                <Link to="/legal/terms" className="hover:text-[var(--accent)] transition-colors">
                  이용약관
                </Link>
                <Link to="/legal/privacy" className="hover:text-[var(--accent)] transition-colors">
                  개인정보처리방침
                </Link>
                <Link to="/legal/cookies" className="hover:text-[var(--accent)] transition-colors">
                  쿠키 정책
                </Link>
              </div>
              {/* SNS Icons */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(152, 193, 217, 0.2)' }}>
                  <Facebook className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(152, 193, 217, 0.2)' }}>
                  <Twitter className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(152, 193, 217, 0.2)' }}>
                  <Instagram className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(152, 193, 217, 0.2)' }}>
                  <Linkedin className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}