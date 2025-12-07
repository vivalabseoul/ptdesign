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

const getMockProjects = (): AnalysisProject[] => {
  try {
    const raw = localStorage.getItem(MOCK_PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
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
