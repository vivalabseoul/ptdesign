import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Users, Search, Filter, MoreVertical, Mail, Phone, Calendar, Award } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  company: string;
  role: "customer" | "expert" | "admin";
  plan: "Starter" | "Professional" | "Enterprise";
  status: "active" | "inactive" | "trial";
  approvalStatus?: "pending" | "approved" | "rejected";
  joinDate: string;
  analysisCount: number;
  lastActive: string;
}

export function MemberManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const members: Member[] = [
    {
      id: "1",
      name: "김철수",
      email: "kim@example.com",
      company: "Example Corp",
      role: "customer",
      plan: "Professional",
      status: "active",
      approvalStatus: "approved",
      joinDate: "2024-01-15",
      analysisCount: 12,
      lastActive: "2024-11-20"
    },
    {
      id: "2",
      name: "이영희",
      email: "lee@startup.io",
      company: "Startup Inc",
      role: "expert",
      plan: "Enterprise",
      status: "active",
      approvalStatus: "approved",
      joinDate: "2024-03-22",
      analysisCount: 28,
      lastActive: "2024-11-21"
    },
    {
      id: "3",
      name: "박민수",
      email: "park@company.kr",
      company: "Company Ltd",
      role: "customer",
      plan: "Starter",
      status: "trial",
      approvalStatus: "approved",
      joinDate: "2024-11-10",
      analysisCount: 3,
      lastActive: "2024-11-19"
    },
    {
      id: "4",
      name: "정수진",
      email: "jung@agency.net",
      company: "Agency Pro",
      role: "expert",
      plan: "Professional",
      status: "active",
      approvalStatus: "pending",
      joinDate: "2024-02-08",
      analysisCount: 19,
      lastActive: "2024-11-21"
    },
    {
      id: "5",
      name: "최동욱",
      email: "choi@shop.com",
      company: "Shop Online",
      role: "customer",
      plan: "Starter",
      status: "inactive",
      approvalStatus: "approved",
      joinDate: "2024-08-15",
      analysisCount: 5,
      lastActive: "2024-10-30"
    },
    {
      id: "6",
      name: "관리자",
      email: "admin@protouchdesign.com",
      company: "ProTouch Design",
      role: "admin",
      plan: "Enterprise",
      status: "active",
      approvalStatus: "approved",
      joinDate: "2024-01-01",
      analysisCount: 0,
      lastActive: "2024-11-21"
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesPlan = filterPlan === "all" || member.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;

    return matchesSearch && matchesRole && matchesPlan && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "customer": return "#3B82F6"; // Blue
      case "expert": return "#8B5CF6"; // Purple
      case "admin": return "#EF4444"; // Red
      default: return "gray";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "customer": return "고객";
      case "expert": return "전문가";
      case "admin": return "관리자";
      default: return role;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "customer": return "분석 서비스 이용 고객";
      case "expert": return "분석 리포트 작성 전문가";
      case "admin": return "시스템 관리자";
      default: return "";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Starter": return "var(--secondary)";
      case "Professional": return "var(--accent)";
      case "Enterprise": return "var(--primary)";
      default: return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "var(--success)";
      case "trial": return "var(--warning)";
      case "inactive": return "#6B7280";
      default: return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "활성";
      case "trial": return "체험중";
      case "inactive": return "비활성";
      default: return status;
    }
  };

  const getApprovalStatusLabel = (status?: string) => {
    switch (status) {
      case "pending": return "승인대기";
      case "approved": return "승인완료";
      case "rejected": return "거부됨";
      default: return "-";
    }
  };

  const getApprovalStatusColor = (status?: string) => {
    switch (status) {
      case "pending": return "#F59E0B"; // Amber
      case "approved": return "var(--success)";
      case "rejected": return "#EF4444"; // Red
      default: return "#6B7280";
    }
  };

  const roleStats = [
    { label: "전체 회원", value: members.length, color: "var(--accent)" },
    { label: "고객", value: members.filter(m => m.role === "customer").length, color: "#3B82F6", description: "분석 서비스 이용" },
    { label: "전문가", value: members.filter(m => m.role === "expert").length, color: "#8B5CF6", description: "리포트 작성" },
    { label: "승인 대기", value: members.filter(m => m.approvalStatus === "pending").length, color: "#F59E0B", description: "전문가 승인 대기 중" }
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 style={{ color: 'var(--primary)' }}>회원 관리</h1>
              <p className="text-gray-600">전체 회원 현황을 관리하고 모니터링합니다</p>
            </div>
          </div>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {roleStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-base font-semibold text-gray-700">{stat.label}</div>
              {stat.description && (
                <div className="text-sm text-gray-500 mt-1">{stat.description}</div>
              )}
            </div>
          ))}
        </div>

        {/* Role Definition Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            회원 등급 정의
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#3B82F6' }}>
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg" style={{ color: '#3B82F6' }}>고객</span>
              </div>
              <p className="text-sm text-gray-600">
                분석 서비스를 이용하는 일반 고객입니다. 웹사이트 분석을 요청하고 리포트를 받아볼 수 있습니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#8B5CF6' }}>
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg" style={{ color: '#8B5CF6' }}>전문가</span>
              </div>
              <p className="text-sm text-gray-600">
                분석 리포트를 작성하는 전문가입니다. 회원가입 후 관리자 승인이 필요합니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#EF4444' }}>
                  <Filter className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg" style={{ color: '#EF4444' }}>관리자</span>
              </div>
              <p className="text-sm text-gray-600">
                시스템 전체를 관리하는 관리자입니다. 회원 관리, 승인 처리, 통계 확인 등의 권한이 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="이름, 이메일, 회사명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none appearance-none"
              >
                <option value="all">모든 등급</option>
                <option value="customer">고객</option>
                <option value="expert">전문가</option>
                <option value="admin">관리자</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none appearance-none"
              >
                <option value="all">모든 플랜</option>
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--accent)] outline-none appearance-none"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="trial">체험중</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    회원 정보
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    등급
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    플랜
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    상태
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    승인 상태
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    분석 횟수
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    가입일
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    onClick={() => navigate(`/admin/member/${member.id}`)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: getRoleColor(member.role) }}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--primary)' }}>
                            {member.name}
                          </div>
                          <div className="text-base text-gray-500">{member.email}</div>
                          <div className="text-sm text-gray-400">{member.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span
                          className="px-3 py-1 rounded-full text-base font-semibold text-white inline-block"
                          style={{ background: getRoleColor(member.role) }}
                        >
                          {getRoleLabel(member.role)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{getRoleDescription(member.role)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-base font-semibold text-white"
                        style={{ background: getPlanColor(member.plan) }}
                      >
                        {member.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: getStatusColor(member.status) }}
                        />
                        <span className="text-base font-semibold" style={{ color: getStatusColor(member.status) }}>
                          {getStatusLabel(member.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.role === "expert" ? (
                        <div className="flex items-center gap-3">
                          {/* Toggle Switch */}
                          <button
                            onClick={() => {
                              // TODO: API 호출로 승인 상태 변경
                              console.log(`Toggle approval for ${member.email}`);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              member.approvalStatus === "approved"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                member.approvalStatus === "approved"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          {/* Status Label */}
                          <span
                            className="text-sm font-semibold"
                            style={{ color: getApprovalStatusColor(member.approvalStatus) }}
                          >
                            {getApprovalStatusLabel(member.approvalStatus)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-base text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                          {member.analysisCount}회
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-base text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {member.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-base text-gray-600">
              총 {filteredMembers.length}명의 회원
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-base font-semibold">
                이전
              </button>
              <button className="px-4 py-2 rounded-lg text-white text-base font-semibold" style={{ background: 'var(--accent)' }}>
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-base font-semibold">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-base font-semibold">
                3
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-base font-semibold">
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
