export type ImprovementPriority = "critical" | "high" | "medium" | "low";
export type ImprovementStatus = "pass" | "fail" | "warning";

export interface Improvement {
  id: string;
  category: string;
  title: string;
  currentState: string;
  targetState: string;
  priority: ImprovementPriority;
  impact: string;
  effort: string;
  status: ImprovementStatus;
  impactOnRetention: string;
  impactOnBounceRate: string;
}

export interface EvaluationSubcriteria {
  name: string;
  score: number;
  description: string;
  benchmark: string;
}

export interface EvaluationCriteria {
  category: string;
  score: number;
  weight: number;
  description: string;
  methodology: string;
  subcriteria: EvaluationSubcriteria[];
}

export interface ReportMetrics {
  bounceRate: string;
  avgSessionTime: string;
  pagesPerSession: string;
  mobileBounceRate?: string;
  conversionRate: string;
}

export interface ReportSummary {
  url: string;
  analyzedAt: string;
  analyst: string;
  grade: string;
  totalScore: number;
  status: string;
  currentMetrics: ReportMetrics & { mobileBounceRate: string };
  industryBenchmark: ReportMetrics;
  targetMetrics: ReportMetrics;
}

export interface GuidelinePromptContext {
  report: ReportSummary;
  totalScore: number;
  evaluationCriteria: EvaluationCriteria[];
  improvements: Improvement[];
}
