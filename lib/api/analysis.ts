// TODO: 데이터베이스 연동 필요
import type { EvaluationCriteria, Improvement, ReportMetrics } from "../../pages/customer/report/types";

export interface AnalysisProject {
  id: string;
  user_id: string;
  url: string;
  status: "pending" | "analyzing" | "completed" | "reviewed";
  created_at: string;
  updated_at: string;
}

export interface ReportData {
  totalScore: number;
  evaluationCriteria: EvaluationCriteria[];
  improvements: Improvement[];
  currentMetrics: ReportMetrics & { mobileBounceRate: string };
  industryBenchmark: ReportMetrics;
  targetMetrics: ReportMetrics;
}

// localStorage 기반 스토리지 (서버 재시작 시에도 데이터 유지)
const STORAGE_KEY_PROJECTS = 'analysis_projects';
const STORAGE_KEY_REPORTS = 'analysis_reports';

// localStorage에서 데이터 로드
const loadProjects = (): AnalysisProject[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveProjects = (projects: AnalysisProject[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects:', e);
  }
};

const loadReports = (): Map<string, { project_id: string; report_data: ReportData }> => {
  if (typeof window === 'undefined') return new Map();
  try {
    const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (stored) {
      const obj = JSON.parse(stored);
      return new Map(Object.entries(obj));
    }
  } catch {
    return new Map();
  }
  return new Map();
};

const saveReports = (reports: Map<string, { project_id: string; report_data: ReportData }>) => {
  if (typeof window === 'undefined') return;
  try {
    const obj = Object.fromEntries(reports);
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(obj));
  } catch (e) {
    console.error('Failed to save reports:', e);
  }
};

let mockProjects: AnalysisProject[] = loadProjects();
let mockReports: Map<string, { project_id: string; report_data: ReportData }> = loadReports();

export async function createAnalysis(userId: string, url: string) {
  const project: AnalysisProject = {
    id: `project_${Date.now()}`,
    user_id: userId,
    url,
    status: "analyzing",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockProjects.push(project);
  saveProjects(mockProjects);
  return project;
}

export async function updateProjectStatus(
  projectId: string,
  status: AnalysisProject["status"]
) {
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  project.status = status;
  project.updated_at = new Date().toISOString();
  saveProjects(mockProjects);
  return project;
}

export async function saveAnalysisReport(projectId: string, reportData: ReportData) {
  const report = { project_id: projectId, report_data: reportData };
  mockReports.set(projectId, report);
  saveReports(mockReports);
  return report;
}

export async function getAnalysisReport(projectId: string): Promise<{ project_id: string; report_data: ReportData } | null> {
  // TODO: 데이터베이스에서 조회
  return mockReports.get(projectId) || null;
}

export async function getUserAnalyses(userId: string) {
  return mockProjects.filter(p => p.user_id === userId);
}

export async function getAllAnalyses() {
  return mockProjects.slice(0, 20);
}

export async function getAnalysisById(analysisId: string) {
  const project = mockProjects.find(p => p.id === analysisId);
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
}

export async function deleteAnalysis(projectId: string) {
  const index = mockProjects.findIndex(p => p.id === projectId);
  if (index > -1) {
    mockProjects.splice(index, 1);
    saveProjects(mockProjects);
  }
  // 리포트도 함께 삭제
  if (mockReports.has(projectId)) {
    mockReports.delete(projectId);
    saveReports(mockReports);
  }
}
