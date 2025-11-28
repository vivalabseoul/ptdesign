export function Experts() {
  const experts = [
    {
      name: "김지훈",
      role: "Lead UX Architect",
      experience: "12",
      specialties: ["사용성 분석", "정보구조 설계", "인터랙션 디자인"],
      isTopDesigner: false, // 관리자가 설정
    },
    {
      name: "스텔라문",
      role: "Senior UI/UX Designer",
      experience: "22",
      specialties: ["미디어 디자인", "타이포그래피", "컬러 시스템"],
      isTopDesigner: true, // 관리자가 설정
    },
    {
      name: "박민수",
      role: "Accessibility Specialist",
      experience: "8",
      specialties: ["웹 접근성", "WCAG 준수", "스크린리더 최적화"],
      isTopDesigner: false, // 관리자가 설정
    },
    {
      name: "정하은",
      role: "Performance Analyst",
      experience: "10",
      specialties: ["로딩 최적화", "렌더링 성능", "Core Web Vitals"],
      isTopDesigner: false, // 관리자가 설정
    },
  ];

  return (
    <section className="section-primary section-sm">
      <div className="container px-6">
        <div className="spacing-section-sm text-center">
          <h2 className="section-title text-black">전문가 팀</h2>
          <p className="section-desc text-black">
            각 분야 최고의 전문가들이 귀사의 웹사이트를 정밀하게 분석합니다
          </p>
        </div>

        <div className="grid-experts">
          {experts.map((expert, index) => (
            <div key={index} className="card-expert">
              {/* 전문가 사진 영역 - 세로 직사각형 (명함 스타일) */}
              <div className="expert-photo-container mb-6">
                <div className="expert-photo">
                  {/* 실제 이미지가 있으면 여기에 표시, 없으면 플레이스홀더 */}
                  <img
                    src={`/experts/${expert.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}.jpg`}
                    alt={expert.name}
                    className="expert-photo-img"
                    style={
                      expert.name === "박민수"
                        ? { objectPosition: "center center" }
                        : undefined
                    }
                    onError={(e) => {
                      // 이미지가 없으면 플레이스홀더 표시
                      (e.target as HTMLImageElement).style.display = "none";
                      const placeholder = (
                        e.target as HTMLImageElement
                      ).parentElement?.querySelector(
                        ".expert-photo-placeholder"
                      );
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="expert-photo-placeholder"
                    style={{ display: "none" }}
                  >
                    <span className="text-4xl font-bold text-black/20">
                      {expert.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="spacing-lg">
                <div className="expert-exp">{expert.experience}</div>
                <div className="expert-exp-label">Years Experience</div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <h3 className="expert-name">{expert.name}</h3>
                {expert.isTopDesigner && (
                  <span className="expert-top-badge">Top Designer</span>
                )}
              </div>
              <div className="expert-role">{expert.role}</div>

              <div className="space-y-3">
                {expert.specialties.map((specialty, idx) => (
                  <div key={idx} className="expert-specialty">
                    {specialty}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
