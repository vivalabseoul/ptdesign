import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Activity, Search, Filter, TrendingUp, Calendar, Award, Clock, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MemberUsage {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "Starter" | "Professional" | "Enterprise";
  status: "active" | "inactive" | "trial";
  joinDate: string;
  analysisCount: number;
  lastActive: string;
  avgSessionTime: string;
  totalSpent: string;
}

export function MemberUsage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const members: MemberUsage[] = [
    {
      id: "1",
      name: "김철수",
      email: "kim@example.com",
      company: "Example Corp",
      plan: "Professional",
      status: "active",
      joinDate: "2024-01-15",
      analysisCount: 12,
      lastActive: "2024-11-20",
      avgSessionTime: "45분",
      totalSpent: "₩180,000"
    },
    {
      id: "2",
      name: "이영희",
      email: "lee@startup.io",
      company: "Startup Inc",
      plan: "Enterprise",
      status: "active",
      joinDate: "2024-03-22",
      analysisCount: 28,
      lastActive: "2024-11-21",
      avgSessionTime: "1시간 20분",
      totalSpent: "₩850,000"
    },
    {
      id: "3",
      name: "박민수",
      email: "park@company.kr",
      company: "Company Ltd",
      plan: "Starter",
      status: "trial",
      joinDate: "2024-11-10",
      analysisCount: 3,
      lastActive: "2024-11-19",
      avgSessionTime: "20분",
      totalSpent: "₩0"
    },
    {
      id: "4",
      name: "정수진",
      email: "jung@agency.net",
      company: "Agency Pro",
      plan: "Professional",
      status: "active",
      joinDate: "2024-02-08",
      analysisCount: 19,
      lastActive: "2024-11-21",
      avgSessionTime: "55분",
      totalSpent: "₩290,000"
    },
    {
      id: "5",
      name: "최동욱",
      email: "choi@shop.com",
      company: "Shop Online",
      plan: "Starter",
      status: "inactive",
      joinDate: "2024-08-15",
      analysisCount: 5,
      lastActive: "2024-10-30",
      avgSessionTime: "15분",
      totalSpent: "₩25,000"
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = filterPlan === "all" || member.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

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

  const stats = [
    { label: "총 매출", value: "₩1,345,000", color: "var(--success)", icon: TrendingUp },
    { label: "총 분석 횟수", value: "67회", color: "var(--accent)", icon: BarChart3 },
    { label: "평균 세션", value: "52분", color: "var(--secondary)", icon: Clock },
    { label: "활성 구독", value: "4개", color: "var(--primary)", icon: Activity }
  ];

  const usageByPlan = [
    { plan: "Starter", count: 8, revenue: 25000 },
    { plan: "Professional", count: 31, revenue: 470000 },
    { plan: "Enterprise", count: 28, revenue: 850000 }
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
              <Activity className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 style={{ color: 'var(--primary)' }}>회원 사용량 관리</h1>
              <p className="text-gray-600">회원별 사용 통계 및 플랜 현황을 확인합니다</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-base text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Usage Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            플랜별 사용량 및 매출
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageByPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="plan" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="count" fill="var(--accent)" name="분석 횟수" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="var(--success)" name="매출 (₩)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="grid md:grid-cols-3 gap-4">
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
                    플랜
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    상태
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    분석 횟수
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    평균 세션
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    총 사용액
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    가입일
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--primary)' }}>
                    최근 활동
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--primary)' }}>
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
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                          {member.analysisCount}회
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-base text-gray-600">
                          {member.avgSessionTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold" style={{ color: 'var(--success)' }}>
                        {member.totalSpent}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-base text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {member.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-base text-gray-600">
                        {member.lastActive}
                      </div>
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
