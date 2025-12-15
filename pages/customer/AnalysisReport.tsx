import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDeviceType } from "../../hooks/useDeviceType";
import {
  getAnalysisReport,
  getAnalysisById,
} from "../../lib/api/analysis";
import { DashboardLayout } from "../../components/DashboardLayout";
import { SubscriptionLockOverlay } from "../../components/SubscriptionLockOverlay";
import { MobileDownloadOnlyView } from "../../components/MobileDownloadOnlyView";
import {
  ArrowLeft,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  TrendingDown,
  Flame,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { EvaluationCriteria, Improvement, ReportSummary } from "./report/types";
import { generateGuidelinePrompt } from "./report/guidelinePrompt";
import { generateReportPDF } from "../../lib/reportPdfTemplate";



const REPORT_MONO = {
  text: "#111111",
  subtle: "#4B4B4B",
  border: "#E5E7EB",
  light: "#F6F6F6",
  lighter: "#EDEDED",
  dark: "#000000",
};

const CHART_COLORS = {
  accent: "#EE6C4D",
  secondary: "#84A98C",
  warning: "#F59E0B",
  success: "#84A98C",
};

const getGrade = (score: number) => {
  if (score >= 90) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
};

export function AnalysisReport() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { isMobile } = useDeviceType();
  const [activeTab, setActiveTab] = useState<
    "overview" | "criteria" | "improvements" | "seo" | "guideline"
  >("overview");
  const [activeImprovementTab, setActiveImprovementTab] = useState<
    "all" | "critical" | "high" | "medium" | "low"
  >("all");

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    async function loadReport() {
      if (!id) return;
      try {
        const project = await getAnalysisById(id);
        const data = await getAnalysisReport(id);

        if (data && data.report_data) {
          setReportData({
            ...data.report_data,
            url: project.url,
            analyzedAt: new Date(project.created_at).toLocaleDateString(),
            analyst: "AI Analysis Engine",
          });
        }
      } catch (e) {
        console.error("Failed to load report:", e);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  // Show loading or error if no data
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!reportData) {
    return (
      <DashboardLayout>
        <div className=" flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">분석 리포트를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-6">분석이 아직 완료되지 않았거나 리포트가 존재하지 않습니다.</p>
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Extract data from reportData
  const currentEvaluationCriteria: EvaluationCriteria[] = reportData.evaluationCriteria || [];
  const currentImprovements: Improvement[] = reportData.improvements || [];

  const totalScore =
    reportData.totalScore ||
    Math.round(
      currentEvaluationCriteria.reduce(
        (sum, criteria) => sum + criteria.score * (criteria.weight / 100),
        0
      )
    );

  const report: ReportSummary = {
    ...reportData,
    grade: getGrade(totalScore),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#ce0000ff";
      case "high":
        return "#111111";
      case "medium":
        return "#84A98C";
      case "low":
        return "#A0A0A0";
      default:
        return "#7A7A7A";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "critical":
        return "치명적";
      case "high":
        return "높음";
      case "medium":
        return "중간";
      case "low":
        return "낮음";
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return CheckCircle;
      case "fail":
        return XCircle;
      case "warning":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "#1E1E1E";
      case "fail":
        return "#4A4A4A";
      case "warning":
        return "#7A7A7A";
      default:
        return "#9D9D9D";
    }
  };

  const guidelineText = generateGuidelinePrompt({
    report,
    totalScore,
    evaluationCriteria: currentEvaluationCriteria,
    improvements: currentImprovements,
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pass":
        return "통과";
      case "fail":
        return "개선 필요";
      case "warning":
        return "주의";
      default:
        return status;
    }
  };

  // 레이더 차트 데이터
  const radarData = currentEvaluationCriteria.map((c) => ({
    category: c.category.split("(")[0].trim(),
    score: c.score || 0,
    fullMark: 100,
  }));

  // 카테고리별 개선 항목 수
  const categoryData = [
    {
      category: "속도 & 성능",
      count: currentImprovements.filter(
        (i) => i.category.includes("속도") || i.category.includes("성능")
      ).length,
      color: "#EE6C4D",
    },
    {
      category: "첫인상",
      count: currentImprovements.filter((i) => i.category.includes("첫인상")).length,
      color: "#84A98C",
    },
    {
      category: "이탈 방지",
      count: currentImprovements.filter((i) => i.category.includes("이탈")).length,
      color: "#F59E0B",
    },
    {
      category: "모바일 경험",
      count: currentImprovements.filter((i) => i.category.includes("모바일")).length,
      color: "#84A98C",
    },
    {
      category: "체류 유도",
      count: currentImprovements.filter((i) => i.category.includes("체류")).length,
      color: "#293241",
    },
    {
      category: "접근성",
      count: currentImprovements.filter((i) => i.category.includes("접근성")).length,
      color: "#6B7280",
    },
    {
      category: "SEO",
      count: currentImprovements.filter((i) => i.category.includes("SEO")).length,
      color: "#10B981",
    },
  ];

  // 우선순위별 개선 항목 수
  const priorityData = [
    {
      priority: "치명적",
      count: currentImprovements.filter((i) => i.priority.toLowerCase() === "critical")
        .length,
      color: "#DC2626",
    },
    {
      priority: "높음",
      count: currentImprovements.filter((i) => i.priority.toLowerCase() === "high")
        .length,
      color: "#EE6C4D",
    },
    {
      priority: "중간",
      count: currentImprovements.filter((i) => i.priority.toLowerCase() === "medium")
        .length,
      color: "#F59E0B",
    },
    {
      priority: "낮음",
      count: currentImprovements.filter((i) => i.priority.toLowerCase() === "low")
        .length,
      color: "#84A98C",
    },
  ];

  // 점수 추이 데이터 생성 (현재 점수 기준)
  const generateScoreHistory = (currentScore: number) => {
    const history = [];
    let score = Math.max(0, currentScore - 15); // 15점 낮게 시작

    for (let i = 5; i >= 0; i--) {
      history.push({
        month: `${i}개월 전`,
        score: Math.min(100, Math.max(0, Math.round(score))),
      });
      // 점진적 상승 (현재 점수까지)
      score += (currentScore - score) / (i + 1) + (Math.random() * 5 - 2.5);
    }
    // 마지막은 현재 점수로 고정
    history[history.length - 1].score = currentScore;
    return history;
  };

  const scoreHistory = generateScoreHistory(totalScore);

  // 탭 잠금 로직
  const isTabLocked = (tabId: string) => {
    // 무료 플랜인 경우 SEO 분석과 AI 디자인 지침서 탭 잠금
    if (user?.subscription_plan === "free") {
      return ["seo", "guideline"].includes(tabId);
    }
    return false;
  };



  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return; // 중복 클릭 방지
    
    setIsGeneratingPDF(true);
    try {
      // 템플릿을 사용해서 PDF 생성 (스크린샷이 아닌 템플릿 기반)
      // 전체 개선 항목을 전달 (템플릿 내부에서 Top 3 추출)
      await generateReportPDF(
        report,
        currentEvaluationCriteria,
        currentImprovements, // 전체 개선 항목 전달
        totalScore
        // reportElement를 전달하지 않아서 템플릿 HTML 사용
      );
      alert("종합분석 PDF 다운로드가 완료되었습니다!");
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 모바일에서는 다운로드 전용 뷰 표시
  if (isMobile) {
    // report.id가 없으므로 임시 ID 사용 또는 props로 받아야 함
    return (
      <MobileDownloadOnlyView
        reportId="current"
        onDownloadPDF={handleDownloadPDF}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="analysis-report-page" id="report-content">
        <div id="report-container" className="dashboard-container bg-white">
          {/* Header */}
          <div className="section-spacing">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-3">
                  <h1
                    className="text-2xl lg:text-3xl font-bold leading-tight"
                    style={{ color: "var(--primary)" }}
                  >
                    분석 리포트
                  </h1>
                  <div
                    className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full flex-shrink-0"
                    style={{ background: REPORT_MONO.light }}
                  >
                    <Flame
                      className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0"
                      style={{ color: REPORT_MONO.text }}
                    />
                    <span
                      className="font-semibold text-base lg:text-base whitespace-nowrap"
                      style={{ color: REPORT_MONO.text }}
                    >
                      긴급 조치 필요
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 text-base text-gray-600">
                  <span className="break-all">{report.url}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">
                    분석일: {report.analyzedAt}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">
                    분석가: {report.analyst}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <button
                  onClick={() => {
                    const text = generateGuidelinePrompt({
                      report,
                      evaluationCriteria: currentEvaluationCriteria,
                      improvements: currentImprovements,
                      totalScore,
                    });
                    navigator.clipboard.writeText(text);
                    alert("AI 디자인 지침서 프롬프트가 복사되었습니다!");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 lg:py-3 rounded-xl border-2 font-semibold transition-all hover:shadow-md text-base lg:text-base whitespace-nowrap"
                  style={{
                    borderColor: "var(--secondary)",
                    color: "var(--secondary)",
                  }}
                >
                  <Copy className="w-4 lg:w-5 h-4 lg:h-5" />
                  지침서 복사
                </button>
                {/* PDF 다운로드 버튼 - 서비스 준비 중으로 임시 숨김
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 lg:py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg text-base lg:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: REPORT_MONO.dark, color: "#FFFFFF" }}
                >
                  <Download className={`w-4 lg:w-5 h-4 lg:h-5 ${isGeneratingPDF ? 'animate-spin' : ''}`} />
                  {isGeneratingPDF ? "생성 중..." : "종합분석 다운로드"}
                </button>
                */}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 lg:mb-8 overflow-x-auto">
            {[
              { id: "overview", label: "종합 분석" },
              { id: "criteria", label: "평가 기준" },
              { id: "improvements", label: "개선 필요 항목" },
              { id: "seo", label: "SEO 분석" },
              { id: "guideline", label: "AI 디자인 지침서" },
            ].map((tab) => {
              const locked = isTabLocked(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold transition-all text-base lg:text-lg whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-white shadow-lg"
                      : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                  style={
                    activeTab === tab.id
                      ? { background: REPORT_MONO.dark, color: "#FFFFFF" }
                      : {}
                  }
                >
                  {locked && (
                    <div className="w-4 h-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
          {/* Tab Content */}
          <div className="space-y-6 lg:space-y-8 relative">
            {isTabLocked(activeTab) && (
              <SubscriptionLockOverlay
                onUpgrade={() => alert("구독 페이지로 이동합니다 (구현 중)")}
              />
            )}
            {activeTab === "overview" && (
              <div id="overview-content" className="space-y-6 lg:space-y-8">
                {/* 1. Top Section: Score & Radar & Key Metrics */}
                <div
                  className="grid grid-cols-1 lg:grid-cols-10 gap-6"
                  style={{ pageBreakInside: "avoid" }}
                >
                  {/* 종합 분석 결과 - 2칸 */}
                  <div className="lg:col-span-2 card-base card-padding flex flex-col">
                    <h3 className="text-lg font-bold text-gray-500 mb-6 text-center w-full">
                      종합 분석 결과
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div
                        className="w-32 h-32 rounded-full flex items-center justify-center text-white mb-4 shadow-lg"
                        style={{
                          background:
                            totalScore >= 90
                              ? "#84A98C"
                              : totalScore >= 70
                              ? "#84A98C"
                              : totalScore >= 50
                              ? "#F59E0B"
                              : "#EE6C4D",
                        }}
                      >
                        <span className="text-5xl font-bold">
                          {report.grade}
                        </span>
                      </div>
                      <div
                        className="text-3xl font-bold mb-2"
                        style={{ color: "var(--primary)" }}
                      >
                        {totalScore}점
                      </div>
                      <div className="text-gray-500">
                        전체 상위{" "}
                        {totalScore >= 90
                          ? "5%"
                          : totalScore >= 70
                          ? "20%"
                          : "50%"}{" "}
                        이내
                      </div>
                    </div>
                  </div>

                  {/* 영역별 점수 분포 - 3칸 */}
                  <div className="lg:col-span-3 card-base card-padding flex flex-col">
                    <h3
                      className="text-lg font-bold mb-6 text-center w-full"
                      style={{ color: "var(--primary)" }}
                    >
                      영역별 점수 분포
                    </h3>
                    <div className="flex-1 w-full min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#E5E7EB" />
                          <PolarAngleAxis
                            dataKey="category"
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: "#6B7280", fontSize: 10 }}
                          />
                          <Radar
                            name="점수"
                            dataKey="score"
                            stroke={CHART_COLORS.accent}
                            fill={CHART_COLORS.accent}
                            fillOpacity={0.4}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 핵심 지표 요약 - 5칸 */}
                  <div className="lg:col-span-5 card-base card-padding flex flex-col">
                    <h3
                      className="text-lg font-bold mb-6 text-center w-full"
                      style={{ color: "var(--primary)" }}
                    >
                      핵심 지표 요약
                    </h3>
                    <div className="flex-1 grid grid-cols-2 gap-4 items-center">
                      <div className="py-2.5 px-5 rounded-xl bg-gray-50 text-center h-full flex flex-col justify-center">
                        <div className="text-base text-gray-500 mb-2">
                          이탈률
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                          {report.currentMetrics?.bounceRate || '-'}
                        </div>
                        <div className="text-base text-gray-400">
                          목표: {report.targetMetrics?.bounceRate || '-'}
                        </div>
                      </div>
                      <div className="py-2.5 px-5 rounded-xl bg-gray-50 text-center h-full flex flex-col justify-center">
                        <div className="text-base text-gray-500 mb-2">
                          평균 체류 시간
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                          {report.currentMetrics?.avgSessionTime || '-'}
                        </div>
                        <div className="text-base text-gray-400">
                          목표: {report.targetMetrics?.avgSessionTime || '-'}
                        </div>
                      </div>
                      <div className="py-2.5 px-5 rounded-xl bg-gray-50 text-center h-full flex flex-col justify-center">
                        <div className="text-base text-gray-500 mb-2">
                          페이지/세션
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                          {report.currentMetrics?.pagesPerSession || '-'}
                        </div>
                        <div className="text-base text-gray-400">
                          목표: {report.targetMetrics?.pagesPerSession || '-'}
                        </div>
                      </div>
                      <div className="py-2.5 px-5 rounded-xl bg-gray-50 text-center h-full flex flex-col justify-center">
                        <div className="text-base text-gray-500 mb-2">
                          전환율
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                          {report.currentMetrics?.conversionRate || '-'}
                        </div>
                        <div className="text-base text-gray-400">
                          목표: {report.targetMetrics?.conversionRate || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 긴급 개선 필요 항목 */}
                <div className="card-base card-padding">
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      긴급 개선 필요 항목 (Top 3)
                    </h3>
                    <button
                      onClick={() => setActiveTab("improvements")}
                      className="text-base font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                    >
                      전체 보기 <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentImprovements
                      .sort((a, b) => {
                        const priorityOrder: { [key: string]: number } = {
                          critical: 0,
                          high: 1,
                          medium: 2,
                          low: 3,
                        };
                        const pA =
                          priorityOrder[a.priority.toLowerCase()] ?? 99;
                        const pB =
                          priorityOrder[b.priority.toLowerCase()] ?? 99;
                        return pA - pB;
                      })
                      .slice(0, 3)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-white shadow-sm"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                item.priority.toLowerCase() === "critical"
                                  ? "bg-red-50 text-red-500"
                                  : item.priority.toLowerCase() === "high"
                                  ? "bg-orange-50 text-orange-500"
                                  : item.priority.toLowerCase() === "medium"
                                  ? "bg-yellow-50 text-yellow-500"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              <AlertCircle className="w-5 h-5" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-base text-gray-600 line-clamp-2">
                              {item.currentState} → {item.targetState}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`text-base font-medium px-2 py-1 rounded ${
                                  item.priority.toLowerCase() === "critical"
                                    ? "bg-red-100 text-red-700"
                                    : item.priority.toLowerCase() === "high"
                                    ? "bg-orange-100 text-orange-700"
                                    : item.priority.toLowerCase() === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {getPriorityLabel(item.priority.toLowerCase())}
                              </span>
                              <span className="text-base text-gray-400">|</span>
                              <span className="text-base text-gray-500">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 2. 평가 기준 요약 */}
                <div
                  className="card-base card-padding"
                  style={{ pageBreakInside: "avoid" }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      평가 기준 요약
                    </h3>
                    <button
                      onClick={() => setActiveTab("criteria")}
                      className="text-base font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                    >
                      상세 보기 <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentEvaluationCriteria.map((criteria, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4
                            className="font-bold text-lg"
                            style={{ color: "var(--primary)" }}
                          >
                            {criteria.category}
                          </h4>
                          <span
                            className={`text-3xl font-extrabold ${
                              criteria.score >= 70
                                ? "text-green-600"
                                : criteria.score >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {criteria.score}
                          </span>
                        </div>
                        <p className="text-base text-gray-600 line-clamp-2">
                          {criteria.description}
                        </p>
                        <div className="text-base text-gray-500 mt-2">
                          가중치: {criteria.weight}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 전체 개선 항목 요약 */}
                <div
                  className="card-base card-padding"
                  style={{ pageBreakInside: "avoid" }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      개선 필요 항목 ({currentImprovements.length}개)
                    </h3>
                    <button
                      onClick={() => setActiveTab("improvements")}
                      className="text-base font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                    >
                      상세 보기 <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentImprovements.slice(0, 6).map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4
                            className="font-bold text-xl flex-1"
                            style={{ color: "var(--primary)" }}
                          >
                            {item.title}
                          </h4>
                          <span
                            className={`px-3 py-1.5 rounded text-base font-bold text-white ml-2 ${
                              item.priority === "critical"
                                ? "bg-red-600"
                                : item.priority === "high"
                                ? "bg-orange-600"
                                : item.priority === "medium"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {getPriorityLabel(item.priority)}
                          </span>
                        </div>
                        <p className="text-base text-gray-600 line-clamp-2 mb-3">
                          {item.currentState} → {item.targetState}
                        </p>
                        <div className="flex justify-between gap-2 text-base">
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded font-semibold">
                            영향도: {item.impact}
                          </span>
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded font-semibold">
                            난이도: {item.effort}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {currentImprovements.length > 6 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setActiveTab("improvements")}
                        className="text-base font-medium text-gray-600 hover:text-gray-900"
                      >
                        + {currentImprovements.length - 6}개 더 보기
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. SEO 분석 요약 */}
                <div
                  className="card-base card-padding"
                  style={{ pageBreakInside: "avoid" }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      SEO 분석 요약
                    </h3>
                    <button
                      onClick={() => setActiveTab("seo")}
                      className="text-base font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                    >
                      상세 보기 <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>

                  {/* 핵심 SEO 점수 (4개) */}
                  <div
                    className={`grid grid-cols-1 gap-4 mb-6 ${
                      (currentEvaluationCriteria.find((c) =>
                        c.category.includes("SEO")
                      )?.subcriteria.length || 0) === 1
                        ? "md:grid-cols-1"
                        : (currentEvaluationCriteria.find((c) =>
                            c.category.includes("SEO")
                          )?.subcriteria.length || 0) === 2
                        ? "grid-cols-2 md:grid-cols-2"
                        : (currentEvaluationCriteria.find((c) =>
                            c.category.includes("SEO")
                          )?.subcriteria.length || 0) === 3
                        ? "grid-cols-2 md:grid-cols-3"
                        : "grid-cols-2 md:grid-cols-4"
                    }`}
                  >
                    {currentEvaluationCriteria
                      .find((c) => c.category.includes("SEO"))
                      ?.subcriteria.map((sub, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-gray-50 text-center"
                        >
                          <div className="text-base text-gray-600 mb-2 font-medium">
                            {sub.name}
                          </div>
                          <div
                            className={`text-4xl font-extrabold mb-1 ${
                              sub.score >= 80
                                ? "text-green-600"
                                : sub.score >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {sub.score}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* SEO 개선 항목 */}
                  <div>
                    <h4
                      className="text-lg font-bold mb-4"
                      style={{ color: "var(--primary)" }}
                    >
                      주요 개선 항목
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentImprovements
                        .filter((i) => i.category.includes("SEO"))
                        .slice(0, 5)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3
                                className="font-bold text-base flex-1"
                                style={{ color: "var(--primary)" }}
                              >
                                {item.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-sm font-bold text-white ml-2 ${
                                  item.priority === "critical"
                                    ? "bg-red-600"
                                    : item.priority === "high"
                                    ? "bg-orange-600"
                                    : item.priority === "medium"
                                    ? "bg-yellow-600"
                                    : "bg-gray-600"
                                }`}
                              >
                                {getPriorityLabel(item.priority)}
                              </span>
                            </div>
                            <p className="text-base text-gray-600 mb-2">
                              {item.currentState}
                            </p>
                            <div className="flex gap-2 text-sm">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-semibold">
                                영향도: {item.impact}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-semibold">
                                난이도: {item.effort}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "criteria" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentEvaluationCriteria.map((criteria, index) => (
                  <div
                    key={index}
                    className="card-base overflow-hidden flex flex-col h-full"
                  >
                    <div
                      className="card-padding"
                      style={{
                        background:
                          criteria.score >= 70
                            ? REPORT_MONO.lighter
                            : criteria.score >= 50
                            ? "#FEF3C7"
                            : REPORT_MONO.light,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                        <div>
                          <h3
                            className="text-lg lg:text-xl font-bold mb-2"
                            style={{ color: "var(--primary)" }}
                          >
                            {criteria.category}
                          </h3>
                          <p className="text-base lg:text-lg text-gray-700 leading-relaxed break-words">
                            {criteria.description}
                          </p>
                        </div>
                        <div className="text-center flex-shrink-0">
                          <div
                            className="text-3xl lg:text-4xl font-bold mb-1"
                            style={{
                              color:
                                criteria.score >= 70
                                  ? "#84A98C"
                                  : criteria.score >= 50
                                  ? "#F59E0B"
                                  : "#EE6C4D",
                            }}
                          >
                            {criteria.score}
                          </div>
                          <div className="text-base lg:text-base text-gray-600">
                            가중치 {criteria.weight}%
                          </div>
                        </div>
                      </div>
                      <div className="text-base lg:text-lg text-gray-600">
                        <span className="font-semibold">평가 방법:</span>{" "}
                        {criteria.methodology}
                      </div>
                    </div>

                    <div className="divide-y divide-gray-200 flex-1">
                      {criteria.subcriteria.map((sub, subIndex) => (
                        <div
                          key={subIndex}
                          className="card-padding hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4
                                  className="font-bold text-base lg:text-lg"
                                  style={{ color: "var(--primary)" }}
                                >
                                  {sub.name}
                                </h4>
                                <span
                                  className={`px-2 lg:px-3 py-1 rounded-full text-base font-bold ${
                                    sub.score >= 70
                                      ? "bg-gray-900 text-white"
                                      : sub.score >= 50
                                      ? "bg-gray-500 text-white"
                                      : "bg-gray-300 text-gray-800"
                                  }`}
                                >
                                  {sub.score}점
                                </span>
                              </div>
                              <p className="text-base lg:text-lg text-gray-700 mb-2 leading-relaxed break-words">
                                {sub.description}
                              </p>
                              <div className="text-base text-gray-600">
                                <span className="font-semibold">기준:</span>{" "}
                                {sub.benchmark}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "improvements" && (
              <div className="space-y-6">
                {/* Priority Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { id: "all", label: "전체" },
                    { id: "critical", label: "치명적" },
                    { id: "high", label: "높음" },
                    { id: "medium", label: "중간" },
                    { id: "low", label: "낮음" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveImprovementTab(tab.id as any)}
                      className={`px-4 py-2 rounded-lg text-base font-semibold whitespace-nowrap transition-colors ${
                        activeImprovementTab === tab.id
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 opacity-70">
                        {tab.id === "all"
                          ? currentImprovements.length
                          : currentImprovements.filter(
                              (i) => i.priority.toLowerCase() === tab.id
                            ).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {currentImprovements
                    .filter(
                      (item) =>
                        activeImprovementTab === "all" ||
                        item.priority.toLowerCase() === activeImprovementTab
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="card-base p-4 lg:p-5 hover:shadow-md transition-all flex flex-col h-full"
                        style={{}}
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className="px-2 py-1 rounded-full text-base font-semibold text-white whitespace-nowrap"
                              style={{
                                background: getPriorityColor(item.priority),
                              }}
                            >
                              {getPriorityLabel(item.priority)}
                            </span>
                            <span className="text-base text-gray-700 bg-gray-100 px-2 py-1 rounded font-medium">
                              난이도: {item.effort}
                            </span>
                            <span className="text-base text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                          <h3
                            className="text-lg font-bold mb-2 break-words"
                            style={{ color: "var(--primary)" }}
                          >
                            {item.title}
                          </h3>

                        </div>

                        <div className="mt-auto space-y-3">

                          <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-xl">
                            <div>
                              <div className="text-base font-semibold text-gray-500 mb-1">
                                현재 상태
                              </div>
                              <div className="text-base text-red-600 font-medium line-clamp-2">
                                {item.currentState}
                              </div>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                              <div className="text-base font-semibold text-gray-500 mb-1">
                                개선 목표
                              </div>
                              <div className="text-base text-green-600 font-medium line-clamp-2">
                                {item.targetState}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <>
                {/* SEO Overview */}
                <div className="card-base card-padding">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3
                        className="text-lg lg:text-xl font-bold mb-2"
                        style={{ color: "var(--primary)" }}
                      >
                        SEO 종합 점수
                      </h3>
                      <p className="text-base text-gray-600">
                        검색 엔진 최적화 수준 및 유기적 트래픽 획득 능력
                      </p>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div
                        className="text-3xl lg:text-4xl font-bold mb-1"
                        style={{ color: REPORT_MONO.text }}
                      >
                        42점
                      </div>
                      <div className="text-base lg:text-base text-gray-600">
                        업계 평균 78점
                      </div>
                    </div>
                  </div>

                  <div
                    className={`grid grid-cols-1 gap-4 ${
                      (currentEvaluationCriteria.find((c) =>
                        c.category.includes("SEO")
                      )?.subcriteria.length || 0) === 1
                        ? "lg:grid-cols-1"
                        : (currentEvaluationCriteria.find((c) =>
                            c.category.includes("SEO")
                          )?.subcriteria.length || 0) === 2
                        ? "sm:grid-cols-2 lg:grid-cols-2"
                        : (currentEvaluationCriteria.find((c) =>
                            c.category.includes("SEO")
                          )?.subcriteria.length || 0) === 3
                        ? "sm:grid-cols-2 lg:grid-cols-3"
                        : "sm:grid-cols-2 lg:grid-cols-4"
                    }`}
                  >
                    {currentEvaluationCriteria
                      .find((c) => c.category.includes("SEO"))
                      ?.subcriteria.map((sub, index) => (
                        <div key={index} className="card-base card-padding">
                          <div className="text-base lg:text-base text-gray-600 mb-1">
                            {sub.name}
                          </div>
                          <div
                            className="text-2xl lg:text-3xl font-extrabold mb-2"
                            style={{
                              color:
                                sub.score >= 80
                                  ? "#84A98C"
                                  : sub.score >= 60
                                  ? "#F59E0B"
                                  : sub.score >= 40
                                  ? "#EE6C4D"
                                  : "#030303",
                            }}
                          >
                            {sub.score}점
                          </div>
                          <div className="text-base text-gray-600 line-clamp-2">
                            {sub.description}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* SEO Improvements */}
                <div>
                  <h3
                    className="text-xl lg:text-2xl font-bold mb-6"
                    style={{ color: "var(--primary)" }}
                  >
                    SEO 개선 항목
                  </h3>
                  <div className="space-y-4">
                    {currentImprovements
                      .filter((imp) => imp.category === "SEO")
                      .map((improvement) => {
                        const StatusIcon = getStatusIcon(improvement.status);
                        return (
                          <div
                            key={improvement.id}
                            className="card-base overflow-hidden bg-white"
                            style={{}}
                          >
                            <div className="card-padding">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <h4
                                      className="font-bold text-base lg:text-lg break-words"
                                      style={{ color: "var(--primary)" }}
                                    >
                                      {improvement.title}
                                    </h4>
                                    <div
                                      className="px-2 lg:px-3 py-1 rounded-full text-base font-bold flex-shrink-0"
                                      style={{
                                        background: getPriorityColor(
                                          improvement.priority
                                        ),
                                        color: "white",
                                      }}
                                    >
                                      {getPriorityLabel(improvement.priority)}
                                    </div>
                                    <div
                                      className="flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-base font-semibold flex-shrink-0"
                                      style={{
                                        background:
                                          getStatusColor(improvement.status) +
                                          "20",
                                        color: getStatusColor(
                                          improvement.status
                                        ),
                                      }}
                                    >
                                      <StatusIcon className="w-3 lg:w-4 h-3 lg:h-4" />
                                      {getStatusLabel(improvement.status)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <div
                                  className="rounded-lg p-3 lg:p-4"
                                  style={{ background: REPORT_MONO.light }}
                                >
                                  <div
                                    className="text-base lg:text-base font-semibold mb-2"
                                    style={{ color: REPORT_MONO.text }}
                                  >
                                    현재 상태
                                  </div>
                                  <p className="text-base lg:text-base text-gray-700 leading-relaxed break-words">
                                    {improvement.currentState}
                                  </p>
                                </div>
                                <div
                                  className="rounded-lg p-3 lg:p-4"
                                  style={{ background: REPORT_MONO.lighter }}
                                >
                                  <div
                                    className="text-base lg:text-base font-semibold mb-2"
                                    style={{ color: REPORT_MONO.text }}
                                  >
                                    목표 상태
                                  </div>
                                  <p className="text-base lg:text-base text-gray-700 leading-relaxed break-words">
                                    {improvement.targetState}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="text-base text-gray-600 mb-1">
                                    예상 효과
                                  </div>
                                  <div className="font-bold text-lg lg:text-xl text-gray-900 break-words">
                                    {improvement.impact}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-base text-gray-600 mb-1">
                                    작업 규모
                                  </div>
                                  <div className="font-bold text-lg lg:text-xl text-gray-900">
                                    {improvement.effort}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-base text-gray-600 mb-1">
                                    체류 시간 영향
                                  </div>
                                  <div
                                    className="font-bold text-lg lg:text-xl"
                                    style={{ color: "#84A98C" }}
                                  >
                                    {improvement.impactOnRetention}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* SEO Quick Wins */}
                <div className="card-base overflow-hidden">
                  <div
                    className="card-padding text-white"
                    style={{ background: REPORT_MONO.dark, color: "#FFFFFF" }}
                  >
                    <h3 className="text-lg lg:text-xl font-bold mb-4 text-white">
                      🎯 빠른 SEO 개선 (Quick Wins)
                    </h3>
                    <p className="text-base lg:text-lg text-white/90 mb-6 leading-relaxed">
                      작은 노력으로 큰 효과를 볼 수 있는 SEO 개선 항목들입니다.
                      1-2주 내에 완료 가능합니다.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" />
                          <h4 className="font-bold text-base lg:text-lg text-white">
                            1. Alt 텍스트 추가
                          </h4>
                        </div>
                        <p className="text-base lg:text-base text-white/80">
                          모든 이미지에 설명적 alt 추가 (작업시간: 2-3시간)
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" />
                          <h4 className="font-bold text-base lg:text-base text-white">
                            2. 메타 Description 작성
                          </h4>
                        </div>
                        <p className="text-base lg:text-base text-white/80">
                          각 페이지별 고유한 description (작업시간: 4-5시간)
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" />
                          <h4 className="font-bold text-base lg:text-base text-white">
                            3. Heading 구조 정리
                          </h4>
                        </div>
                        <p className="text-base lg:text-base text-white/80">
                          H1 단일화, H2-H6 논리적 순서 (작업시간: 2-3시간)
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" />
                          <h4 className="font-bold text-base lg:text-base text-white">
                            4. 페이지 Title 최적화
                          </h4>
                        </div>
                        <p className="text-base lg:text-base text-white/80">
                          50-60자 제한, 키워드 포함 (작업시간: 3-4시간)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "guideline" && (
              <div className="card-base card-padding">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3
                      className="text-lg lg:text-xl font-bold mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      AI 개선 지침서
                    </h3>
                    <p className="text-base text-gray-600">
                      AI 도구에 바로 입력 가능한 프롬프트
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const guideline =
                        document.getElementById("guideline-text")?.innerText;
                      if (guideline) {
                        navigator.clipboard.writeText(guideline);
                        alert("지침서가 클립보드에 복사되었습니다!");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold transition-all hover:shadow-md text-base whitespace-nowrap"
                    style={{
                      borderColor: REPORT_MONO.dark,
                      color: REPORT_MONO.dark,
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    전체 복사
                  </button>
                </div>

                <div
                  id="guideline-text"
                  className="p-4 lg:p-6 bg-gray-50 rounded-xl overflow-x-auto"
                >
                  <pre
                    className="text-base lg:text-base whitespace-pre-wrap break-words font-mono leading-relaxed"
                    style={{ fontFamily: "ui-monospace, monospace" }}
                  >
                    {guidelineText}
                  </pre>
                </div>

                <div className="mt-6 p-4 lg:p-6 bg-gray-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Info
                      className="w-5 lg:w-6 h-5 lg:h-6 flex-shrink-0"
                      style={{ color: "var(--secondary)" }}
                    />
                    <div>
                      <h4
                        className="font-bold mb-2 text-base lg:text-lg"
                        style={{ color: "var(--secondary)" }}
                      >
                        💡 사용 팁
                      </h4>
                      <ul className="text-base lg:text-base text-gray-700 space-y-2 leading-relaxed">
                        <li>
                          • AI 도구에 프롬프트를 입력하면 즉시 디자인 개선안을
                          생성합니다
                        </li>
                        <li>
                          • Claude나 ChatGPT에 입력하면 상세한 구현 가이드를
                          받을 수 있습니다
                        </li>
                        <li>
                          • v0.dev에 입력하면 React 컴포넌트 코드를 자동
                          생성합니다
                        </li>
                        <li>
                          • 프롬프트를 단계별로 나누어 입력하면 더 정확한 결과를
                          얻습니다
                        </li>
                      </ul>
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
