import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn } from "lucide-react";

export function LoginPage() {
  const { signInWithGoogle, signInWithKakao } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      alert("구글 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      alert("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-light)" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img
            src="/protouch_logo_f.png"
            alt="ProTouchDesign"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Login Form */}
        <div
          className="bg-white rounded-2xl p-8 shadow-xl border-2"
          style={{ borderColor: "var(--secondary)" }}
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--accent)15" }}
            >
              <LogIn className="w-8 h-8" style={{ color: "var(--accent)" }} />
            </div>
            <h2 style={{ color: "var(--primary)" }}>로그인</h2>
            <p className="text-gray-600 mt-2">
              ProTouchDesign에 오신 것을 환영합니다
            </p>
          </div>

          <div className="space-y-4">
            {/* 구글 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all hover:shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold text-gray-700">구글로 계속하기</span>
            </button>

            {/* 카카오 로그인 버튼 */}
            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all hover:shadow-lg"
              style={{ background: "#FEE500" }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  fillOpacity="0.85"
                  d="M12 3C6.477 3 2 6.253 2 10.253c0 2.625 1.726 4.927 4.32 6.267-.18.66-.663 2.456-.763 2.85-.12.47.173.464.366.337.154-.102 2.456-1.64 3.372-2.253.4.055.81.084 1.228.084 5.523 0 10-3.253 10-7.253S17.523 3 12 3z"
                />
              </svg>
              <span className="font-semibold" style={{ color: "#000000", opacity: 0.85 }}>
                카카오로 계속하기
              </span>
            </button>
          </div>

          {/* Info Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>소셜 로그인으로 간편하게 시작하세요</p>
            <p className="mt-1">별도의 회원가입 없이 바로 이용 가능합니다</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-base text-gray-600 hover:text-[var(--accent)] transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
