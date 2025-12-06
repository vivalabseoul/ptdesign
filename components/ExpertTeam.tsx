import { Linkedin, Mail } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ExpertTeam() {
  const experts = [
    {
      id: 1,
      name: "이민준",
      role: "Head of UX/UI Product Designer",
      specialty: "사용자 경험 설계 및 정보 구조",
      experience: "12년 경력",
      image: "/expert-1.png",
      linkedin: "#",
      email: "#",
    },
    {
      id: 2,
      name: "박유진",
      role: "Creative Lead & Brand Startgest",
      specialty: "시각 디자인 및 브랜딩",
      experience: "10년 경력",
      image: "/expert-2.png",
      linkedin: "#",
      email: "#",
    },
    {
      id: 3,
      name: "박현우",
      role: "Lead Architect $ Design Startgest",
      specialty: "웹 접근성 및 인클루시브 디자인",
      experience: "8년 경력",
      image: "/expert-3.png",
      linkedin: "#",
      email: "#",
    },
    {
      id: 4,
      name: "스텔라문",
      role: "Creative Director & UX Designer",
      specialty: "크리에티브 디렉터 및 UX 디자인",
      experience: "20년+ 경력",
      image: "/expert-4.png",
      linkedin: "#",
      email: "#",
    },
  ];

  return (
    <section id="team" style={{ background: "var(--accent)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="mb-4 text-white">실력있는 전문가들이 함께 합니다</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            국내 주요 IT 기업 출신의 UX/UI 전문가들이 여러분의 웹사이트를
            분석하고 개선 방향을 제시합니다
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {experts.map((expert, index) => (
            <div
              key={expert.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s`,
                animationFillMode: "backwards",
              }}
            >
              {/* Profile Image */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "9/13" }}
              >
                <ImageWithFallback
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <h4 style={{ color: "var(--primary)" }} className="mb-1">
                  {expert.name}
                </h4>
                <div
                  className="text-base font-semibold mb-3"
                  style={{ color: "var(--accent)" }}
                >
                  {expert.role}
                </div>
                <p className="text-base text-gray-600 mb-2">
                  {expert.specialty}
                </p>
                <p className="text-sm text-gray-500">{expert.experience}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div
          className="grid sm:grid-cols-3 gap-8 mt-16 rounded-2xl p-8 border-2"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderColor: "rgba(255,255,255,0.4)",
          }}
        >
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-2"
              style={{ color: "#EE6C4D" }}
            >
              40+
            </div>
            <div className="text-gray-600">총 전문가 경력 (년)</div>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <div
              className="text-4xl font-bold mb-2"
              style={{ color: "#EE6C4D" }}
            >
              500+
            </div>
            <div className="text-gray-600">완료한 프로젝트</div>
          </div>
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-2"
              style={{ color: "#EE6C4D" }}
            >
              98%
            </div>
            <div className="text-gray-600">고객 만족도</div>
          </div>
        </div>
      </div>
    </section>
  );
}
