import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { ArrowLeft, Save, CheckCircle, Edit, AlertCircle } from "lucide-react";

export function ExpertReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<"reviewing" | "approved">("reviewing");
  const [aiScore, setAiScore] = useState(88);
  const [expertScore, setExpertScore] = useState(88);
  const [feedback, setFeedback] = useState("");
  const [guidelineEdits, setGuidelineEdits] = useState("");

  const assignment = {
    url: "company.co.kr",
    customer: "이영희",
    deadline: "2024-11-23",
    aiGuideline: `# UI/UX 개선 가이드 - company.co.kr

## Figma AI 프롬프트

\`\`\`
company.co.kr의 웹사이트 디자인을 다음과 같이 개선해주세요:

### 1. 색상 시스템 개선
- 주 색상: #2563EB (Professional Blue)
- 보조 색상: #10B981 (Success Green)
- 명암 대비 WCAG AA 기준 이상 유지

### 2. 타이포그래피
- 헤딩 폰트: Pretendard Bold
- 본문 폰트: Pretendard Regular
- 크기 시스템: H1(48px), H2(36px), H3(24px), Body(16px)

### 3. 레이아웃
- 8px 그리드 시스템 적용
- 최대 너비: 1280px
- 여백: 패딩 16px, 24px, 32px 사용

### 4. 컴포넌트
- 버튼: 8px 둥근 모서리, 최소 44x44px
- 카드: 12px 둥근 모서리, 미묘한 그림자
- 입력 필드: 명확한 포커스 상태
\`\`\`
`,
    aiAnalysis: {
      categories: [
        { name: "UI 디자인", score: 90 },
        { name: "UX 플로우", score: 85 },
        { name: "접근성", score: 80 },
        { name: "모바일 대응", score: 92 },
        { name: "성능", score: 94 },
        { name: "콘텐츠", score: 87 }
      ],
      issues: [
        "일부 버튼의 크기가 터치하기에 작음",
        "네비게이션 구조가 3단계 이상으로 깊음",
        "색상 대비가 일부 영역에서 부족함"
      ]
    }
  };

  const handleApprove = () => {
    if (!feedback) {
      alert("전문가 피드백을 입력해주세요");
      return;
    }
    setStatus("approved");
    alert("검수가 완료되었습니다!");
    setTimeout(() => navigate("/expert/dashboard"), 1000);
  };

  const handleSaveDraft = () => {
    alert("임시 저장되었습니다");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ color: 'var(--primary)' }}>분석 검수</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <span>{assignment.url}</span>
                <span>•</span>
                <span>고객: {assignment.customer}</span>
                <span>•</span>
                <span>마감: {assignment.deadline}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all hover:shadow-lg"
                style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
              >
                <Save className="w-5 h-5" />
                임시 저장
              </button>
              <button
                onClick={handleApprove}
                disabled={status === "approved"}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                style={{ background: 'var(--success)' }}
              >
                <CheckCircle className="w-5 h-5" />
                검수 완료
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Score */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 style={{ color: 'var(--primary)' }} className="mb-4">AI 분석 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-base text-gray-600 mb-2">AI 점수</div>
                  <div className="text-5xl font-bold" style={{ color: 'var(--accent)' }}>
                    {aiScore}
                  </div>
                  <div className="text-base text-gray-500 mt-2">자동 분석 결과</div>
                </div>
                
                <div className="bg-[var(--accent)] rounded-xl p-6 text-white">
                  <div className="text-base text-white/80 mb-2">전문가 점수</div>
                  <input
                    type="number"
                    value={expertScore}
                    onChange={(e) => setExpertScore(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="text-5xl font-bold bg-transparent border-none outline-none text-white w-full"
                  />
                  <div className="text-base text-white/80 mt-2">검증 후 최종 점수</div>
                </div>
              </div>

              {/* Category Scores */}
              <div>
                <h4 style={{ color: 'var(--primary)' }} className="mb-4">카테고리별 점수</h4>
                <div className="space-y-3">
                  {assignment.aiAnalysis.categories.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2 text-base">
                        <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                          {category.name}
                        </span>
                        <span className="font-bold" style={{ color: 'var(--accent)' }}>
                          {category.score}점
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${category.score}%`,
                            background: 'var(--accent)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Issues */}
              <div className="mt-6">
                <h4 style={{ color: 'var(--primary)' }} className="mb-4">AI가 감지한 문제점</h4>
                <ul className="space-y-2">
                  {assignment.aiAnalysis.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                      <span className="text-gray-700">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Guideline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Edit className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <h3 style={{ color: 'var(--primary)' }}>AI 생성 지침서 (편집 가능)</h3>
              </div>
              <p className="text-base text-gray-600 mb-4">
                AI가 생성한 지침서를 검토하고 필요시 수정하세요
              </p>
              <textarea
                value={guidelineEdits || assignment.aiGuideline}
                onChange={(e) => setGuidelineEdits(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none font-mono text-base"
              />
            </div>
          </div>

          {/* Expert Feedback */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <h3 style={{ color: 'var(--primary)' }} className="mb-4">전문가 피드백</h3>
              <p className="text-base text-gray-600 mb-4">
                AI 분석 결과에 대한 전문가 의견을 작성하세요
              </p>
              
              <div className="space-y-4">
                {/* Overall Assessment */}
                <div>
                  <label className="block text-base font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                    종합 평가
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={6}
                    placeholder="AI 분석의 정확성, 추가 발견사항, 개선 우선순위 등을 작성하세요"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none text-base"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-base font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                    추가 권장사항
                  </label>
                  <textarea
                    rows={4}
                    placeholder="고객에게 전달할 추가 조언이나 주의사항"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none text-base"
                  />
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-base font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    빠른 작업
                  </div>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-base text-gray-700 transition-colors">
                      고객에게 추가 정보 요청
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-base text-gray-700 transition-colors">
                      다른 전문가와 상의
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-base text-gray-700 transition-colors">
                      이전 분석 내역 보기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            {status === "approved" && (
              <div className="bg-[var(--success)] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <h4 className="text-white">검수 완료</h4>
                </div>
                <p className="text-white/90 text-base">
                  고객에게 최종 리포트가 전달되었습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
