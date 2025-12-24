import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { analyzeWebsite } from "../../lib/gemini";
import { Plus, Search, BarChart3, Clock, CheckCircle, TrendingUp, Trash2, ExternalLink, CreditCard, Crown, Calendar, Zap } from "lucide-react";
import {
  getUserAnalyses,
  createAnalysis,
  AnalysisProject,
  saveAnalysisReport,
  updateProjectStatus,
  getAnalysisReport,
  deleteAnalysis,
} from "../../lib/api/analysis";
import { DashboardLayout } from "../../components/DashboardLayout";
import { AnalysisLoading } from "../../components/AnalysisLoading";

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
  const [completedProjectId, setCompletedProjectId] = useState<string | null>(null);
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
        
        // 실제 분석 시작 (URL 직접 전달)
        performAnalysis(pendingUrl);
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

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // URL 유효성 검사 함수
  const isValidUrl = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const handleStartAnalysis = async () => {
    if (newUrl && user) {
      // URL 유효성 검사
      if (!isValidUrl(newUrl)) {
        setUrlError('URL은 http:// 또는 https://로 시작해야 합니다.');
        return;
      }
      setUrlError(null);

      // 결제 내역이 없는 고객인 경우 플랜 업그레이드 안내
      if (user.subscription_status !== 'active') {
        setShowUpgradePrompt(true);
        return;
      }

      setShowNewAnalysis(false);
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      
      // 분석 시작
      performAnalysis();
    }
  };

  const performAnalysis = async (urlToAnalyze?: string) => {
    if (!user) return;

    // URL 파라미터가 있으면 사용, 없으면 state의 newUrl 사용
    const targetUrl = urlToAnalyze || newUrl;

    try {
      console.log("Starting analysis for URL:", targetUrl);

      // 1. 프로젝트 생성
      const project = await createAnalysis(user.id, targetUrl);
      console.log("Project created:", project.id);

      // 2. OpenAI 분석 수행
      const reportData = await analyzeWebsite(targetUrl);
      console.log("Analysis completed, report data:", reportData);

      // 3. 결과 저장
      await saveAnalysisReport(project.id, reportData);
      console.log("Report saved successfully");

      // 4. 완료 처리
      await updateProjectStatus(project.id, 'completed');
      console.log("Project status updated to completed");

      // 5. 완료 상태 업데이트 및 프로젝트 ID 저장
      setCompletedProjectId(project.id);
      setAnalysisComplete(true);
      console.log("Analysis complete, will navigate to:", `/customer/report/${project.id}`);
    } catch (error: any) {
      console.error("분석 요청 실패:", error);
      setError(error.message || "알 수 없는 오류가 발생했습니다.");
      setIsAnalyzing(false);
      setAnalysisComplete(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if (!confirm("정말 이 분석 내역을 삭제하시겠습니까?")) return;

    try {
      await deleteAnalysis(projectId);
      setAnalyses(analyses.filter((a) => a.id !== projectId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleLoadingComplete = () => {
    // AnalysisLoading에서 애니메이션이 끝난 후 호출됨
    setTimeout(() => {
      setNewUrl("");
      setIsAnalyzing(false);
      setAnalysisComplete(false);
      
      // 분석 완료 후 상세 리포트 페이지로 자동 이동
      if (completedProjectId) {
        navigate(`/customer/report/${completedProjectId}`);
        setCompletedProjectId(null);
      } else {
        // 프로젝트 ID가 없는 경우 목록만 새로고침
        loadAnalyses();
      }
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

        {/* Subscription Status */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg mb-8 overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
                  <Crown className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>구독 현황</h3>
                  <p className="text-sm text-gray-600">현재 플랜 및 사용 현황</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                플랜 업그레이드
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Current Plan */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--secondary)15' }}>
                    <Zap className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">현재 플랜</p>
                    <p className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
                      {user?.subscription_plan === 'guest' ? 'Free' : user?.subscription_plan === 'basic' ? '베이직' : user?.subscription_plan === 'pro' ? '프로' : '엔터프라이즈'}
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                    {user?.subscription_plan === 'guest' ? '₩0' : user?.subscription_plan === 'basic' ? '₩99K' : user?.subscription_plan === 'pro' ? '₩299K' : '협의'}
                  </span>
                  {user?.subscription_plan !== 'guest' && user?.subscription_plan !== 'enterprise' && (
                    <span className="text-sm text-gray-600">/건</span>
                  )}
                </div>
              </div>

              {/* Subscription Status */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--success)15' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">구독 상태</p>
                    <p className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
                      {user?.subscription_status === 'active' ? '활성' : user?.subscription_status === 'cancelled' ? '취소됨' : '비활성'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user?.subscription_status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {user?.subscription_status === 'active' ? '정상 운영 중' : '구독 필요'}
                  </span>
                </div>
              </div>

              {/* Next Payment */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning)15' }}>
                    <Calendar className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">다음 결제일</p>
                    <p className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
                      {user?.subscription_plan === 'guest' ? '-' : '건당 결제'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/customer/payment-history')}
                  className="text-sm font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  <CreditCard className="w-4 h-4" />
                  결제 내역 보기
                </button>
              </div>
            </div>
          </div>
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
                    onChange={(e) => {
                      setNewUrl(e.target.value);
                      setUrlError(null);
                    }}
                    placeholder="https://example.com"
                    className={`w-full pl-12 pr-4 py-4 rounded-lg border-2 outline-none transition-colors ${
                      urlError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[var(--accent)]'
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  ⚠️ URL은 반드시 <strong>http://</strong> 또는 <strong>https://</strong>로 시작해야 합니다.
                </p>
                {urlError && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {urlError}
                  </p>
                )}
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

        {/* Upgrade Plan Modal */}
        {showUpgradePrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent)15' }}>
                <Crown className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>
              <h2 style={{ color: 'var(--primary)' }} className="mb-4">
                플랜 업그레이드가 필요합니다
              </h2>
              <p className="text-gray-600 mb-6">
                분석 서비스를 이용하려면 플랜을 구매하셔야 합니다.<br />
                다양한 요금제를 확인하고 최적의 플랜을 선택하세요.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowUpgradePrompt(false);
                    setShowNewAnalysis(false);
                    navigate('/pricing');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
                  style={{ background: 'var(--accent)' }}
                >
                  요금제 보기
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

                    <div className="flex items-center gap-3">
                      {analysis.status === "completed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/customer/report/${analysis.id}`);
                          }}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          상세보기
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteProject(e, analysis.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="분석 내역 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
