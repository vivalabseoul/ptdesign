import { DashboardLayout } from "../../components/DashboardLayout";
import {
  Users,
  FolderKanban,
  TrendingUp,
  DollarSign,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  FileText,
  Plus,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  getAllAnalyses,
  getAnalysisReport,
  createAnalysis,
  saveAnalysisReport,
  updateProjectStatus,
} from "../../lib/api/analysis";
import { analyzeWebsite } from "../../lib/gemini";
import { AnalysisLoading } from "../../components/AnalysisLoading";

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projects = await getAllAnalyses();

      // 최근 5개만 가져와서 상세 정보 로드
      const recentProjects = await Promise.all(
        projects.slice(0, 5).map(async (p) => {
          let score = 0;
          let grade = "D";

          if (p.status === "completed") {
            try {
              const report = await getAnalysisReport(p.id);
              if (report && report.report_data) {
                score = report.report_data.totalScore;
                if (score >= 90) grade = "A";
                else if (score >= 70) grade = "B";
                else if (score >= 50) grade = "C";
              }
            } catch (e) {
              console.error(`Failed to load report for ${p.id}`, e);
            }
          }

          return {
            id: p.id,
            name: p.url,
            score,
            status:
              p.status === "completed"
                ? "완료"
                : p.status === "analyzing"
                ? "진행 중"
                : "대기 중",
            grade,
          };
        })
      );

      setTopProjects(recentProjects);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const handleStartAnalysis = async () => {
    if (newUrl && user) {
      setShowNewAnalysis(false);
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      performAnalysis();
    }
  };

  const performAnalysis = async () => {
    if (!user) return;

    try {
      const project = await createAnalysis(user.id, newUrl);
      const reportData = await analyzeWebsite(newUrl);
      await saveAnalysisReport(project.id, reportData);
      await updateProjectStatus(project.id, "completed");
      setAnalysisComplete(true);
      return project.id;
    } catch (error: any) {
      console.error("분석 요청 실패:", error);
      setError(error.message || "알 수 없는 오류가 발생했습니다.");
      setIsAnalyzing(false);
      setAnalysisComplete(false);
    }
  };

  const handleLoadingComplete = () => {
    setTimeout(() => {
      setNewUrl("");
      setIsAnalyzing(false);
      setAnalysisComplete(false);
      loadProjects();
      alert("분석이 완료되었습니다. 리포트 목록을 확인하세요.");
    }, 500);
  };

  if (isAnalyzing) {
    return (
      <AnalysisLoading
        onComplete={handleLoadingComplete}
        isComplete={analysisComplete}
      />
    );
  }

  // Mock Data
  const stats = [
    {
      label: "총 회원 수",
      value: "1,247",
      change: "+12.5%",
      icon: Users,
      color: "var(--accent)",
      bgColor: "var(--accent)15",
    },
    {
      label: "진행 중 분석",
      value: "34",
      change: "+5",
      icon: FolderKanban,
      color: "var(--secondary)",
      bgColor: "var(--secondary)15",
    },
    {
      label: "이번 달 매출",
      value: "₩18.2M",
      change: "+23.1%",
      icon: DollarSign,
      color: "var(--success)",
      bgColor: "var(--success)15",
    },
    {
      label: "평균 분석 점수",
      value: "78.5",
      change: "+3.2",
      icon: TrendingUp,
      color: "var(--warning)",
      bgColor: "var(--warning)15",
    },
  ];

  const monthlyAnalysis = [
    { month: "1월", count: 45 },
    { month: "2월", count: 52 },
    { month: "3월", count: 61 },
    { month: "4월", count: 58 },
    { month: "5월", count: 72 },
    { month: "6월", count: 85 },
    { month: "7월", count: 79 },
    { month: "8월", count: 94 },
    { month: "9월", count: 102 },
    { month: "10월", count: 115 },
    { month: "11월", count: 128 },
  ];

  const planDistribution = [
    { name: "Starter", value: 520, color: "#98C1D9" },
    { name: "Professional", value: 587, color: "#EE6C4D" },
    { name: "Enterprise", value: 140, color: "#293241" },
  ];

  const deviceStats = [
    { device: "Desktop", visits: 4500 },
    { device: "Mobile", visits: 3200 },
    { device: "Tablet", visits: 1100 },
  ];

  const categoryScores = [
    { category: "UI 디자인", score: 82 },
    { category: "UX 플로우", score: 75 },
    { category: "접근성", score: 68 },
    { category: "모바일", score: 79 },
    { category: "성능", score: 85 },
    { category: "SEO", score: 72 },
  ];

  const recentActivities = [
    {
      user: "김지민",
      action: "새로운 분석 시작",
      project: "example.com",
      time: "5분 전",
    },
    {
      user: "박서준",
      action: "분석 리포트 검수 완료",
      project: "company.co.kr",
      time: "12분 전",
    },
    {
      user: "이수아",
      action: "AI 지침서 생성",
      project: "startup.io",
      time: "23분 전",
    },
    {
      user: "정현우",
      action: "고객 문의 답변",
      project: "shop.com",
      time: "1시간 전",
    },
    {
      user: "최민지",
      action: "새로운 회원 가입",
      project: "-",
      time: "2시간 전",
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        {/* Header */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">오류 발생: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="section-spacing flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl lg:text-3xl font-bold leading-tight"
              style={{ color: "var(--primary)" }}
            >
              관리자 대시보드
            </h1>
            <p className="text-gray-600 mt-2 text-base sm:text-base leading-relaxed">
              전체 시스템 현황을 한눈에 확인하세요
            </p>
          </div>
          <button
            onClick={() => setShowNewAnalysis(true)}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105 text-base sm:text-base whitespace-nowrap"
            style={{ background: "var(--accent)" }}
          >
            <Plus className="w-5 h-5" />새 분석 시작
          </button>
        </div>

        {/* New Analysis Modal */}
        {showNewAnalysis && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
              <h2 style={{ color: "var(--primary)" }} className="mb-6">
                새 분석 시작
              </h2>
              <p className="text-gray-600 mb-6">
                분석할 웹사이트의 URL을 입력하세요. 24시간 이내에 완성된
                리포트를 받아보실 수 있습니다.
              </p>

              <div className="mb-6">
                <label
                  className="block font-semibold mb-2"
                  style={{ color: "var(--primary)" }}
                >
                  웹사이트 URL
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewAnalysis(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleStartAnalysis}
                  disabled={!newUrl}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ background: "var(--accent)" }}
                >
                  분석 시작
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 section-spacing">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="card-base card-padding hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: stat.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div
                    className="text-base lg:text-lg font-semibold px-2 lg:px-3 py-1 rounded-full whitespace-nowrap"
                    style={{
                      background: "var(--success)15",
                      color: "var(--success)",
                    }}
                  >
                    {stat.change}
                  </div>
                </div>
                <div
                  className="text-2xl lg:text-3xl font-bold mb-1"
                  style={{ color: "var(--primary)" }}
                >
                  {stat.value}
                </div>
                <div className="text-base text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 section-spacing">
          {/* Monthly Analysis Trend */}
          <div className="card-base card-padding">
            <h3
              className="text-lg lg:text-xl font-bold mb-6"
              style={{ color: "var(--primary)" }}
            >
              월별 분석 추이
            </h3>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <LineChart data={monthlyAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    dot={{ fill: "var(--accent)", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="card-base card-padding">
            <h3
              className="text-lg lg:text-xl font-bold mb-6"
              style={{ color: "var(--primary)" }}
            >
              플랜별 회원 분포
            </h3>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-6 mt-4">
              {planDistribution.map((plan, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ background: plan.color }}
                  />
                  <span className="text-base lg:text-lg text-gray-600 whitespace-nowrap">
                    {plan.name}: {plan.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 section-spacing">
          {/* Device Statistics */}
          <div className="card-base card-padding">
            <h3
              className="text-lg lg:text-xl font-bold mb-6"
              style={{ color: "var(--primary)" }}
            >
              디바이스별 방문
            </h3>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <BarChart data={deviceStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="device"
                    stroke="#6B7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="visits"
                    fill="var(--secondary)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Scores */}
          <div className="card-base card-padding">
            <h3
              className="text-lg lg:text-xl font-bold mb-6"
              style={{ color: "var(--primary)" }}
            >
              카테고리별 평균 점수
            </h3>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <RadarChart data={categoryScores}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="category"
                    stroke="#6B7280"
                    tick={{ fontSize: 11 }}
                  />
                  <PolarRadiusAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                  <Radar
                    name="점수"
                    dataKey="score"
                    stroke="var(--accent)"
                    fill="var(--accent)"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Recent Activities */}
          <div className="card-base card-padding">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg lg:text-xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                최근 활동
              </h3>
              <Activity
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div className="space-y-3 lg:space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white text-base lg:text-base flex-shrink-0"
                    style={{ background: "var(--primary)" }}
                  >
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-semibold text-base lg:text-base truncate"
                      style={{ color: "var(--primary)" }}
                    >
                      {activity.user}
                    </div>
                    <div className="text-base lg:text-lg text-gray-600">
                      {activity.action}
                    </div>
                    {activity.project !== "-" && (
                      <div className="text-sm text-gray-500 mt-1 truncate">
                        {activity.project}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex-shrink-0 whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Projects */}
          <div className="card-base card-padding">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg lg:text-xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                최근 프로젝트
              </h3>
              <FolderKanban
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div className="space-y-3">
              {topProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4 p-4 rounded-lg border-2 border-gray-100 hover:border-[var(--secondary)] transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      project.grade === "A"
                        ? "bg-green-500"
                        : project.grade === "B"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {project.grade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-semibold text-base lg:text-base truncate"
                      style={{ color: "var(--primary)" }}
                    >
                      {project.name}
                    </div>
                    <div className="text-base lg:text-lg text-gray-600">
                      점수: {project.score}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (project.id) {
                          navigate(`/customer/report/${project.id}`);
                        } else {
                          alert("프로젝트 ID가 없습니다.");
                        }
                      }}
                      className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-base lg:text-lg font-semibold text-white hover:opacity-90 transition-all whitespace-nowrap"
                      style={{ background: "#EE6C4D" }}
                    >
                      <FileText className="w-4 h-4" />
                      리포트 보기
                    </button>
                    <div
                      className={`text-sm px-2 lg:px-3 py-1 rounded-full whitespace-nowrap ${
                        project.status === "완료"
                          ? "bg-green-100 text-green-700"
                          : project.status === "검수 중"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {project.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
