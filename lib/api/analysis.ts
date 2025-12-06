import { supabase } from "../supabase";

export interface AnalysisProject {
  id: string;
  user_id: string;
  url: string;
  status: "pending" | "analyzing" | "completed" | "reviewed";
  created_at: string;
  updated_at: string;
}

const MOCK_PROJECTS_KEY = "protouchdesign:mockProjects";
const MOCK_REPORTS_KEY = "protouchdesign:mockReports";

export const SAMPLE_PROJECT_ID = "mock-sample-naver";
const SAMPLE_PROJECT: AnalysisProject = {
  id: SAMPLE_PROJECT_ID,
  user_id: "mock-test-account",
  url: "https://www.naver.com",
  status: "completed",
  created_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
  updated_at: new Date(Date.now() - 86000000).toISOString(),
};

export const SAMPLE_REPORT_DATA = {
  totalScore: 61,
  evaluationCriteria: [
    {
      category: "첫인상",
      score: 95,
      weight: 20,
      description: "매우 전문적이고 신뢰감 있는 디자인입니다.",
      methodology: "Heuristic Evaluation",
      subcriteria: [],
    },
    {
      category: "이탈 방지",
      score: 45,
      weight: 20,
      description: "로딩 속도가 느리고 이탈률이 높을 것으로 예상됩니다.",
      methodology: "Performance Audit",
      subcriteria: [],
    },
    {
      category: "모바일 경험",
      score: 88,
      weight: 20,
      description: "반응형 디자인이 잘 구현되어 있습니다.",
      methodology: "Mobile Responsiveness Test",
      subcriteria: [],
    },
    {
      category: "체류 유도",
      score: 60,
      weight: 15,
      description: "콘텐츠 배치가 다소 산만하여 집중도가 떨어집니다.",
      methodology: "Engagement Analysis",
      subcriteria: [],
    },
    {
      category: "접근성",
      score: 3,
      weight: 15,
      description: "웹 접근성 표준 준수가 매우 미흡합니다.",
      methodology: "WCAG 2.1 Check",
      subcriteria: [],
    },
    {
      category: "SEO",
      score: 55,
      weight: 10,
      description: "주요 메타 태그가 누락되어 검색 노출에 불리합니다.",
      methodology: "SEO Audit",
      subcriteria: [],
    },
  ],
  improvements: [
    {
      id: "imp-1",
      category: "이탈 방지",
      title: "이미지 최적화 (긴급)",
      priority: "critical",
      currentState: "5MB 이상 이미지 다수",
      targetState: "WebP 변환 및 압축",
      impact: "로딩 3초 단축",
      effort: "Easy",
      status: "fail",
      impactOnRetention: "High",
      impactOnBounceRate: "Critical",
    },
    {
      id: "imp-2",
      category: "이탈 방지",
      title: "LCP 개선",
      priority: "critical",
      currentState: "LCP 4.5초",
      targetState: "2.5초 이내",
      impact: "이탈률 20% 감소",
      effort: "Hard",
      status: "fail",
      impactOnRetention: "High",
      impactOnBounceRate: "High",
    },
    {
      id: "imp-3",
      category: "SEO",
      title: "메타 설명 추가",
      priority: "critical",
      currentState: "누락됨",
      targetState: "고유 설명 추가",
      impact: "CTR 15% 증가",
      effort: "Easy",
      status: "warning",
      impactOnRetention: "Low",
      impactOnBounceRate: "Low",
    },
    {
      id: "imp-4",
      category: "SEO",
      title: "H1 태그 구조화",
      priority: "medium",
      currentState: "중복 사용",
      targetState: "페이지당 1개 사용",
      impact: "검색 순위 상승",
      effort: "Easy",
      status: "warning",
      impactOnRetention: "Low",
      impactOnBounceRate: "Low",
    },
    {
      id: "imp-5",
      category: "체류 유도",
      title: "관련 콘텐츠 추천",
      priority: "medium",
      currentState: "없음",
      targetState: "하단 추천 영역 추가",
      impact: "세션 시간 증가",
      effort: "Medium",
      status: "warning",
      impactOnRetention: "Medium",
      impactOnBounceRate: "Medium",
    },
    {
      id: "imp-6",
      category: "체류 유도",
      title: "가독성 개선",
      priority: "medium",
      currentState: "폰트 크기 작음",
      targetState: "16px 이상으로 확대",
      impact: "읽기 편함",
      effort: "Easy",
      status: "pass",
      impactOnRetention: "Low",
      impactOnBounceRate: "Low",
    },
    {
      id: "imp-7",
      category: "첫인상",
      title: "히어로 섹션 영상 교체",
      priority: "high",
      currentState: "저화질 영상",
      targetState: "고화질 경량 영상",
      impact: "브랜드 가치 상승",
      effort: "Medium",
      status: "pass",
      impactOnRetention: "Medium",
      impactOnBounceRate: "Low",
    },
    {
      id: "imp-8",
      category: "모바일 경험",
      title: "햄버거 메뉴 애니메이션",
      priority: "low",
      currentState: "뚝뚝 끊김",
      targetState: "부드러운 전환",
      impact: "UX 향상",
      effort: "Hard",
      status: "pass",
      impactOnRetention: "Low",
      impactOnBounceRate: "Low",
    },
  ],
  currentMetrics: {
    bounceRate: "65%",
    avgSessionTime: "1m 20s",
    pagesPerSession: "2.5",
    conversionRate: "0.8%",
    mobileBounceRate: "70%",
  },
  industryBenchmark: {
    bounceRate: "40%",
    avgSessionTime: "3m 00s",
    pagesPerSession: "4.0",
    conversionRate: "2.0%",
  },
  targetMetrics: {
    bounceRate: "35%",
    avgSessionTime: "4m 00s",
    pagesPerSession: "5.0",
    conversionRate: "2.5%",
  },
};

const getMockProjects = (): AnalysisProject[] => {
  try {
    const raw = localStorage.getItem(MOCK_PROJECTS_KEY);
    let projects = raw ? JSON.parse(raw) : [];

    // 샘플 프로젝트가 없으면 추가
    if (!projects.find((p: AnalysisProject) => p.id === SAMPLE_PROJECT_ID)) {
      projects.push(SAMPLE_PROJECT);
      localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(projects));
    }

    // 샘플 리포트 데이터는 항상 최신으로 덮어쓰기 (수정 사항 반영을 위해)
    const reportsRaw = localStorage.getItem(MOCK_REPORTS_KEY);
    const reports = reportsRaw ? JSON.parse(reportsRaw) : {};
    reports[SAMPLE_PROJECT_ID] = SAMPLE_REPORT_DATA;
    localStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify(reports));

    return projects;
  } catch {
    return [];
  }
};

const saveMockProject = (project: AnalysisProject) => {
  const projects = getMockProjects();
  projects.unshift(project);
  localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(projects));
};

const updateMockProject = (
  projectId: string,
  status: AnalysisProject["status"]
) => {
  const projects = getMockProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.status = status;
    project.updated_at = new Date().toISOString();
    localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(projects));
    return project;
  }
  throw new Error("Mock project not found");
};

const saveMockReport = (projectId: string, reportData: any) => {
  try {
    const raw = localStorage.getItem(MOCK_REPORTS_KEY);
    const reports = raw ? JSON.parse(raw) : {};
    reports[projectId] = reportData;
    localStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify(reports));
    return { project_id: projectId, report_data: reportData };
  } catch {
    return null;
  }
};

const getMockReport = (projectId: string) => {
  try {
    const raw = localStorage.getItem(MOCK_REPORTS_KEY);
    const reports = raw ? JSON.parse(raw) : {};

    // 샘플 데이터는 항상 최신 상수로 덮어쓰기 (실시간 수정 반영을 위해)
    if (projectId === SAMPLE_PROJECT_ID) {
      reports[projectId] = SAMPLE_REPORT_DATA;
      localStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify(reports));
    }

    return reports[projectId]
      ? { project_id: projectId, report_data: reports[projectId] }
      : null;
  } catch {
    return null;
  }
};

export async function createAnalysis(userId: string, url: string) {
  if (userId.startsWith("mock-")) {
    const project: AnalysisProject = {
      id: `mock-proj-${Date.now()}`,
      user_id: userId,
      url,
      status: "analyzing",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveMockProject(project);
    return project;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      url: url,
      status: "analyzing",
    })
    .select()
    .single();

  if (error) throw error;
  return data as AnalysisProject;
}

export async function updateProjectStatus(
  projectId: string,
  status: AnalysisProject["status"]
) {
  if (projectId.startsWith("mock-")) {
    return updateMockProject(projectId, status);
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return data as AnalysisProject;
}

export async function saveAnalysisReport(projectId: string, reportData: any) {
  if (projectId.startsWith("mock-")) {
    return saveMockReport(projectId, reportData);
  }

  const { data, error } = await supabase
    .from("analysis_reports")
    .insert({
      project_id: projectId,
      report_data: reportData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAnalysisReport(projectId: string) {
  if (projectId.startsWith("mock-")) {
    return getMockReport(projectId);
  }

  const { data, error } = await supabase
    .from("analysis_reports")
    .select("*")
    .eq("project_id", projectId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getUserAnalyses(userId: string) {
  if (userId.startsWith("mock-")) {
    return getMockProjects().filter((p) => p.user_id === userId);
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as AnalysisProject[];
}

export async function getAllAnalyses() {
  // Mock 데이터인 경우 로컬 스토리지의 모든 프로젝트 반환
  if (localStorage.getItem(MOCK_PROJECTS_KEY)) {
    return getMockProjects();
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20); // 최근 20개만 가져옴

  if (error) throw error;
  return data as AnalysisProject[];
}

export async function getAnalysisById(analysisId: string) {
  if (analysisId.startsWith("mock-")) {
    const project = getMockProjects().find((p) => p.id === analysisId);
    if (!project) throw new Error("Project not found");
    return project;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", analysisId)
    .single();

  if (error) throw error;
  return data as AnalysisProject;
}

const deleteMockProject = (projectId: string) => {
  try {
    const projects = getMockProjects();
    const filtered = projects.filter((p) => p.id !== projectId);
    localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
};

export async function deleteAnalysis(projectId: string) {
  if (projectId.startsWith("mock-")) {
    await deleteMockProject(projectId);
    return;
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}
