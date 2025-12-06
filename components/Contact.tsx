import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
    setFormData({ name: "", company: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" style={{ background: "var(--bg-light)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 style={{ color: "var(--primary)" }} className="mb-4">
            언제든지 문의해주세요.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ProTouchDesign 팀이 여러분의 문의에 성심껏 답변드립니다
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 style={{ color: "var(--primary)" }} className="mb-6">
                연락처 정보
              </h3>
              <p className="text-gray-600 mb-8">
                Enterprise 플랜이나 맞춤형 솔루션이 필요하신가요?
                <br />
                직접 연락주시면 전담 팀이 상담해드립니다.
              </p>
            </div>

            {/* Logo Image */}
            <div className="mb-8">
              <img
                src="/logo_B.png"
                alt="ProTouchDesign"
                className="w-[350px] h-auto object-contain"
              />
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--accent)" }}
                >
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div
                    className="font-semibold mb-1"
                    style={{ color: "var(--primary)" }}
                  >
                    이메일
                  </div>
                  <a
                    href="mailto:contact@protouchdesign.com"
                    className="text-gray-600 hover:text-[var(--accent)] transition-colors"
                  >
                    contact@protouchdesign.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--warning)" }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div
                    className="font-semibold mb-1"
                    style={{ color: "var(--primary)" }}
                  >
                    주소
                  </div>
                  <p className="text-gray-600">
                    경기도 의정부시 충의로 60
                    <br /> 경희빌딩 3층
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div
              className="bg-white rounded-2xl p-6 border-2"
              style={{ borderColor: "var(--secondary)" }}
            >
              <h4 style={{ color: "var(--primary)" }} className="mb-4">
                운영 시간
              </h4>
              <div className="space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">평일</span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    10:00 - 17:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">주말/공휴일</span>
                  <span className="text-gray-500">휴무</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold mb-2"
                  style={{ color: "var(--primary)" }}
                >
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="block font-semibold mb-2"
                  style={{ color: "var(--primary)" }}
                >
                  회사명 *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="회사명을 입력하세요"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold mb-2"
                  style={{ color: "var(--primary)" }}
                >
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-semibold mb-2"
                  style={{ color: "var(--primary)" }}
                >
                  문의 내용 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="문의하실 내용을 자세히 입력해주세요"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02]"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <Send className="w-5 h-5" />
                <span>문의 보내기</span>
              </button>

              <p className="text-base text-center text-gray-500">
                * 표시는 필수 입력 항목입니다
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
