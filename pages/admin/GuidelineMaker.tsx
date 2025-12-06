import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Sparkles, Copy, Download, Save, RefreshCw, Wand2, FileText, Settings } from "lucide-react";

interface GuidelineTemplate {
  id: string;
  category: string;
  title: string;
  template: string;
}

export function GuidelineMaker() {
  const [selectedWebsite, setSelectedWebsite] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ui-design");
  const [customTemplate, setCustomTemplate] = useState("");
  const [generatedGuideline, setGeneratedGuideline] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    score: 0,
    issues: [] as string[],
    strengths: [] as string[],
  });

  // 저장된 템플릿 불러오기
  useEffect(() => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '{}');
      if (savedTemplates[selectedCategory]) {
        setCustomTemplate(savedTemplates[selectedCategory]);
      } else {
        setCustomTemplate(""); // 저장된 템플릿이 없으면 초기화
      }
    } catch (error) {
      console.error("템플릿 로드 실패:", error);
    }
  }, [selectedCategory]);

  // 템플릿 라이브러리
  const templates: GuidelineTemplate[] = [
    {
      id: "ui-design",
      category: "UI 디자인",
      title: "UI 디자인 개선 지침",
      template: `# UI 디자인 개선 가이드

## 현재 상태 분석
- 전체 점수: {{SCORE}}점
- 주요 문제점: {{ISSUES}}

## 개선 방향
{{IMPROVEMENTS}}

## Figma AI 프롬프트
다음 프롬프트를 Figma AI에 입력하여 디자인을 개선하세요:

\`\`\`
{{WEBSITE_URL}}의 UI 디자인을 다음과 같이 개선해주세요:

1. 색상 시스템
   - 주 색상: {{PRIMARY_COLOR}}
   - 보조 색상: {{SECONDARY_COLOR}}
   - 일관된 색상 팔레트 적용
   - 명암 대비를 WCAG AA 기준 이상으로 설정

2. 타이포그래피
   - 헤딩: {{HEADING_FONT}} 사용
   - 본문: {{BODY_FONT}} 사용
   - 계층 구조를 명확히 하는 크기 시스템 (H1: 48px, H2: 36px, H3: 24px, Body: 16px)

3. 레이아웃
   - 8px 그리드 시스템 적용
   - 여백과 패딩을 일관되게 유지
   - 시각적 계층 구조 강화

4. 컴포넌트
   - 버튼에 8px 둥근 모서리 적용
   - 카드에 미묘한 그림자 효과
   - 호버 상태에 부드러운 애니메이션

5. 반응형
   - 모바일 퍼스트 접근
   - 브레이크포인트: 320px, 768px, 1024px, 1440px
\`\`\`

## 체크리스트
- [ ] 색상 팔레트 정의 완료
- [ ] 타이포그래피 시스템 구축
- [ ] 그리드 시스템 적용
- [ ] 컴포넌트 라이브러리 생성
- [ ] 반응형 레이아웃 확인
`
    },
    {
      id: "ux-flow",
      category: "UX 플로우",
      title: "사용자 경험 개선 지침",
      template: `# UX 플로우 개선 가이드

## 현재 사용자 여정 분석
- 전체 점수: {{SCORE}}점
- 주요 문제점: {{ISSUES}}
- 강점: {{STRENGTHS}}

## 개선이 필요한 영역
{{IMPROVEMENTS}}

## Figma AI 프롬프트
다음 프롬프트를 Figma AI에 입력하여 사용자 경험을 개선하세요:

\`\`\`
{{WEBSITE_URL}}의 사용자 경험을 다음과 같이 개선해주세요:

1. 네비게이션
   - 메인 네비게이션을 3단계 이하로 단순화
   - 현재 위치를 명확히 표시하는 브레드크럼 추가
   - 검색 기능을 쉽게 접근 가능한 위치에 배치

2. 정보 구조
   - F-패턴 또는 Z-패턴 레이아웃 적용
   - 중요한 정보를 상단에 배치
   - 스캔 가능성을 높이는 제목과 부제목 사용

3. 사용자 액션
   - CTA 버튼을 시각적으로 강조 (색상, 크기, 위치)
   - 한 화면에 하나의 주요 액션만 강조
   - 버튼 텍스트를 구체적이고 액션 지향적으로 작성

4. 폼 디자인
   - 입력 필드를 세로로 배치
   - 실시간 유효성 검사 표시
   - 에러 메시지를 친절하고 구체적으로 작성
   - 진행 표시줄로 단계 표시

5. 피드백
   - 로딩 상태 명확히 표시
   - 성공/실패 메시지를 눈에 띄게 표시
   - 마이크로 인터랙션으로 반응성 향상
\`\`\`

## 사용자 테스트 체크리스트
- [ ] 3번의 클릭 이내 원하는 정보 접근 가능
- [ ] 모든 폼 필드에 레이블 존재
- [ ] CTA 버튼 명확히 식별 가능
- [ ] 에러 상태 명확히 표시
- [ ] 로딩 상태 적절히 표시
`
    },
    {
      id: "accessibility",
      category: "접근성",
      title: "웹 접근성 개선 지침",
      template: `# 웹 접근성 개선 가이드

## 접근성 현황
- 전체 점수: {{SCORE}}점
- WCAG 2.1 준수 수준: {{WCAG_LEVEL}}
- 주요 문제점: {{ISSUES}}

## 개선 방향
{{IMPROVEMENTS}}

## Figma AI 프롬프트
다음 프롬프트를 Figma AI에 입력하여 접근성을 개선하세요:

\`\`\`
{{WEBSITE_URL}}의 웹 접근성을 WCAG 2.1 AA 기준에 맞춰 개선해주세요:

1. 색상 대비
   - 텍스트와 배경의 명암 대비를 최소 4.5:1로 설정
   - 큰 텍스트(18pt 이상)는 3:1 이상
   - 색상만으로 정보를 전달하지 않도록 아이콘/텍스트 병행

2. 텍스트
   - 최소 폰트 크기 14px 이상 사용
   - 줄 간격 최소 1.5배 설정
   - 단락 간격 최소 2배 설정
   - 텍스트 정렬은 왼쪽 정렬 사용

3. 인터랙티브 요소
   - 모든 버튼과 링크의 최소 크기 44x44px
   - 포커스 상태를 명확히 표시 (아웃라인 또는 배경색 변경)
   - 터치 타겟 간 최소 8px 간격

4. 구조
   - 의미있는 헤딩 계층 구조 (H1 → H2 → H3)
   - 랜드마크 영역 명확히 구분 (header, nav, main, footer)
   - 모든 이미지에 대체 텍스트 제공

5. 키보드 네비게이션
   - 논리적인 탭 순서 설정
   - Skip to main content 링크 추가
   - 키보드만으로 모든 기능 접근 가능
\`\`\`

## WCAG 2.1 AA 체크리스트
- [ ] 명암 대비 4.5:1 이상
- [ ] 키보드로 모든 기능 접근 가능
- [ ] 포커스 표시 명확
- [ ] 의미있는 헤딩 구조
- [ ] 모든 이미지에 alt 텍스트
- [ ] 폼 요소에 레이블 연결
`
    },
    {
      id: "mobile",
      category: "모바일 대응",
      title: "모바일 최적화 지침",
      template: `# 모바일 UX 개선 가이드

## 모바일 현황
- 전체 점수: {{SCORE}}점
- 주요 문제점: {{ISSUES}}
- 개선 우선순위: {{PRIORITY}}

## Figma AI 프롬프트
다음 프롬프트를 Figma AI에 입력하여 모바일 경험을 개선하세요:

\`\`\`
{{WEBSITE_URL}}의 모바일 경험을 다음과 같이 최적화해주세요:

1. 레이아웃
   - 모바일 퍼스트 접근으로 320px부터 설계
   - 단일 컬럼 레이아웃 사용
   - 스크롤 최소화를 위한 콘텐츠 우선순위 지정

2. 터치 최적화
   - 모든 버튼 최소 44x44px 크기
   - 터치 타겟 간 최소 8px 간격
   - 스와이프 제스처 지원

3. 타이포그래피
   - 최소 폰트 크기 16px (입력 필드는 16px 이상으로 줌 방지)
   - 줄 길이를 50-75자로 제한
   - 충분한 줄 간격 (1.5 이상)

4. 네비게이션
   - 햄버거 메뉴 또는 탭 바 사용
   - 하단에 주요 네비게이션 고정
   - Thumb-friendly zone 활용

5. 성능
   - 이미지를 WebP 형식으로 최적화
   - 레이지 로딩 적용
   - 불필요한 애니메이션 제거

6. 입력
   - 적절한 키보드 타입 지정
   - 자동완성 지원
   - 입력 필드를 충분히 크게
\`\`\`

## 모바일 최적화 체크리스트
- [ ] 320px 너비에서 정상 작동
- [ ] 터치 타겟 44x44px 이상
- [ ] 가로 스크롤 없음
- [ ] 텍스트 확대 없이 읽기 가능
- [ ] 빠른 로딩 속도 (3초 이내)
`
    }
  ];

  // Mock 웹사이트 데이터
  const websites = [
    { url: "example.com", name: "Example Shop", lastAnalyzed: "2024-11-20" },
    { url: "company.co.kr", name: "Company Website", lastAnalyzed: "2024-11-19" },
    { url: "startup.io", name: "Startup Landing", lastAnalyzed: "2024-11-18" }
  ];

  // AI 지침서 생성 함수
  const generateGuideline = () => {
    setIsGenerating(true);

    // Mock analysis data
    const mockAnalysis = {
      score: Math.floor(Math.random() * 30) + 65,
      issues: [
        "색상 대비가 WCAG 기준에 미달합니다",
        "버튼 크기가 터치하기에 작습니다",
        "타이포그래피 계층이 명확하지 않습니다",
        "모바일 반응형이 일부 구간에서 깨집니다"
      ],
      strengths: [
        "전체적인 레이아웃 구조가 깔끔합니다",
        "브랜드 일관성이 잘 유지됩니다"
      ]
    };
    setAnalysisData(mockAnalysis);

    // 템플릿 찾기
    const template = templates.find(t => t.id === selectedCategory);
    if (!template) return;

    // 템플릿에 실제 데이터 적용
    setTimeout(() => {
      let guideline = customTemplate || template.template;
      
      guideline = guideline
        .replace(/{{SCORE}}/g, mockAnalysis.score.toString())
        .replace(/{{ISSUES}}/g, mockAnalysis.issues.map(i => `\n   - ${i}`).join(''))
        .replace(/{{STRENGTHS}}/g, mockAnalysis.strengths.map(s => `\n   - ${s}`).join(''))
        .replace(/{{WEBSITE_URL}}/g, selectedWebsite)
        .replace(/{{IMPROVEMENTS}}/g, `1. 색상 시스템을 일관되게 정리하세요\n2. 타이포그래피 스케일을 명확히 하세요\n3. 여백 시스템을 규칙적으로 적용하세요\n4. 인터랙티브 요소의 크기를 충분히 크게 하세요`)
        .replace(/{{PRIMARY_COLOR}}/g, "#EE6C4D")
        .replace(/{{SECONDARY_COLOR}}/g, "#98C1D9")
        .replace(/{{HEADING_FONT}}/g, "Pretendard Bold")
        .replace(/{{BODY_FONT}}/g, "Pretendard Regular")
        .replace(/{{WCAG_LEVEL}}/g, "A (부분적)")
        .replace(/{{PRIORITY}}/g, "높음");

      setGeneratedGuideline(guideline);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedGuideline);
    alert("클립보드에 복사되었습니다!");
  };

  const downloadGuideline = () => {
    const blob = new Blob([generatedGuideline], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guideline-${selectedWebsite}-${selectedCategory}.md`;
    a.click();
  };

  const saveTemplate = () => {
    if (!customTemplate) {
      alert("저장할 템플릿이 없습니다.");
      return;
    }
    
    try {
      // localStorage에 템플릿 저장
      const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '{}');
      savedTemplates[selectedCategory] = customTemplate;
      localStorage.setItem('customTemplates', JSON.stringify(savedTemplates));
      
      alert("템플릿이 저장되었습니다!");
    } catch (error) {
      console.error("템플릿 저장 실패:", error);
      alert("템플릿 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
              <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 style={{ color: 'var(--primary)' }}>AI 지침서 메이커</h1>
              <p className="text-gray-600">템플릿을 정의하면 AI가 사이트에 맞는 개선 지침서를 생성합니다</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Website Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 style={{ color: 'var(--primary)' }} className="mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                설정
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                    분석 대상
                  </label>
                  <select
                    value={selectedWebsite}
                    onChange={(e) => setSelectedWebsite(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none text-base bg-white text-gray-900"
                  >
                    <option value="">선택하세요</option>
                    {websites.map((site, index) => (
                      <option key={index} value={site.url}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>


              </div>
            </div>

            {/* Template Library */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 style={{ color: 'var(--primary)' }} className="mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                템플릿
              </h4>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedCategory(template.id);
                      setCustomTemplate(template.template);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-base transition-all ${
                      selectedCategory === template.id
                        ? 'text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={selectedCategory === template.id ? { background: 'var(--accent)' } : {}}
                  >
                    {template.category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Template Editor */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: 'var(--primary)' }}>템플릿 편집</h3>
                <button
                  onClick={saveTemplate}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-base font-semibold transition-all hover:shadow-lg"
                  style={{ background: 'var(--secondary)' }}
                >
                  <Save className="w-4 h-4" />
                  템플릿 저장
                </button>
              </div>
              <p className="text-base text-gray-600 mb-4">
                사용 가능한 변수: {`{{SCORE}}, {{ISSUES}}, {{STRENGTHS}}, {{WEBSITE_URL}}, {{IMPROVEMENTS}}`}
              </p>
              <textarea
                value={customTemplate || templates.find(t => t.id === selectedCategory)?.template || ''}
                onChange={(e) => setCustomTemplate(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none font-mono text-base bg-white text-gray-900"
                placeholder="템플릿을 입력하세요..."
              />
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={generateGuideline}
                disabled={!selectedWebsite || isGenerating}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--accent)' }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    AI가 지침서를 생성하는 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    AI 지침서 생성
                  </>
                )}
              </button>
            </div>

            {/* Generated Guideline */}
            {generatedGuideline && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ color: 'var(--primary)' }}>생성된 AI 지침서</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-base font-semibold transition-all hover:shadow-lg"
                      style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                    >
                      <Copy className="w-4 h-4" />
                      복사
                    </button>
                    <button
                      onClick={downloadGuideline}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-base font-semibold transition-all hover:shadow-lg"
                      style={{ background: 'var(--accent)' }}
                    >
                      <Download className="w-4 h-4" />
                      다운로드
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-base text-gray-800">
                    {generatedGuideline}
                  </pre>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--accent)15' }}>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                    <div>
                      <div className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>
                        고객에게 전달하는 방법
                      </div>
                      <p className="text-base text-gray-600">
                        이 지침서의 "Figma AI 프롬프트" 부분을 복사하여 고객에게 전달하세요. 
                        고객은 이 프롬프트를 Figma AI에 입력하여 즉시 디자인 개선 작업을 시작할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
