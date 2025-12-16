import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { X, Mail, Lock, User, AlertCircle, LogIn, UserPlus } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithKakao } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setError(null);
    setLoading(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [isOpen, initialMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AuthModal DEBUG] handleSubmit 호출 - mode:', mode);
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        console.log('[AuthModal DEBUG] 로그인 시도 - email:', formData.email);
        await signInWithEmail(formData.email, formData.password);
        console.log('[AuthModal DEBUG] 로그인 성공');
        navigate("/customer/dashboard");
        onClose();
      } else {
        // 회원가입
        console.log('[AuthModal DEBUG] 회원가입 시도 - email:', formData.email, 'name:', formData.name);
        
        if (formData.password !== formData.confirmPassword) {
          setError("비밀번호가 일치하지 않습니다.");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("비밀번호는 최소 6자 이상이어야 합니다.");
          setLoading(false);
          return;
        }

        console.log('[AuthModal DEBUG] signUpWithEmail 호출 전');
        await signUpWithEmail(formData.email, formData.password, formData.name);
        console.log('[AuthModal DEBUG] signUpWithEmail 완료');
        
        // 회원가입 후 AuthContext에서 이미 사용자가 설정되었으므로 바로 대시보드로 이동
        console.log('[AuthModal DEBUG] 회원가입 후 대시보드로 이동');
        navigate("/customer/dashboard");
        onClose();
      }
    } catch (err: any) {
      console.error("[AuthModal DEBUG] 인증 실패:", err);
      setError(err.message || (mode === "login" ? "로그인에 실패했습니다." : "회원가입에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      setError("구글 로그인에 실패했습니다.");
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
      onClose();
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      setError("카카오 로그인에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)15" }}
            >
              {mode === "login" ? (
                <LogIn className="w-5 h-5" style={{ color: "var(--accent)" }} />
              ) : (
                <UserPlus className="w-5 h-5" style={{ color: "var(--accent)" }} />
              )}
            </div>
            <div>
              <h3 className="font-bold" style={{ color: "var(--primary)" }}>
                {mode === "login" ? "로그인" : "회원가입"}
              </h3>
              <p className="text-sm text-gray-500">ProTouchDesign</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                mode === "login"
                  ? "bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={mode === "login" ? { color: "var(--accent)" } : {}}
            >
              로그인
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                mode === "signup"
                  ? "bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={mode === "signup" ? { color: "var(--accent)" } : {}}
            >
              회원가입
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                  이름 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="홍길동"
                    className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)", color: "white" }}
              onClick={(e) => {
                console.log('[AuthModal DEBUG] 버튼 클릭됨! - 직접 handleSubmit 호출');
                handleSubmit(e as unknown as React.FormEvent);
              }}
            >
              {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* Google */}
            {/* <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span className="font-medium text-gray-700">구글로 계속하기</span>
            </button> */}

            {/* Kakao */}
            <button
              onClick={handleKakaoLogin}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm"
              style={{ background: "#FEE500" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  fillOpacity="0.85"
                  d="M12 3C6.477 3 2 6.253 2 10.253c0 2.625 1.726 4.927 4.32 6.267-.18.66-.663 2.456-.763 2.85-.12.47.173.464.366.337.154-.102 2.456-1.64 3.372-2.253.4.055.81.084 1.228.084 5.523 0 10-3.253 10-7.253S17.523 3 12 3z"
                />
              </svg>
              <span className="font-medium" style={{ color: "#000000", opacity: 0.85 }}>
                카카오로 계속하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}