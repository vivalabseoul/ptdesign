import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { ClipboardCheck, Clock, CheckCircle, AlertCircle, User, Calendar, Eye, FileText } from "lucide-react";

interface Assignment {
  id: string;
  url: string;
  customer: string;
  status: "pending" | "reviewing" | "completed";
  assignedAt: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  aiScore: number | null;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return { label: "검수 대기", color: "var(--warning)", icon: Clock };
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

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "high": return "높음";
    case "medium": return "중간";
    case "low": return "낮음";
    default: return priority;
  }
};

const isAssignmentUrgent = (deadline: string) => {
  const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return days <= 2;
};

export function ExpertDashboard() {
  const navigate = useNavigate();

  const assignments: Assignment[] = [
    {
      id: "1",
      url: "company.co.kr",
      customer: "이영희",
      status: "reviewing",
      assignedAt: "2024-11-18",
      deadline: "2024-11-23",
      priority: "high",
      aiScore: 88
    },
    {
      id: "2",
      url: "startup.io",
      customer: "박민수",
      status: "pending",
      assignedAt: "2024-11-20",
      deadline: "2024-11-25",
      priority: "medium",
      aiScore: 75
    },
    {
      id: "3",
      url: "example.com",
      customer: "김철수",
      status: "completed",
      assignedAt: "2024-11-15",
      deadline: "2024-11-20",
      priority: "high",
      aiScore: 92
    },
    {
      id: "4",
      url: "shop.com",
      customer: "정수진",
      status: "pending",
      assignedAt: "2024-11-21",
      deadline: "2024-11-26",
      priority: "low",
      aiScore: 68
    }
  ];

  const stats = [
    {
      label: "배정된 작업",
      value: assignments.filter(a => a.status !== "completed").length,
      icon: ClipboardCheck,
      color: "var(--accent)"
    },
    {
      label: "검수 대기",
      value: assignments.filter(a => a.status === "pending").length,
      icon: Clock,
      color: "var(--warning)"
    },
    {
      label: "검수 중",
      value: assignments.filter(a => a.status === "reviewing").length,
      icon: AlertCircle,
      color: "var(--secondary)"
    },
    {
      label: "완료",
      value: assignments.filter(a => a.status === "completed").length,
      icon: CheckCircle,
      color: "var(--success)"
    }
  ];

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="section-spacing">
          <h1 className="text-2xl lg:text-3xl font-bold leading-tight" style={{ color: 'var(--primary)' }}>전문가 대시보드</h1>
          <p className="text-gray-600 mt-2 text-base sm:text-base leading-relaxed">배정된 분석을 검수하고 AI 지침서를 최종 검토하세요</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 section-spacing">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card-base card-padding hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${stat.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: 'var(--primary)' }}>
                  {stat.value}
                </div>
                <div className="text-base text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Assignments by Status */}
        <div className="space-y-6 lg:space-y-8">
          {/* Urgent - High Priority Pending */}
          {assignments.filter(a => a.status === "pending" && isAssignmentUrgent(a.deadline)).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <h3 className="text-lg lg:text-xl font-bold" style={{ color: 'var(--accent)' }}>긴급 검수 필요</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {assignments
                  .filter(a => a.status === "pending" && isAssignmentUrgent(a.deadline))
                  .map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} onView={() => navigate(`/expert/review/${assignment.id}`)} />
                  ))}
              </div>
            </div>
          )}

          {/* In Review */}
          {assignments.filter(a => a.status === "reviewing").length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                <h3 className="text-lg lg:text-xl font-bold" style={{ color: 'var(--primary)' }}>검수 중인 작업</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {assignments
                  .filter(a => a.status === "reviewing")
                  .map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} onView={() => navigate(`/expert/review/${assignment.id}`)} />
                  ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {assignments.filter(a => a.status === "pending" && !isAssignmentUrgent(a.deadline)).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--warning)' }} />
                <h3 className="text-lg lg:text-xl font-bold" style={{ color: 'var(--primary)' }}>검수 대기 중</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {assignments
                  .filter(a => a.status === "pending" && !isAssignmentUrgent(a.deadline))
                  .map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} onView={() => navigate(`/expert/review/${assignment.id}`)} />
                  ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {assignments.filter(a => a.status === "completed").length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                <h3 className="text-lg lg:text-xl font-bold" style={{ color: 'var(--primary)' }}>완료된 작업</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {assignments
                  .filter(a => a.status === "completed")
                  .map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} onView={() => navigate(`/expert/review/${assignment.id}`)} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function AssignmentCard({ assignment, onView }: { assignment: Assignment; onView: () => void }) {
  const navigate = useNavigate();
  const statusInfo = getStatusInfo(assignment.status);
  const priorityColor = getPriorityColor(assignment.priority);
  const priorityLabel = getPriorityLabel(assignment.priority);

  return (
    <div className="card-base card-padding hover:shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h4 className="text-base lg:text-lg font-bold truncate" style={{ color: 'var(--primary)' }}>{assignment.url}</h4>
            <span
              className="px-2 lg:px-3 py-1 rounded-full text-base lg:text-lg font-semibold whitespace-nowrap flex-shrink-0"
              style={{ background: `${statusInfo.color}15`, color: statusInfo.color }}
            >
              {statusInfo.label}
            </span>
            {isAssignmentUrgent(assignment.deadline) && (
              <span className="px-2 lg:px-3 py-1 rounded-full text-base lg:text-lg font-semibold bg-red-100 text-red-700 whitespace-nowrap flex-shrink-0">
                긴급
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 text-base lg:text-lg text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">고객: {assignment.customer}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">마감: {assignment.deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: priorityColor }} />
              <span className="truncate">우선순위: {priorityLabel}</span>
            </div>
          </div>
        </div>

        {assignment.aiScore !== null && (
          <div className="text-center lg:text-right flex-shrink-0">
            <div className="text-base lg:text-lg text-gray-500 mb-1">AI 점수</div>
            <div className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {assignment.aiScore}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
        <div className="text-base lg:text-lg text-gray-500">
          배정일: {assignment.assignedAt}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-base font-semibold transition-all hover:opacity-90 whitespace-nowrap"
            style={{ background: '#EE6C4D' }}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/customer/analysis-report');
            }}
          >
            <FileText className="w-4 h-4" />
            리포트 보기
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-base font-semibold transition-all hover:shadow-lg whitespace-nowrap"
            style={{ background: 'var(--accent)' }}
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            <Eye className="w-4 h-4" />
            검수하기
          </button>
        </div>
      </div>
    </div>
  );
}