import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Building,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" as "customer" | "expert" | "admin",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // OAuth 로그인으로 리다이렉트
      // 현재 앱은 OAuth만 지원하므로 로그인 페이지로 이동
      navigate("/login");
    } catch (err: any) {
      console.error("회원가입 실패:", err);
      setError(err.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg-light)" }}
    >
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
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img
            src="/protouch_logo_f.png"
            alt="ProTouchDesign"
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div
          className="bg-white rounded-2xl p-8 shadow-xl border-2"
          style={{ borderColor: "var(--secondary)" }}
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--accent)15" }}
            >
              <UserPlus
                className="w-8 h-8"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <h2 style={{ color: "var(--primary)" }}>회원가입</h2>
            <p className="text-gray-600 mt-2">14일 체험을 시작하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-base text-red-600">{error}</p>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label
                className="block font-semibold mb-3"
                style={{ color: "var(--primary)" }}
              >
                가입 유형 *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "customer" })}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    formData.role === "customer"
                      ? "text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={
                    formData.role === "customer"
                      ? { background: "var(--accent)" }
                      : {}
                  }
                >
                  고객
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "expert" })}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    formData.role === "expert"
                      ? "text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={
                    formData.role === "expert"
                      ? { background: "var(--accent)" }
                      : {}
                  }
                >
                  전문가
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    formData.role === "admin"
                      ? "text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={
                    formData.role === "admin"
                      ? { background: "var(--accent)" }
                      : {}
                  }
                >
                  관리자
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                선택된 유형:{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {formData.role === "customer"
                    ? "고객"
                    : formData.role === "expert"
                    ? "전문가"
                    : "관리자"}
                </span>
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block font-semibold mb-2"
                style={{ color: "var(--primary)" }}
              >
                이름 *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block font-semibold mb-2"
                style={{ color: "var(--primary)" }}
              >
                회사명 *
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="회사명을 입력하세요"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-semibold mb-2"
                style={{ color: "var(--primary)" }}
              >
                이메일 *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-semibold mb-2"
                style={{ color: "var(--primary)" }}
              >
                비밀번호 *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-semibold mb-2"
                style={{ color: "var(--primary)" }}
              >
                비밀번호 확인 *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-base">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded mt-1"
              />
              <span className="text-gray-600">
                <a
                  href="#"
                  className="hover:text-[var(--accent)]"
                  style={{ color: "var(--primary)" }}
                >
                  이용약관
                </a>{" "}
                및{" "}
                <a
                  href="#"
                  className="hover:text-[var(--accent)]"
                  style={{ color: "var(--primary)" }}
                >
                  개인정보처리방침
                </a>
                에 동의합니다
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="text-center mt-6 text-base">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
            >
              로그인
            </Link>
          </div>
        </div>

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
