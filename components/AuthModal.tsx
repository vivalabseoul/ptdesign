import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { X, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "expert" | "admin">("customer");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setError(null);
    setLoading(false);

    // 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
      onClose();
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const profile = await signup(email, password, name, role);
      
      // 회원가입 후 메인 페이지로 리다이렉트 (저장된 URL 복원을 위해)
      navigate("/");
      onClose();
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ animation: 'slideUp 0.3s ease-out' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 style={{ color: 'var(--primary)' }}>
            {mode === "login" ? "로그인" : "회원가입"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-base text-red-600">{error}</p>
            </div>
          )}

          {mode === "login" ? (
            <>
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-base text-gray-600">아이디 저장</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {loading ? '처리 중...' : '로그인'}
                </button>
              </form>

              {/* Switch to Signup */}
              <div className="mt-6 text-center">
                <p className="text-base text-gray-600">
                  계정이 없으신가요?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="font-semibold hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    회원가입
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        role === "customer"
                          ? "text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={role === "customer" ? { background: 'var(--accent)' } : {}}
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
                      style={role === "expert" ? { background: 'var(--accent)' } : {}}
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
                      style={role === "admin" ? { background: 'var(--accent)' } : {}}
                    >
                      관리자
                    </button>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요 (8자 이상)"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {loading ? '처리 중...' : (
                    <>
                      회원가입
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch to Login */}
              <div className="mt-6 text-center">
                <p className="text-base text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="font-semibold hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    로그인
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}