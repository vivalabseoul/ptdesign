import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Download, FileText } from "lucide-react";
import {
  SAMPLE_REPORT_DATA,
} from "../../lib/api/analysis";
import { generateReportPDF, createOverviewTemplateHTML } from "../../lib/reportPdfTemplate";
import { ReportSummary, EvaluationCriteria, Improvement } from "../customer/report/types";

const evaluationCriteria = SAMPLE_REPORT_DATA.evaluationCriteria as unknown as EvaluationCriteria[];
const improvements = SAMPLE_REPORT_DATA.improvements as unknown as Improvement[];

const reportSummary: ReportSummary = {
  ...SAMPLE_REPORT_DATA,
  totalScore: SAMPLE_REPORT_DATA.totalScore,
  grade: "B", // Calculated dynamically later
  status: "completed",
  url: "https://example.com", // Placeholder or from sample data
  analyzedAt: new Date().toISOString(),
  analyst: "AI Analyst",
  currentMetrics: {
    ...SAMPLE_REPORT_DATA.currentMetrics,
    mobileBounceRate: SAMPLE_REPORT_DATA.currentMetrics.mobileBounceRate || "0%",
  },
  industryBenchmark: SAMPLE_REPORT_DATA.industryBenchmark,
  targetMetrics: SAMPLE_REPORT_DATA.targetMetrics,
};

const getGrade = (score: number) => {
  if (score >= 90) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
};

export function PdfTemplatePreview() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // 샘플 데이터 준비
  const totalScore = Math.round(
    evaluationCriteria.reduce(
      (sum, criteria) => sum + criteria.score * (criteria.weight / 100),
      0
    )
  );

  const report: ReportSummary = {
    ...reportSummary,
    totalScore,
    grade: getGrade(totalScore),
  };

  // Top 3 개선 항목만 추출 (종합분석용)
  const top3Improvements = improvements
    .sort((a, b) => {
      const priorityOrder: { [key: string]: number } = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      const pA = priorityOrder[a.priority.toLowerCase()] ?? 99;
      const pB = priorityOrder[b.priority.toLowerCase()] ?? 99;
      return pA - pB;
    })
    .slice(0, 3);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // 종합분석 전용 템플릿 사용 (reportElement 없이 호출)
      await generateReportPDF(
        report,
        evaluationCriteria,
        top3Improvements, // Top 3만 전달
        totalScore
        // reportElement를 전달하지 않아서 템플릿 HTML 사용
      );
      alert("종합분석 PDF 생성이 완료되었습니다!");
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container bg-white">
        {/* Header */}
        <div className="section-spacing">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1
                className="text-2xl lg:text-3xl font-bold mb-2"
                style={{ color: "var(--primary)" }}
              >
                종합분석 PDF 템플릿 미리보기
              </h1>
              <p className="text-gray-600">
                종합분석 탭의 내용이 PDF로 생성될 템플릿을 미리 확인할 수
                있습니다.
              </p>
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50"
              style={{ background: "var(--primary)" }}
            >
              <Download className="w-5 h-5" />
              {isGenerating ? "생성 중..." : "종합분석 다운로드"}
            </button>
          </div>
        </div>

        {/* PDF Template Preview */}
        <div className="flex justify-center bg-gray-100 p-8 overflow-auto">
          <div
            className="bg-white shadow-lg"
            style={{
              width: "210mm",
              minHeight: "297mm",
              transform: "scale(0.8)",
              transformOrigin: "top center",
            }}
            dangerouslySetInnerHTML={{
              __html: createOverviewTemplateHTML(
                report,
                evaluationCriteria,
                top3Improvements,
                totalScore,
                "" // radarChartImage (미리보기에서는 제외)
              ),
            }}
          />
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 rounded-xl bg-gray-50 max-w-7xl mx-auto">
          <div className="flex items-start gap-3">
            <FileText
              className="w-6 h-6 flex-shrink-0"
              style={{ color: "var(--secondary)" }}
            />
            <div>
              <h3
                className="font-bold mb-2"
                style={{ color: "var(--secondary)" }}
              >
                PDF 템플릿 정보
              </h3>
              <ul className="text-base text-gray-700 space-y-1">
                <li>
                  • 이 페이지는 실제 PDF 생성에 사용되는 HTML 템플릿을 그대로 렌더링합니다.
                </li>
                <li>• 실제 PDF는 A4 크기(210mm × 297mm)로 생성됩니다.</li>
                <li>• 레이더 차트는 실제 데이터 시각화 이미지가 캡처되어 포함됩니다.</li>
                <li>
                  • "종합분석 다운로드" 버튼을 클릭하면 실제 PDF 파일을 생성할
                  수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
