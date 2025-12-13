import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface HeroProps {
  onAnalyze: (data: { url: string; siteName: string }) => Promise<void>;
  isAnalyzing: boolean;
  isAuthenticated: boolean;
  onNavigateToDashboard: () => void | Promise<void>;
}

export function Hero({ onAnalyze, isAnalyzing, isAuthenticated, onNavigateToDashboard }: HeroProps) {
  const { openAuthModal, user } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  // 페이지 로드 시 저장된 URL 복원 (자동 실행 X)
  useEffect(() => {
    const savedUrl = sessionStorage.getItem("pending_analysis_url");
    if (savedUrl) {
      setUrl(savedUrl);
      // URL 복원 후 sessionStorage에서 제거
      sessionStorage.removeItem("pending_analysis_url");
    }
  }, []);

  const handleAnalyze = () => {
    if (url) {
      sessionStorage.setItem("pending_analysis_url", url);
      if (user) {
        navigate("/customer/dashboard");
      } else {
        openAuthModal("signup");
      }
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/designers.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-64 text-center">
        {/* Main Heading */}
        <h1
          className="mb-6 animate-[fadeInUp_0.6s_ease-out_0.1s] opacity-0 text-white"
          style={{ animationFillMode: "forwards" }}
        >
          웹사이트 UX/UI,
          <br />
          <span style={{ color: "var(--accent)" }}>AI가 분석하고</span> 전문가가
          검증합니다
        </h1>

        {/* Description */}
        <p
          className="max-w-3xl mx-auto mb-12 text-gray-300 animate-[fadeInUp_0.6s_ease-out_0.2s] opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          URL만 입력하면 AI가 자동으로 웹사이트의 UI/UX를 분석하고,
          <br className="hidden sm:block" />
          디자이너 인사이트 기반의 실행 가능한 개선 지침서를 제공합니다
        </p>

        {/* URL Input */}
        <div
          className="max-w-3xl mx-auto mb-8 animate-[fadeInUp_0.6s_ease-out_0.3s] opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <div
            className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl shadow-2xl border-2"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderColor: "var(--accent)",
            }}
          >
            <div className="flex items-center flex-1 px-4 gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                placeholder="분석할 웹사이트 URL을 입력하세요 (예: https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                className="flex-1 outline-none bg-transparent text-white placeholder:text-gray-500"
              />
            </div>
            <button
              onClick={handleAnalyze}
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
              style={{ background: "var(--accent)", color: "white" }}
            >
              분석 시작
            </button>
          </div>
          <p className="mt-4 text-base text-gray-400">
            14일 체험 · 신용카드 불필요 · 즉시 결과 확인 · 회원가입후 체험가능
          </p>
        </div>

        {/* Trust Badges */}
        <div
          className="flex flex-wrap justify-center items-center gap-8 pt-8 animate-[fadeInUp_0.6s_ease-out_0.4s] opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <span className="text-white">✓</span>
            </div>
            <span className="text-white">500+ 분석 완료</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <span className="text-white">✓</span>
            </div>
            <span className="text-white">평균 평점 4.9/5.0</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "#EE6C4D" }}
            >
              <span className="text-white">✓</span>
            </div>
            <span className="text-white">24시간 내 리포트 제공</span>
          </div>
        </div>
      </div>
    </section>
  );
}
