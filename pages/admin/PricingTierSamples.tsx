import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Download, FileText, Eye } from "lucide-react";

// 등급별 샘플 데이터 정의
const pricingTiers = [
  {
    id: "quick-scan",
    name: "퀵 스캔",
    price: "₩29K",
    badge: "가장 저렴!",
    color: "#4ECDC4",
    features: {
      scope: "메인/랜딩페이지 (모바일만)",
      analysis: "기초 점검 레벨",
      prompts: "개선 프롬프트 1종",
      report: "1쪽 PDF 리포트 + TXT",
      delivery: "4시간 초고속 납기"
    },
    sampleContent: {
      pageCount: 1,
      sections: [
        "기본 정보 (URL, 분석일시)",
        "모바일 스크린샷",
        "주요 이슈 3가지",
        "개선 프롬프트 1종",
        "간단한 체크리스트"
      ],
      improvements: 1,
      screenshots: 1,
      accessibility: false,
      cvr: false,
      heatmap: false,
      css: false
    }
  },
  {
    id: "micro-analysis",
    name: "마이크로 분석",
    price: "₩99K",
    badge: "가성비 최고!",
    color: "#EE6C4D",
    features: {
      scope: "1페이지 (모바일/데스크톱)",
      analysis: "기초 분석 + 기본 CVR 분석",
      prompts: "개선 프롬프트 3종",
      report: "2쪽 PDF 리포트 + TXT + 체크리스트",
      delivery: "24시간 빠른 납기"
    },
    sampleContent: {
      pageCount: 2,
      sections: [
        "기본 정보 및 종합 점수",
        "모바일/데스크톱 스크린샷",
        "기초 CVR 분석",
        "평가 기준별 점수",
        "개선 프롬프트 3종",
        "기초 접근성 감사",
        "상세 체크리스트"
      ],
      improvements: 3,
      screenshots: 2,
      accessibility: "기초",
      cvr: "기본",
      heatmap: false,
      css: false
    }
  },
  {
    id: "full-page-deep",
    name: "풀페이지 심층",
    price: "₩299K",
    badge: "인기",
    color: "#EE6C4D",
    features: {
      scope: "전체 1페이지 (크로스브라우징)",
      analysis: "심층 분석 + 심화 CVR 분석",
      prompts: "개선 프롬프트 5종 + 이미지 3개",
      report: "5쪽 PDF 리포트 + TXT + 체크리스트",
      delivery: "72시간 납기"
    },
    sampleContent: {
      pageCount: 5,
      sections: [
        "커버 페이지",
        "종합 분석 및 점수",
        "크로스브라우징 스크린샷 (모바일/태블릿/데스크톱)",
        "심화 CVR 분석 및 퍼널",
        "평가 기준별 상세 분석",
        "개선 프롬프트 5종 + 이미지 3개",
        "히트맵/세션 분석",
        "완전 접근성 감사",
        "상세 체크리스트",
        "우선순위별 액션 플랜"
      ],
      improvements: 5,
      screenshots: 3,
      accessibility: "완전",
      cvr: "심화",
      heatmap: true,
      css: false,
      images: 3
    }
  },
  {
    id: "full-system",
    name: "전체 시스템",
    price: "₩799K+",
    badge: "풀버전!",
    color: "#1A1A1A",
    features: {
      scope: "전체 사이트 (크로스브라우징 심층)",
      analysis: "전문가 분석 + 고급 CVR (퍼널)",
      prompts: "개선 프롬프트 5종+ + 이미지 5개+",
      css: "CSS 가이드 (기본/전체)",
      accessibility: "전사 접근성 표준화 + 심층 사용자 테스트",
      report: "8~20쪽 상세 PDF 리포트 + TXT + 상세 체크리스트",
      delivery: "72시간 납기"
    },
    sampleContent: {
      pageCount: "8~20",
      sections: [
        "커버 페이지",
        "Executive Summary",
        "전체 사이트 구조 분석",
        "크로스브라우징 심층 테스트 결과",
        "고급 CVR 퍼널 분석",
        "페이지별 상세 분석",
        "디자인 시스템 진단",
        "CSS 가이드 (기본 토큰)",
        "CSS 가이드 (전체 컴포넌트)",
        "개선 프롬프트 5종+ + 이미지 5개+",
        "전사 접근성 표준화 가이드",
        "심층 사용자 테스트 결과",
        "히트맵/세션 분석",
        "성능 벤치마크",
        "우선순위별 로드맵",
        "상세 체크리스트",
        "부록 (기술 스펙)"
      ],
      improvements: "5+",
      screenshots: "10+",
      accessibility: "전사 표준화",
      cvr: "고급 퍼널",
      heatmap: true,
      css: "기본/전체",
      images: "5+",
      designSystem: true,
      userTesting: true
    }
  }
];

export function PricingTierSamples() {
  const [selectedTier, setSelectedTier] = useState(pricingTiers[0]);

  return (
    <DashboardLayout>
      <div className="dashboard-container bg-white">
        {/* Header */}
        <div className="section-spacing">
          <div className="mb-8">
            <h1
              className="text-2xl lg:text-3xl font-bold mb-2"
              style={{ color: "var(--primary)" }}
            >
              가격대별 납품 샘플 미리보기
            </h1>
            <p className="text-gray-600">
              각 가격대별로 제공되는 납품물의 내용과 구조를 확인할 수 있습니다.
            </p>
          </div>

          {/* Tier Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {pricingTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedTier.id === tier.id
                    ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                    <p className="text-2xl font-extrabold" style={{ color: tier.color }}>
                      {tier.price}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: tier.color }}
                  >
                    {tier.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {typeof tier.sampleContent.pageCount === 'number' 
                    ? `${tier.sampleContent.pageCount}쪽` 
                    : tier.sampleContent.pageCount} 리포트
                </p>
              </button>
            ))}
          </div>

          {/* Selected Tier Details */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedTier.name}</h2>
                <p className="text-4xl font-extrabold" style={{ color: selectedTier.color }}>
                  {selectedTier.price}
                </p>
              </div>
              <span
                className="px-6 py-2 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: selectedTier.color }}
              >
                {selectedTier.badge}
              </span>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4" style={{ color: "var(--primary)" }}>
                  제공 내용
                </h3>
                {Object.entries(selectedTier.features).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: selectedTier.color }} />
                    <div>
                      <p className="text-sm text-gray-500 capitalize">{key}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4" style={{ color: "var(--primary)" }}>
                  납품물 상세
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" style={{ color: selectedTier.color }} />
                    <span className="font-semibold">
                      {typeof selectedTier.sampleContent.pageCount === 'number'
                        ? `${selectedTier.sampleContent.pageCount}쪽`
                        : selectedTier.sampleContent.pageCount} PDF 리포트
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" style={{ color: selectedTier.color }} />
                    <span className="font-semibold">
                      프롬프트 {selectedTier.sampleContent.improvements}종 TXT 파일
                    </span>
                  </div>
                  {selectedTier.sampleContent.images && (
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5" style={{ color: selectedTier.color }} />
                      <span className="font-semibold">
                        이미지 프롬프트 {selectedTier.sampleContent.images}개
                      </span>
                    </div>
                  )}
                  {selectedTier.sampleContent.css && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" style={{ color: selectedTier.color }} />
                      <span className="font-semibold">CSS 가이드 ({selectedTier.sampleContent.css})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Report Sections */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: "var(--primary)" }}>
                리포트 구성 섹션
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedTier.sampleContent.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: selectedTier.color }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium">{section}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
                style={{ backgroundColor: selectedTier.color }}
              >
                <Eye className="w-5 h-5" />
                샘플 미리보기
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all hover:shadow-lg"
                style={{ borderColor: selectedTier.color, color: selectedTier.color }}
              >
                <Download className="w-5 h-5" />
                샘플 다운로드
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 rounded-xl bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="font-bold mb-2 text-blue-900">샘플 생성 안내</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 각 등급별로 실제 납품되는 내용의 구조와 형식을 확인할 수 있습니다.</li>
                  <li>• "샘플 미리보기" 버튼을 클릭하면 실제 PDF 레이아웃을 확인할 수 있습니다.</li>
                  <li>• "샘플 다운로드" 버튼으로 고객에게 제공할 샘플 파일을 생성할 수 있습니다.</li>
                  <li>• 전체 시스템은 프로젝트 규모에 따라 8~20쪽으로 구성됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
