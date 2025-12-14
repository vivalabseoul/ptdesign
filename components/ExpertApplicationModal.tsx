import { useState } from "react";
import { X, UserPlus, Mail, Phone, User, Briefcase, Link as LinkIcon, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { submitExpertApplication } from "../lib/api/expert";

interface ExpertApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpertApplicationModal({ isOpen, onClose }: ExpertApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    yearsOfExperience: "",
    specialization: "",
    portfolioUrl: "",
    introduction: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 유효성 검사
    if (formData.introduction.length < 100) {
      setError("자기소개는 최소 100자 이상 작성해주세요.");
      setLoading(false);
      return;
    }

    try {
      await submitExpertApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        specialization: formData.specialization || undefined,
        portfolioUrl: formData.portfolioUrl || undefined,
        introduction: formData.introduction,
      });

      setSuccess(true);
      // 3초 후 모달 닫기
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          yearsOfExperience: "",
          specialization: "",
          portfolioUrl: "",
          introduction: "",
        });
      }, 3000);
    } catch (err: any) {
      console.error("전문가 신청 실패:", err);
      setError(err.message || "신청 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)15" }}
            >
              <UserPlus className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: "var(--primary)" }}>
                전문가 신청
              </h3>
              <p className="text-sm text-gray-500">UI/UX 전문가로 함께하세요</p>
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
          {success ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--accent)15" }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                신청이 완료되었습니다!
              </h3>
              <p className="text-gray-600">
                검토 후 이메일로 연락드리겠습니다.
              </p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 이름 */}
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

                {/* 이메일 & 전화번호 */}
                <div className="grid grid-cols-2 gap-4">
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
                        placeholder="expert@example.com"
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="010-1234-5678"
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 경력 & 전문분야 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                      경력 (년) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        placeholder="5"
                        min="0"
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                      전문 분야
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                    >
                      <option value="">선택해주세요</option>
                      <option value="UI/UX 디자인">UI/UX 디자인</option>
                      <option value="프론트엔드 개발">프론트엔드 개발</option>
                      <option value="백엔드 개발">백엔드 개발</option>
                      <option value="풀스택 개발">풀스택 개발</option>
                      <option value="모바일 앱 개발">모바일 앱 개발</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>

                {/* 포트폴리오 URL */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                    포트폴리오 URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                      placeholder="https://portfolio.com"
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* 자기소개 */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                    자기소개 <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(최소 100자)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="introduction"
                      value={formData.introduction}
                      onChange={handleChange}
                      placeholder="자신의 경력, 전문성, 강점 등을 자유롭게 작성해주세요."
                      rows={4}
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[var(--accent)] outline-none transition-colors resize-none text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.introduction.length} / 100자
                  </p>
                </div>

                {/* 제출 버튼 */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    {loading ? "제출 중..." : "신청하기"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
