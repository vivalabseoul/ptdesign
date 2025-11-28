import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, Mail, Lock, Zap, AlertCircle } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "expert" | "admin">("customer");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 테스트 계정
  const testAccounts = {
    customer: {
      email: "customer@test.com",
      password: "test1234",
      name: "김고객",
      description: "일반 고객 계정 - 분석 요청 및 리포트 확인",
    },
    expert: {
      email: "expert@test.com",
      password: "test1234",
      name: "이전문",
      description: "전문가 계정 - AI 분석 검수 및 지침서 편집",
    },
    admin: {
      email: "admin@test.com",
      password: "test1234",
      name: "박관리",
      description: "관리자 계정 - 전체 시스템 관리 및 지침서 메이커",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const profile = await login(email, password);

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

  const handleQuickLogin = async (
    accountType: "customer" | "expert" | "admin"
  ) => {
    const account = testAccounts[accountType];

    try {
      const profile = await login(account.email, account.password);

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
      setError("로그인에 실패했습니다.");
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

            {/* Role Selection */}
            <div>
              <label
                className="block font-semibold mb-3"
                style={{ color: "var(--primary)" }}
              >
                로그인 유형
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    role === "customer"
                      ? "text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={
                    role === "customer" ? { background: "var(--accent)" } : {}
                  }
                >
                  고객
                </button>
                <button
                  type="button"
                  onClick={() => setRole("expert")}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    role === "expert"
                      ? "text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={
                    role === "expert" ? { background: "var(--accent)" } : {}
                  }
                >
                  전문가
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    role === "admin"
                      ? "text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={
                    role === "admin" ? { background: "var(--accent)" } : {}
                  }
                >
                  관리자
                </button>
              </div>
            </div>

            {/* Test Account Info */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--secondary)15" }}
            >
              <div className="flex items-start gap-2">
                <Zap
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--secondary)" }}
                />
                <div className="flex-1">
                  <div
                    className="font-semibold mb-1"
                    style={{ color: "var(--primary)" }}
                  >
                    테스트 계정: {testAccounts[role].name}
                  </div>
                  <div className="text-base text-gray-600 mb-2">
                    {testAccounts[role].description}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {testAccounts[role].email} / PW:{" "}
                    {testAccounts[role].password}
                  </div>
                </div>
              </div>
            </div>

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
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-600">로그인 상태 유지</span>
              </label>
              <a
                href="#"
                className="hover:text-[var(--accent)] transition-colors"
                style={{ color: "var(--primary)" }}
              >
                비밀번호 찾기
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ background: "var(--accent)", color: "white" }}
            >
              로그인
            </button>

            {/* Quick Login Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin(role)}
              className="w-full py-3 rounded-xl font-semibold border-2 transition-all hover:shadow-lg"
              style={{
                borderColor: "var(--secondary)",
                color: "var(--secondary)",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                테스트 계정으로 빠른 로그인
              </div>
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
    </div>
  );
}
