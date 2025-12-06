import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { FolderKanban, Search, Filter, Globe, User, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Project {
  id: string;
  url: string;
  customer: string;
  expert: string;
  status: "pending" | "analyzing" | "reviewing" | "completed";
  score: number | null;
  grade: string | null;
  createdAt: string;
  deadline: string;
  priority: "high" | "medium" | "low";
}

export function ProjectManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState<"list" | "kanban">("kanban");

  const projects: Project[] = [
    {
      id: "1",
      url: "example.com",
      customer: "김철수",
      expert: "김지민",
      status: "completed",
      score: 92,
      grade: "A",
      createdAt: "2024-11-15",
      deadline: "2024-11-20",
      priority: "high"
    },
    {
      id: "2",
      url: "company.co.kr",
      customer: "이영희",
      expert: "박서준",
      status: "reviewing",
      score: 88,
      grade: "A",
      createdAt: "2024-11-18",
      deadline: "2024-11-23",
      priority: "high"
    },
    {
      id: "3",
      url: "startup.io",
      customer: "박민수",
      expert: "이수아",
      status: "analyzing",
      score: null,
      grade: null,
      createdAt: "2024-11-20",
      deadline: "2024-11-25",
      priority: "medium"
    },
    {
      id: "4",
      url: "shop.com",
      customer: "정수진",
      expert: "정현우",
      status: "pending",
      score: null,
      grade: null,
      createdAt: "2024-11-21",
      deadline: "2024-11-26",
      priority: "low"
    },
    {
      id: "5",
      url: "agency.net",
      customer: "최동욱",
      expert: "김지민",
      status: "completed",
      score: 85,
      grade: "A",
      createdAt: "2024-11-10",
      deadline: "2024-11-15",
      priority: "medium"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "대기 중", color: "#6B7280", icon: Clock };
      case "analyzing":
        return { label: "분석 중", color: "var(--warning)", icon: AlertCircle };
      case "reviewing":
        return { label: "검수 중", color: "var(--secondary)", icon: AlertCircle };
      case "completed":
        return { label: "완료", color: "var(--success)", icon: CheckCircle };
      default:
        return { label: status, color: "gray", icon: Clock };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "var(--accent)";
      case "medium": return "var(--warning)";
      case "low": return "var(--secondary)";
      default: return "gray";
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.expert.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const projectsByStatus = {
    pending: filteredProjects.filter(p => p.status === "pending"),
    analyzing: filteredProjects.filter(p => p.status === "analyzing"),
    reviewing: filteredProjects.filter(p => p.status === "reviewing"),
    completed: filteredProjects.filter(p => p.status === "completed")
  };

  const stats = [
    { label: "전체 프로젝트", value: projects.length, color: "var(--primary)" },
    { label: "대기 중", value: projectsByStatus.pending.length, color: "#6B7280" },
    { label: "진행 중", value: projectsByStatus.analyzing.length + projectsByStatus.reviewing.length, color: "var(--warning)" },
    { label: "완료", value: projectsByStatus.completed.length, color: "var(--success)" }
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
                <FolderKanban className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h1 style={{ color: 'var(--primary)' }}>프로젝트 관리</h1>
                <p className="text-gray-600">모든 분석 프로젝트의 진행 현황을 관리합니다</p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setView("kanban")}
                className={`px-4 py-2 rounded-lg text-base font-semibold transition-all ${
                  view === "kanban" ? "text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
                style={view === "kanban" ? { background: 'var(--accent)' } : {}}
              >
                칸반 보드
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 rounded-lg text-base font-semibold transition-all ${
                  view === "list" ? "text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
                style={view === "list" ? { background: 'var(--accent)' } : {}}
              >
                목록
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="URL, 고객명, 전문가명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none appearance-none"
              >
                <option value="all">모든 상태</option>
                <option value="pending">대기 중</option>
                <option value="analyzing">분석 중</option>
                <option value="reviewing">검수 중</option>
                <option value="completed">완료</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {view === "kanban" && (
          <div className="grid md:grid-cols-4 gap-6">
            {Object.entries(projectsByStatus).map(([status, projects]) => {
              const statusInfo = getStatusInfo(status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={status} className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <StatusIcon className="w-5 h-5" style={{ color: statusInfo.color }} />
                    <h3 className="font-semibold" style={{ color: 'var(--primary)' }}>
                      {statusInfo.label}
                    </h3>
                    <span className="ml-auto text-base font-semibold px-2 py-1 rounded-full bg-white">
                      {projects.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-base" style={{ color: 'var(--primary)' }}>
                              {project.url}
                            </span>
                          </div>
                          {project.grade && (
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-base"
                              style={{ background: getGradeColor(project.grade) }}
                            >
                              {project.grade}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>고객: {project.customer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>전문가: {project.expert}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>마감: {project.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: getPriorityColor(project.priority) }}
                          />
                          {project.score !== null && (
                            <span className="text-base font-bold" style={{ color: 'var(--accent)' }}>
                              {project.score}점
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>URL</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>고객</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>전문가</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>상태</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>점수/등급</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>마감일</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>우선순위</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const statusInfo = getStatusInfo(project.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                            {project.url}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{project.customer}</td>
                      <td className="px-6 py-4 text-gray-600">{project.expert}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" style={{ color: statusInfo.color }} />
                          <span className="text-base font-semibold" style={{ color: statusInfo.color }}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {project.score !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: 'var(--accent)' }}>
                              {project.score}점
                            </span>
                            <span
                              className="px-2 py-1 rounded text-white text-base font-bold"
                              style={{ background: getGradeColor(project.grade) }}
                            >
                              {project.grade}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-600">{project.deadline}</td>
                      <td className="px-6 py-4">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: getPriorityColor(project.priority) }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
