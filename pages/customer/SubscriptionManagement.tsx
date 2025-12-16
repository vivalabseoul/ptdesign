import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Crown, Check, CreditCard, AlertCircle, Zap, ArrowRight } from "lucide-react";
import { PaymentButton } from "../../components/PaymentButton";
import { PaymentPlan } from "../../utils/payment/nicepay";

export function SubscriptionManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  const plans = [
    {
      id: 'basic' as PaymentPlan,
      name: '퀵 스캔',
      price: 29000,
      priceText: '₩29K',
      description: '뭔가 이상한데? 빠른 점검',
      features: [
        '메인/랜딩페이지',
        '기초 점검 레벨',
        '개선 프롬프트 1종',
        '4시간 초고속 납기',
        '⚠️ SEO 지침서 미포함'
      ],
      badge: '가장 저렴!',
      highlight: false
    },
    {
      id: 'basic' as PaymentPlan,
      name: '마이크로 분석',
      price: 99000,
      priceText: '₩99K',
      description: '스타트업, MVP, 긴급 진단',
      features: [
        '1페이지 (모바일/데스크톱)',
        '기초 분석 + 기본 CVR 분석',
        '개선 프롬프트 3종',
        '✅ SEO 지침서 포함',
        '기초 접근성 감사 + 체크리스트',
        '24시간 빠른 납기'
      ],
      badge: '가성비 최고!',
      highlight: false
    },
    {
      id: 'pro' as PaymentPlan,
      name: '풀페이지 심층',
      price: 299000,
      priceText: '₩299K',
      description: '중소기업, 이커머스 (최대 3페이지)',
      features: [
        '전체 1페이지 (크로스브라우징)',
        '심층 분석 + 심화 CVR 분석',
        '개선 프롬프트 5종 + 이미지 3개',
        '✅ SEO 지침서 포함',
        '완전 접근성 감사 + 히트맵/세션',
        '72시간 납기'
      ],
      badge: '인기',
      highlight: true
    },
    {
      id: 'enterprise' as PaymentPlan,
      name: '전체 시스템',
      price: 0,
      priceText: '협의',
      description: '대규모 플랫폼, 장기 시스템 (최소 799K)',
      features: [
        '전체 사이트 (크로스브라우징 심층)',
        '전문가 분석 + 고급 CVR (퍼널)',
        '개선 프롬프트 5종+ + 이미지 5개+',
        '✅ SEO 지침서 포함',
        'CSS 가이드 (기본/전체)',
        '전사 접근성 표준화 + 심층 사용자 테스트',
        '72시간 납기'
      ],
      badge: '풀버전!',
      highlight: false
    }
  ];

  // 결제하지 않은 고객은 'guest'로 표시
  const guestPlan = {
    id: 'guest' as PaymentPlan,
    name: 'Guest',
    price: 0,
    priceText: '-',
    description: '아직 구매한 플랜이 없습니다',
    features: [],
    badge: null,
    highlight: false
  };

  const currentPlan = plans.find(p => p.id === user?.subscription_plan) || guestPlan;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
              <Crown className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 style={{ color: 'var(--primary)' }} className="leading-tight">구독 관리</h1>
              <p className="text-gray-600 mt-1 text-base">플랜 변경 및 구독 정보를 관리하세요</p>
            </div>
          </div>
        </div>

        {/* Current Plan Info */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg mb-8 p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">현재 플랜</p>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{currentPlan.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">결제 방식</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{currentPlan.priceText}</p>
              <p className="text-sm text-gray-600">건당 결제</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                <p className="text-sm text-gray-600">구독 상태</p>
              </div>
              <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                {user?.subscription_status === 'active' ? '활성' : '비활성'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                <p className="text-sm text-gray-600">결제 수단</p>
              </div>
              <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                Nice Pay
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4" style={{ color: 'var(--success)' }} />
                <p className="text-sm text-gray-600">다음 결제일</p>
              </div>
              <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                건당 결제
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/customer/payment-history')}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-all"
            >
              결제 내역 보기
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              플랜 업그레이드
            </button>
          </div>
        </div>

        {/* Available Plans */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>사용 가능한 플랜</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan.id;

              return (
                <div
                  key={plan.id}
                  className={`
                    relative rounded-2xl p-6 flex flex-col transition-all duration-300
                    ${plan.highlight
                      ? 'bg-white border-2 border-[var(--accent)] shadow-lg scale-105'
                      : 'bg-white border border-gray-200 hover:border-[var(--accent)] hover:shadow-lg'
                    }
                    ${isCurrentPlan ? 'ring-2 ring-offset-2 ring-[var(--secondary)]' : ''}
                  `}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          plan.highlight
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--secondary)] text-white'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--secondary)] text-white">
                        현재 플랜
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                      {plan.name}
                    </h4>
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
                      {plan.priceText}
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.id === 'enterprise' ? (
                    <button
                      onClick={() => window.open('mailto:contact@protouchdesign.com', '_blank')}
                      className="w-full py-3 rounded-xl font-semibold border-2 transition-all hover:shadow-lg"
                      style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                    >
                      문의하기
                    </button>
                  ) : isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 cursor-not-allowed"
                    >
                      사용 중
                    </button>
                  ) : (
                    <PaymentButton
                      planId={plan.id}
                      className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                      style={{ background: 'var(--accent)' }}
                    >
                      선택하기
                    </PaymentButton>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ / Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">플랜 변경 안내</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• 플랜은 분석 1건당 결제 방식입니다.</li>
                <li>• 결제 후 24-72시간 내에 분석 리포트가 발송됩니다.</li>
                <li>• 환불은 제공하지 않습니다. 결제 전 충분히 검토하신 후 구매를 진행해 주시기 바랍니다.</li>
                <li>• 문의사항이 있으시면 고객지원팀으로 연락주세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
