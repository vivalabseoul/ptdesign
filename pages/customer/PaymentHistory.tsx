import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";
import { CreditCard, Download, Calendar, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface Payment {
  id: string;
  order_id: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  payment_method: string;
  created_at: string;
}

export function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentHistory();
  }, [user]);

  const loadPaymentHistory = async () => {
    if (!user) return;

    try {
      // TODO: 실제 API 연동
      // const data = await getPaymentHistory(user.id);

      // 임시 더미 데이터
      const dummyPayments: Payment[] = [
        {
          id: '1',
          order_id: 'ORDER_20241215_001',
          plan_id: 'pro',
          plan_name: '프로 플랜',
          amount: 299000,
          currency: 'KRW',
          status: 'completed',
          payment_method: 'card',
          created_at: '2024-12-15T10:30:00Z'
        },
        {
          id: '2',
          order_id: 'ORDER_20241210_001',
          plan_id: 'basic',
          plan_name: '베이직 플랜',
          amount: 99000,
          currency: 'KRW',
          status: 'completed',
          payment_method: 'card',
          created_at: '2024-12-10T14:20:00Z'
        },
      ];

      setPayments(dummyPayments);
    } catch (error) {
      console.error("결제 내역 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: '결제 완료',
          color: 'var(--success)',
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          textColor: 'text-green-600'
        };
      case 'pending':
        return {
          label: '결제 대기',
          color: 'var(--warning)',
          icon: Clock,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600'
        };
      case 'failed':
        return {
          label: '결제 실패',
          color: 'var(--accent)',
          icon: XCircle,
          bgColor: 'bg-red-50',
          textColor: 'text-red-600'
        };
      default:
        return {
          label: status,
          color: 'gray',
          icon: Clock,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `₩${amount.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
              <CreditCard className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 style={{ color: 'var(--primary)' }} className="leading-tight">결제 내역</h1>
              <p className="text-gray-600 mt-1 text-base">모든 결제 내역을 확인하세요</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
                <CreditCard className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-sm text-gray-600">총 결제 금액</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
              ₩{payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--success)15' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
              </div>
              <p className="text-sm text-gray-600">완료된 결제</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
              {payments.filter(p => p.status === 'completed').length}건
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--secondary)15' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
              </div>
              <p className="text-sm text-gray-600">최근 결제일</p>
            </div>
            <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
              {payments.length > 0 ? new Date(payments[0].created_at).toLocaleDateString('ko-KR') : '-'}
            </p>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 style={{ color: 'var(--primary)' }}>결제 내역</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent)' }}></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                결제 내역이 없습니다
              </h4>
              <p className="text-gray-600">
                아직 결제한 내역이 없습니다.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">주문번호</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">플랜</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">결제일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">결제 수단</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">금액</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">상태</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">영수증</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => {
                    const statusInfo = getStatusInfo(payment.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{payment.order_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{payment.plan_name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{formatDate(payment.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {payment.payment_method === 'card' ? '카드' : payment.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                            {formatAmount(payment.amount, payment.currency)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            style={{ color: 'var(--accent)' }}
                            onClick={() => {
                              // TODO: 영수증 다운로드 기능 구현
                              alert('영수증 다운로드 기능은 곧 제공됩니다.');
                            }}
                          >
                            <Download className="w-4 h-4" />
                            다운로드
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
