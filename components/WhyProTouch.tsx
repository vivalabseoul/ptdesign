export function WhyProTouch() {
  const reasons = [
    {
      number: "01",
      title: "AI 즉시 분석",
      description: "URL 입력 후 30초 이내에 전문가 수준의 UI/UX 분석 완료",
    },
    {
      number: "02",
      title: "상세 개선 보고서",
      description: "문제점, 심각도, 구체적인 개선 방안을 담은 PDF 보고서",
    },
    {
      number: "03",
      title: "AI 작업 지침서",
      description: "ChatGPT, Claude 등 AI에게 바로 전달할 수 있는 지침서 파일",
    },
    {
      number: "04",
      title: "원클릭 다운로드",
      description: "보고서와 지침서를 즉시 다운로드하여 바로 활용",
    },
  ];

  return (
    <section className="section section-border">
      <div className="container">
        <div className="spacing-section text-center">
          <h2 className="section-title">왜 Pro Touch Design인가?</h2>
          <p className="section-desc text-gray-500">
            전문 디자이너 없이도 데이터 기반의 정확한 디자인 개선을 받을 수
            있습니다
          </p>
        </div>

        <div className="grid-features">
          {reasons.map((reason) => (
            <div key={reason.number} className="card-feature">
              <div className="feature-number">{reason.number}</div>
              <h3 className="feature-title">{reason.title}</h3>
              <p className="feature-desc">{reason.description}</p>
            </div>
          ))}
        </div>
        <div className="spacing-section"></div>
      </div>
    </section>
  );
}
