import { useState } from "react";
import { X, Mail, CheckCircle, AlertCircle } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: 비밀번호 재설정 API 연동 필요
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail("");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "이메일 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail("");
    setError(null);
    setSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 style={{ color: "var(--primary)" }}>비밀번호 재설정</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                이메일이 전송되었습니다!
              </h3>
              <p className="text-gray-600">
                비밀번호 재설정 링크를 이메일로 보내드렸습니다.
                <br />
                이메일을 확인해주세요.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-base text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--primary)" }}>
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--accent)] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {loading ? "전송 중..." : "재설정 링크 보내기"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
