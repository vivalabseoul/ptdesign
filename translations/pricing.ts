export const pricingTranslations = {
  ko: {
    header: {
      title: "비즈니스 성장을 위한",
      titleAccent: "최적의 솔루션",
      subtitle: "합리적인 가격으로 전문가의 분석과 AI의 정밀함을 경험하세요."
    },
    plans: [
      {
        id: "quick-scan",
        name: "퀵 스캔",
        price: "29K",
        desc: "뭔가 이상한데? 빠른 점검",
        usp: "4시간 납기 · 모바일만 · 긴급/점검용",
        features: [
          "메인/랜딩페이지 (모바일만)",
          "기초 점검 레벨",
          "개선 프롬프트 1종",
          "1쪽 PDF 리포트 + TXT",
          "4시간 초고속 납기"
        ],
        badge: "가장 저렴!",
        badgeColor: "bg-[var(--secondary)]",
        highlight: false
      },
      {
        id: "micro-analysis",
        name: "마이크로 분석",
        price: "99K",
        desc: "스타트업, MVP, 긴급 진단",
        usp: "24시간 납기 · 1페이지 완전 분석",
        features: [
          "1페이지 (모바일/데스크톱)",
          "기초 분석 + 기본 CVR 분석",
          "개선 프롬프트 3종",
          "기초 접근성 감사 + 체크리스트",
          "2쪽 PDF 리포트 + TXT",
          "24시간 빠른 납기"
        ],
        badge: "가성비 최고!",
        badgeColor: "bg-[var(--accent)]",
        highlight: false
      },
      {
        id: "full-page-deep",
        name: "풀페이지 심층",
        price: "299K",
        desc: "중소기업, 이커머스 (최대 3페이지)",
        usp: "72시간 납기 · 추가 페이지당 ₩80K",
        features: [
          "전체 1페이지 (크로스브라우징)",
          "심층 분석 + 심화 CVR 분석",
          "개선 프롬프트 5종 + 이미지 3개",
          "완전 접근성 감사 + 히트맵/세션",
          "5쪽 PDF 리포트 + TXT + 체크리스트",
          "72시간 납기"
        ],
        badge: "인기",
        badgeColor: "bg-[var(--accent)]",
        highlight: true
      },
      {
        id: "full-system",
        name: "전체 시스템",
        price: "협의",
        desc: "대규모 플랫폼, 장기 시스템 (최소 799K)",
        usp: "72시간 납기 · 맞춤 견적 제공",
        features: [
          "전체 사이트 (크로스브라우징 심층)",
          "전문가 분석 + 고급 CVR (퍼널)",
          "개선 프롬프트 5종+ + 이미지 5개+",
          "CSS 가이드 (기본/전체)",
          "전사 접근성 표준화 + 심층 사용자 테스트",
          "8~20쪽 상세 PDF 리포트 + TXT + 상세 체크리스트",
          "72시간 납기"
        ],
        badge: "풀버전!",
        badgeColor: "bg-gray-900",
        highlight: false
      }
    ],
    cta: "지금 시작하기",
    footer: {
      refund: "환불 정책:",
      refundText: "단순 변심 환불 대신 대체 프롬프트 2종을 무상으로 제공해 드립니다. (7일 이내 요청 시)",
      delivery: "납기 기준:",
      deliveryText: "퀵 스캔은 4시간 내, 마이크로 분석은 24시간 내, 그 외 상품은 영업일 기준 72시간 내 납품됩니다.",
      scope: "범위 안내:",
      scopeText: "지정된 범위를 초과하는 경우 상위 패키지로 전환을 안내해 드릴 수 있습니다.",
      moreProducts: "더 많은 상품 보기 (캠페인 킷, 대량 바우처 등)"
    }
  },
  en: {
    header: {
      title: "For Business Growth",
      titleAccent: "Optimal Solution",
      subtitle: "Experience expert analysis and AI precision at a reasonable price."
    },
    plans: [
      {
        id: "quick-scan",
        name: "Quick Scan",
        price: "29K",
        desc: "Something's off? Quick check",
        usp: "4-hour delivery · Mobile only · Urgent/Check",
        features: [
          "Main/Landing page (Mobile only)",
          "Basic inspection level",
          "1 improvement prompt",
          "1-page PDF report + TXT",
          "4-hour ultra-fast delivery"
        ],
        badge: "Cheapest!",
        badgeColor: "bg-[var(--secondary)]",
        highlight: false
      },
      {
        id: "micro-analysis",
        name: "Micro Analysis",
        price: "99K",
        desc: "Startup, MVP, urgent diagnosis",
        usp: "24-hour delivery · 1 page full analysis",
        features: [
          "1 page (Mobile/Desktop)",
          "Basic analysis + Basic CVR analysis",
          "3 improvement prompts",
          "Basic accessibility audit + Checklist",
          "2-page PDF report + TXT",
          "24-hour fast delivery"
        ],
        badge: "Best Value!",
        badgeColor: "bg-[var(--accent)]",
        highlight: false
      },
      {
        id: "full-page-deep",
        name: "Full Page Deep",
        price: "299K",
        desc: "SMB, E-commerce (Max 3 pages)",
        usp: "72-hour delivery · +₩80K per page",
        features: [
          "Full 1 page (Cross-browsing)",
          "Deep analysis + Advanced CVR analysis",
          "5 improvement prompts + 3 images",
          "Complete accessibility audit + Heatmap/Session",
          "5-page PDF report + TXT + Checklist",
          "72-hour delivery"
        ],
        badge: "Popular",
        badgeColor: "bg-[var(--accent)]",
        highlight: true
      },
      {
        id: "full-system",
        name: "Full System",
        price: "Consultation",
        desc: "Large platform, long-term system (Min 799K)",
        usp: "72-hour delivery · Custom quote",
        features: [
          "Full site (Cross-browsing deep)",
          "Expert analysis + Advanced CVR (Funnel)",
          "5+ improvement prompts + 5+ images",
          "CSS guide (Basic/Full)",
          "Enterprise accessibility standardization + Deep user testing",
          "8~20 page detailed PDF report + TXT + Detailed checklist",
          "72-hour delivery"
        ],
        badge: "Full Version!",
        badgeColor: "bg-gray-900",
        highlight: false
      }
    ],
    cta: "Get Started",
    footer: {
      refund: "Refund Policy:",
      refundText: "Instead of simple refunds, we provide 2 alternative prompts free of charge. (Within 7 days)",
      delivery: "Delivery Time:",
      deliveryText: "Quick Scan within 4 hours, Micro Analysis within 24 hours, other products within 72 business hours.",
      scope: "Scope Notice:",
      scopeText: "If the specified scope is exceeded, we may guide you to upgrade to a higher package.",
      moreProducts: "View More Products (Campaign Kit, Bulk Vouchers, etc.)"
    }
  }
};
