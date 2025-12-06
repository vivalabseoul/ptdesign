import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const profile = await login(email, password);

      // 아이디 저장하기 처리
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Redirect based on role
      if (profile.role === "admin") {
        navigate("/admin/dashboard");
      } else if (profile.role === "expert") {
        navigate("/expert/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-base text-red-600 mb-2">{error}</p>
                  <p className="text-sm text-red-500">
                    계정이 없다면 먼저{" "}
                    <Link to="/signup" className="underline font-semibold">
                      회원가입
                    </Link>
                    을 해주세요.
                  </p>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-base">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-gray-600">아이디 저장</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="hover:text-[var(--accent)] transition-colors"
                style={{ color: "var(--primary)" }}
              >
                비밀번호 찾기
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ background: "var(--accent)", color: "white" }}
            >
              로그인
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 text-base">
            <span className="text-gray-600">계정이 없으신가요? </span>
            <Link
              to="/signup"
              className="font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
            >
              회원가입
            </Link>
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

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
