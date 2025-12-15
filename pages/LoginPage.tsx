import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export function LoginPage() {
  const { signInWithGoogle, signInWithKakao, signInWithEmail } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      // 로그인 성공 시 대시보드로 이동
      navigate("/customer/dashboard");
    } catch (err: any) {
      console.error("로그인 실패:", err);
      setError(err.message || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      setError("구글 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      setError("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-base text-red-600">{error}</p>
            </div>
          )}

          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Info Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              계정이 없으신가요?{" "}
              <Link to="/signup" className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
                회원가입
              </Link>
            </p>
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
