import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  Award,
  CreditCard,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Link as LinkIcon,
  UserX,
  AlertTriangle,
} from "lucide-react";

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
  // 전문가 정보
  specialization?: string;
  portfolioUrl?: string;
  yearsOfExperience?: number;
  // 고객 정보
  subscriptionStartDate?: string;
  paymentMethod?: string;
}

export function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"customer" | "expert" | "admin">("customer");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Mock data - 실제로는 API에서 가져옴
  const member: Member = {
    id: id || "1",
    name: "김철수",
    email: "kim@example.com",
    company: "Example Corp",
    role: "expert",
    plan: "Professional",
    status: "active",
    approvalStatus: "pending",
    joinDate: "2024-01-15",
    analysisCount: 12,
    lastActive: "2024-11-20",
    specialization: "UI/UX 디자인",
    portfolioUrl: "https://portfolio.example.com",
    yearsOfExperience: 5,
    subscriptionStartDate: "2024-01-15",
    paymentMethod: "신용카드",
  };

  const handleApprovalToggle = () => {
    const newStatus = approvalStatus === "approved" ? "pending" : "approved";
    setApprovalStatus(newStatus);
    // TODO: API 호출
    console.log(`Approval status changed to: ${newStatus}`);
  };

  const handleDeleteMember = async () => {
    if (deleteConfirmText !== member.email) {
      alert("이메일 주소가 일치하지 않습니다.");
      return;
    }

    try {
      // TODO: API 호출
      console.log(`Deleting member: ${member.id}`);
      // await deleteMember(member.id);

      alert(`회원 ${member.name}(${member.email})이 성공적으로 탈퇴 처리되었습니다.`);
      navigate("/admin/members");
    } catch (error) {
      console.error("회원 탈퇴 처리 실패:", error);
      alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "customer": return "#3B82F6";
      case "expert": return "#8B5CF6";
      case "admin": return "#EF4444";
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

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/members")}
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--accent)] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">회원 관리로 돌아가기</span>
          </button>
          <h1 style={{ color: "var(--primary)" }}>회원 상세 정보</h1>
        </div>

        {/* Member Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                style={{ background: getRoleColor(member.role) }}
              >
                {member.name.charAt(0)}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 style={{ color: "var(--primary)" }}>{member.name}</h2>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ background: getRoleColor(member.role) }}
                  >
                    {getRoleLabel(member.role)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: getStatusColor(member.status) }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: getStatusColor(member.status) }}
                    >
                      {getStatusLabel(member.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>가입일: {member.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>최근 활동: {member.lastActive}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Approval Toggle */}
            {member.role === "expert" && (
              <div className="flex flex-col items-end gap-3">
                <div className="text-sm text-gray-600">전문가 승인</div>
                <button
                  onClick={handleApprovalToggle}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    approvalStatus === "approved" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      approvalStatus === "approved" ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: approvalStatus === "approved" ? "var(--success)" : "#F59E0B",
                  }}
                >
                  {approvalStatus === "approved" ? "승인완료" : "승인대기"}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all"
            >
              <UserX className="w-5 h-5" />
              회원 강제탈퇴
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "customer"
                  ? "border-b-2 text-[var(--accent)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={activeTab === "customer" ? { borderColor: "var(--accent)" } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                고객 정보
              </div>
            </button>
            <button
              onClick={() => setActiveTab("expert")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "expert"
                  ? "border-b-2 text-[var(--accent)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={activeTab === "expert" ? { borderColor: "var(--accent)" } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                전문가 정보
              </div>
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "admin"
                  ? "border-b-2 text-[var(--accent)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={activeTab === "admin" ? { borderColor: "var(--accent)" } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                관리자 정보
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Customer Tab */}
            {activeTab === "customer" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    구독 정보
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">현재 플랜</span>
                      </div>
                      <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>
                        {member.plan}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">분석 사용 횟수</span>
                      </div>
                      <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                        {member.analysisCount}회
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    결제 정보
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">구독 시작일</span>
                        <span className="font-semibold">{member.subscriptionStartDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">결제 수단</span>
                        <span className="font-semibold">{member.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expert Tab */}
            {activeTab === "expert" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    전문가 프로필
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">전문 분야</div>
                      <div className="font-semibold">{member.specialization || "-"}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">경력</div>
                      <div className="font-semibold">{member.yearsOfExperience || 0}년</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <LinkIcon className="w-4 h-4" />
                        포트폴리오 URL
                      </div>
                      {member.portfolioUrl ? (
                        <a
                          href={member.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent)] hover:underline font-semibold"
                        >
                          {member.portfolioUrl}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    검수 작업 내역
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                    검수 작업 내역이 없습니다
                  </div>
                </div>
              </div>
            )}

            {/* Admin Tab */}
            {activeTab === "admin" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    권한 정보
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>회원 관리</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>프로젝트 관리</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>시스템 설정</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    활동 로그
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                    활동 로그가 없습니다
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">회원 강제탈퇴</h3>
                  <p className="text-sm text-gray-600">이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-800 mb-2">
                  <strong>{member.name}({member.email})</strong> 회원을 강제탈퇴 처리합니다.
                </p>
                <ul className="text-sm text-red-700 space-y-1 ml-4 list-disc">
                  <li>모든 회원 데이터가 삭제됩니다</li>
                  <li>진행 중인 프로젝트가 취소됩니다</li>
                  <li>결제 정보가 삭제됩니다</li>
                  <li>이 작업은 되돌릴 수 없습니다</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  확인을 위해 회원의 이메일 주소를 입력하세요:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={member.email}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteMember}
                  disabled={deleteConfirmText !== member.email}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  탈퇴 처리
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
