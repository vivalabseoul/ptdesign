import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { analyzeWebsite } from "../../lib/openai";
import { createAnalysis, getUserAnalyses, AnalysisProject, saveAnalysisReport, updateProjectStatus, getAnalysisReport } from "../../lib/api/analysis";
import { DashboardLayout } from "../../components/DashboardLayout";
import { AnalysisLoading } from "../../components/AnalysisLoading";
import { Plus, Search, BarChart3, Clock, CheckCircle, TrendingUp } from "lucide-react";

// ... existing interfaces ...



interface Analysis extends AnalysisProject {
  score?: number;
  grade?: string;
  completedAt?: string;
}

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newUrl, setNewUrl] = useState("");
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    if (window.location.pathname === '/customer/history') {
      const historySection = document.getElementById('analysis-history');
      if (historySection) {
        historySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAnalyses();

      // 메인 페이지에서 넘어온 분석 요청이 있는지 확인
      const pendingUrl = sessionStorage.getItem("pending_analysis_url");
      if (pendingUrl) {
        sessionStorage.removeItem("pending_analysis_url");
        setNewUrl(pendingUrl);
        setShowNewAnalysis(false);
        setIsAnalyzing(true);
        setAnalysisComplete(false);
      }
    }
  }, [user]);

  const loadAnalyses = async () => {
    if (!user) return;
    try {
      const data = await getUserAnalyses(user.id);
      
      // 각 프로젝트의 리포트 데이터를 가져와서 점수와 등급 매핑
      const mappedData = await Promise.all(data.map(async (item) => {
        let score = undefined;
        let grade = undefined;
        
        if (item.status === 'completed') {
          try {
            const report = await getAnalysisReport(item.id);
            if (report && report.report_data) {
              score = report.report_data.totalScore;
              // 등급 계산 로직
              if (score !== undefined) {
                if (score >= 90) grade = 'A';
                else if (score >= 70) grade = 'B';
                else if (score >= 50) grade = 'C';
                else grade = 'D';
              }
            }
          } catch (e) {
            console.error(`Failed to load report for ${item.id}`, e);
          }
        }

        return {
          ...item,
          score,
          grade,
          completedAt: item.status === 'completed' ? new Date(item.created_at).toLocaleDateString() : undefined
        };
      }));

      setAnalyses(mappedData);
    } catch (error) {
      console.error("분석 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (newUrl && user) {
      setShowNewAnalysis(false);
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      
      // 분석 시작
      performAnalysis();
    }
  };

  const performAnalysis = async () => {
    if (!user) return;
    
    try {
      // 1. 프로젝트 생성
      const project = await createAnalysis(user.id, newUrl);
      
      // 2. OpenAI 분석 수행
      const reportData = await analyzeWebsite(newUrl);
      
      // 3. 결과 저장
      await saveAnalysisReport(project.id, reportData);
      
      // 4. 완료 처리
      await updateProjectStatus(project.id, 'completed');

      // 5. 완료 상태 업데이트 (AnalysisLoading에 알림)
      setAnalysisComplete(true);

      // 6. 페이지 이동을 위한 데이터 저장 (onComplete에서 사용)
      // navigate는 AnalysisLoading의 onComplete 콜백에서 처리
      return project.id;
    } catch (error: any) {
      console.error("분석 요청 실패:", error);
      setError(error.message || "알 수 없는 오류가 발생했습니다.");
      setIsAnalyzing(false);
      setAnalysisComplete(false);
    }
  };

  const handleLoadingComplete = () => {
    // AnalysisLoading에서 애니메이션이 끝난 후 호출됨
    setTimeout(() => {
      setNewUrl("");
      setIsAnalyzing(false);
      setAnalysisComplete(false);
      loadAnalyses(); // 목록 새로고침
      
      // 가장 최근에 생성된 프로젝트로 이동해야 함
      // 여기서는 목록을 다시 불러와서 가장 최신 항목으로 이동하거나,
      // performAnalysis에서 저장한 ID를 state로 관리해서 이동해야 함.
      // 편의상 목록 재로딩 후 처리
      getUserAnalyses(user!.id).then(projects => {
        if (projects.length > 0) {
           navigate(`/customer/report/${projects[0].id}`);
        }
      });
    }, 500);
  };



  if (isAnalyzing) {
    return <AnalysisLoading onComplete={handleLoadingComplete} isComplete={analysisComplete} />;
  }

  const stats = [
    {
      label: "총 분석 횟수",
      value: analyses.length,
      icon: BarChart3,
      color: "var(--accent)"
    },
    {
      label: "평균 점수",
      value: "61.0",
      icon: TrendingUp,
      color: "var(--success)"
    },
    {
      label: "완료된 분석",
      value: analyses.filter(a => a.status === "completed").length,
      icon: CheckCircle,
      color: "var(--secondary)"
    },
    {
      label: "진행 중",
      value: analyses.filter(a => a.status !== "completed").length,
      icon: Clock,
      color: "var(--warning)"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "대기 중", color: "#6B7280" };
      case "analyzing":
        return { label: "분석 중", color: "var(--warning)" };
      case "completed":
        return { label: "완료", color: "var(--success)" };
      default:
        return { label: status, color: "gray" };
    }
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "gray";
    switch (grade) {
      case "A": return "var(--success)";
      case "B": return "var(--secondary)";
      case "C": return "var(--warning)";
      default: return "var(--accent)";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">오류 발생: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 style={{ color: 'var(--primary)' }} className="leading-tight">대시보드</h1>
              <p className="text-gray-600 mt-2 text-base sm:text-base leading-relaxed">웹사이트 분석 현황을 확인하고 새로운 분석을 시작하세요</p>
            </div>
            <button
              onClick={() => setShowNewAnalysis(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105 text-base sm:text-base whitespace-nowrap"
              style={{ background: 'var(--accent)' }}
            >
              <Plus className="w-5 h-5" />
              새 분석 시작
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${stat.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary)' }}>
                  {stat.value}
                </div>
                <div className="text-base text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* New Analysis Modal */}
        {showNewAnalysis && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
              <h2 style={{ color: 'var(--primary)' }} className="mb-6">
                새 분석 시작
              </h2>
              <p className="text-gray-600 mb-6">
                분석할 웹사이트의 URL을 입력하세요. 24시간 이내에 완성된 리포트를 받아보실 수 있습니다.
              </p>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2" style={{ color: 'var(--primary)' }}>
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
                  style={{ background: 'var(--accent)' }}
                >
                  분석 시작
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis History */}
        <div id="analysis-history" className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 style={{ color: 'var(--primary)' }}>분석 내역</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {analyses.length === 0 && !loading ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                  아직 분석 내역이 없습니다
                </h4>
                <p className="text-gray-600 mb-6">
                  첫 번째 분석을 시작해보세요! AI가 웹사이트를 분석해드립니다.
                </p>
                <button
                  onClick={() => setShowNewAnalysis(true)}
                  className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105"
                  style={{ background: 'var(--accent)' }}
                >
                  분석 시작하기
                </button>
              </div>
            ) : (
              analyses.map((analysis) => {
              const statusInfo = getStatusInfo(analysis.status);
              
              return (
                <div
                  key={analysis.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => analysis.status === "completed" && navigate(`/customer/report/${analysis.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Grade Badge */}
                      {analysis.grade ? (
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                          style={{ background: getGradeColor(analysis.grade) }}
                        >
                          {analysis.grade}
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gray-100">
                          <Clock className="w-8 h-8 text-gray-400 animate-pulse" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 style={{ color: 'var(--primary)' }}>
                            {analysis.url}
                          </h4>
                          <span
                            className="px-3 py-1 rounded-full text-base font-semibold"
                            style={{ background: `${statusInfo.color}15`, color: statusInfo.color }}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-base text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>생성: {new Date(analysis.created_at).toLocaleDateString()}</span>
                          </div>
                          {analysis.completedAt && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>완료: {analysis.completedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      {analysis.score !== null && (
                        <div className="text-right">
                          <div className="text-4xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
                            {analysis.score}
                          </div>
                          <div className="text-base text-gray-600">점</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>

        {/* Plan Upgrade Banner */}
        <div className="mt-8 bg-[var(--accent)] rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white mb-2">더 많은 분석이 필요하신가요?</h3>
              <p className="text-white/90">Professional 플랜으로 업그레이드하고 월 10회 분석을 이용하세요</p>
            </div>
            <button className="px-6 py-3 rounded-xl bg-white font-semibold transition-all hover:shadow-lg hover:scale-105" style={{ color: 'var(--accent)' }}>
              플랜 업그레이드
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
