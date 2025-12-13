/**
 * 시연용 샘플 데이터 생성 스크립트
 * 브라우저 콘솔에서 실행하세요
 */

// 샘플 사용자 데이터
const sampleUsers = [
  {
    id: "demo-user-001",
    email: "demo@protouchdesign.com",
    password: "demo1234",
    name: "김데모",
    role: "customer" as const,
    subscriptionTier: "pro" as const,
    freeAnalysisUsed: false,
    subscription_status: "active" as const,
    subscription_plan: "pro" as const,
  },
  {
    id: "admin-user-001",
    email: "admin@protouchdesign.com",
    password: "admin1234",
    name: "관리자",
    role: "admin" as const,
    subscriptionTier: "enterprise" as const,
    freeAnalysisUsed: false,
    subscription_status: "active" as const,
    subscription_plan: "enterprise" as const,
  },
];

// 샘플 프로젝트 데이터
const sampleProjects = [
  {
    id: "demo-proj-001",
    user_id: "demo-user-001",
    url: "https://www.samsung.com",
    status: "completed" as const,
    created_at: new Date("2024-12-01").toISOString(),
    updated_at: new Date("2024-12-01").toISOString(),
  },
  {
    id: "demo-proj-002",
    user_id: "demo-user-001",
    url: "https://www.naver.com",
    status: "completed" as const,
    created_at: new Date("2024-12-05").toISOString(),
    updated_at: new Date("2024-12-05").toISOString(),
  },
  {
    id: "demo-proj-003",
    user_id: "demo-user-001",
    url: "https://www.coupang.com",
    status: "completed" as const,
    created_at: new Date("2024-12-07").toISOString(),
    updated_at: new Date("2024-12-07").toISOString(),
  },
];

// 샘플 리포트 데이터
const sampleReports = {
  "demo-proj-001": {
    totalScore: 78,
    evaluationCriteria: [
      {
        category: "첫인상",
        score: 85,
        weight: 25,
        description: "사이트의 첫인상과 로딩 속도를 평가합니다",
        methodology: "LCP, FID, CLS 등 Core Web Vitals 측정",
        subcriteria: [],
      },
      {
        category: "이탈 방지",
        score: 72,
        weight: 20,
        description: "사용자의 이탈을 방지하는 요소를 평가합니다",
        methodology: "CTA 배치, 네비게이션 구조 분석",
        subcriteria: [],
      },
      {
        category: "모바일 경험",
        score: 75,
        weight: 20,
        description: "모바일 환경에서의 사용성을 평가합니다",
        methodology: "반응형 디자인, 터치 인터랙션 분석",
        subcriteria: [],
      },
      {
        category: "체류 유도",
        score: 80,
        weight: 15,
        description: "사용자의 체류 시간을 늘리는 요소를 평가합니다",
        methodology: "콘텐츠 품질, 인게이지먼트 요소 분석",
        subcriteria: [],
      },
      {
        category: "접근성",
        score: 70,
        weight: 10,
        description: "웹 접근성 준수 여부를 평가합니다",
        methodology: "WCAG 2.1 기준 자동화 테스트",
        subcriteria: [],
      },
      {
        category: "SEO",
        score: 82,
        weight: 10,
        description: "검색 엔진 최적화 수준을 평가합니다",
        methodology: "메타 태그, 구조화 데이터 분석",
        subcriteria: [],
      },
    ],
    improvements: [
      {
        id: "imp-001",
        category: "첫인상",
        title: "히어로 섹션 이미지 최적화",
        priority: "high" as const,
        currentState: "3.2초 로딩 시간, 압축되지 않은 고해상도 이미지 사용",
        targetState: "1.5초 이내 로딩, WebP 포맷 + Lazy Loading 적용",
        impact: "페이지 로딩 속도 50% 개선, 첫인상 점수 +15점 예상",
        effort: "Easy" as const,
        status: "warning" as const,
        impactOnRetention: "방문자의 25%가 3초 이내 이탈 → 12%로 감소",
        impactOnBounceRate: "이탈률 53% → 40% 예상",
      },
      {
        id: "imp-002",
        category: "이탈 방지",
        title: "주요 CTA 버튼 가시성 개선",
        priority: "critical" as const,
        currentState: "메인 CTA가 스크롤 하단에 위치, 클릭률 2.3%",
        targetState: "Above the fold 영역에 명확한 CTA 배치, 대비 강화",
        impact: "전환율 2.3% → 5.8%로 250% 증가 예상",
        effort: "Easy" as const,
        status: "fail" as const,
        impactOnRetention: "구매/문의 전환이 명확해져 재방문율 증가",
        impactOnBounceRate: "명확한 행동 유도로 이탈률 15% 감소",
      },
      {
        id: "imp-003",
        category: "모바일 경험",
        title: "모바일 메뉴 네비게이션 개선",
        priority: "high" as const,
        currentState: "햄버거 메뉴 탭이 작고, 주요 메뉴 접근에 3번 이상 클릭 필요",
        targetState: "터치 영역 확대(48x48px), 주요 메뉴 1뎁스 노출",
        impact: "모바일 이탈률 65% → 48%로 감소 예상",
        effort: "Medium" as const,
        status: "warning" as const,
        impactOnRetention: "모바일 사용자 체류 시간 2분 → 4분 증가",
        impactOnBounceRate: "모바일 이탈률 26% 감소",
      },
      {
        id: "imp-004",
        category: "접근성",
        title: "색상 대비 개선 (WCAG AA 준수)",
        priority: "medium" as const,
        currentState: "텍스트-배경 대비가 3.2:1로 기준 미달",
        targetState: "WCAG AA 기준 4.5:1 이상 대비 확보",
        impact: "시각 장애인 포함 모든 사용자 가독성 향상",
        effort: "Easy" as const,
        status: "warning" as const,
        impactOnRetention: "가독성 향상으로 콘텐츠 소비 증가",
        impactOnBounceRate: "가독성 개선으로 이탈률 5-8% 감소",
      },
      {
        id: "imp-005",
        category: "체류 유도",
        title: "관련 콘텐츠 추천 섹션 추가",
        priority: "medium" as const,
        currentState: "단일 페이지 조회 후 이탈, 페이지당 체류 시간 1.2분",
        targetState: "AI 기반 관련 상품/콘텐츠 추천 섹션",
        impact: "페이지뷰 1.2 → 2.8로 증가, 체류 시간 3배 증가",
        effort: "Hard" as const,
        status: "warning" as const,
        impactOnRetention: "재방문율 35% → 52% 증가",
        impactOnBounceRate: "세션당 페이지뷰 증가로 이탈률 20% 감소",
      },
    ],
    currentMetrics: {
      bounceRate: "53%",
      avgSessionTime: "1분 48초",
      pagesPerSession: "1.8페이지",
      conversionRate: "2.3%",
      mobileBounceRate: "65%",
    },
    industryBenchmark: {
      bounceRate: "40-50%",
      avgSessionTime: "2분 30초",
      pagesPerSession: "3.2페이지",
      conversionRate: "3.5%",
    },
    targetMetrics: {
      bounceRate: "35-40%",
      avgSessionTime: "4분 15초",
      pagesPerSession: "4.5페이지",
      conversionRate: "5.8%",
    },
  },
  "demo-proj-002": {
    totalScore: 82,
    evaluationCriteria: [
      {
        category: "첫인상",
        score: 88,
        weight: 25,
        description: "사이트의 첫인상과 로딩 속도를 평가합니다",
        methodology: "LCP, FID, CLS 등 Core Web Vitals 측정",
        subcriteria: [],
      },
      {
        category: "이탈 방지",
        score: 80,
        weight: 20,
        description: "사용자의 이탈을 방지하는 요소를 평가합니다",
        methodology: "CTA 배치, 네비게이션 구조 분석",
        subcriteria: [],
      },
      {
        category: "모바일 경험",
        score: 85,
        weight: 20,
        description: "모바일 환경에서의 사용성을 평가합니다",
        methodology: "반응형 디자인, 터치 인터랙션 분석",
        subcriteria: [],
      },
      {
        category: "체류 유도",
        score: 78,
        weight: 15,
        description: "사용자의 체류 시간을 늘리는 요소를 평가합니다",
        methodology: "콘텐츠 품질, 인게이지먼트 요소 분석",
        subcriteria: [],
      },
      {
        category: "접근성",
        score: 75,
        weight: 10,
        description: "웹 접근성 준수 여부를 평가합니다",
        methodology: "WCAG 2.1 기준 자동화 테스트",
        subcriteria: [],
      },
      {
        category: "SEO",
        score: 86,
        weight: 10,
        description: "검색 엔진 최적화 수준을 평가합니다",
        methodology: "메타 태그, 구조화 데이터 분석",
        subcriteria: [],
      },
    ],
    improvements: [
      {
        id: "imp-006",
        category: "체류 유도",
        title: "검색 결과 페이지 개인화",
        priority: "high" as const,
        currentState: "동일한 검색 결과를 모든 사용자에게 표시",
        targetState: "사용자 히스토리 기반 맞춤 검색 결과 제공",
        impact: "클릭률 18% → 32%로 증가, 검색 이탈률 감소",
        effort: "Hard" as const,
        status: "warning" as const,
        impactOnRetention: "맞춤형 콘텐츠로 재방문율 45% 증가",
        impactOnBounceRate: "검색 만족도 증가로 이탈률 25% 감소",
      },
      {
        id: "imp-007",
        category: "모바일 경험",
        title: "무한 스크롤 UX 개선",
        priority: "medium" as const,
        currentState: "스크롤 중 로딩이 끊김, 스켈레톤 UI 없음",
        targetState: "부드러운 스켈레톤 로딩, 프리페칭 적용",
        impact: "사용자 경험 향상, 모바일 체류 시간 35% 증가",
        effort: "Medium" as const,
        status: "warning" as const,
        impactOnRetention: "스크롤 경험 개선으로 재방문 유도",
        impactOnBounceRate: "로딩 불만 감소로 이탈률 12% 감소",
      },
      {
        id: "imp-008",
        category: "접근성",
        title: "키보드 네비게이션 강화",
        priority: "medium" as const,
        currentState: "일부 인터랙티브 요소가 키보드로 접근 불가",
        targetState: "모든 요소 Tab 키 네비게이션 지원, 포커스 표시 명확화",
        impact: "접근성 점수 향상, 키보드 사용자 만족도 증가",
        effort: "Medium" as const,
        status: "warning" as const,
        impactOnRetention: "장애인 사용자 포함 더 넓은 사용자층 확보",
        impactOnBounceRate: "접근성 개선으로 이탈률 8% 감소",
      },
    ],
    currentMetrics: {
      bounceRate: "42%",
      avgSessionTime: "3분 25초",
      pagesPerSession: "3.8페이지",
      conversionRate: "4.2%",
      mobileBounceRate: "48%",
    },
    industryBenchmark: {
      bounceRate: "40-50%",
      avgSessionTime: "2분 30초",
      pagesPerSession: "3.2페이지",
      conversionRate: "3.5%",
    },
    targetMetrics: {
      bounceRate: "32-36%",
      avgSessionTime: "5분 10초",
      pagesPerSession: "5.2페이지",
      conversionRate: "6.5%",
    },
  },
  "demo-proj-003": {
    totalScore: 71,
    evaluationCriteria: [
      {
        category: "첫인상",
        score: 68,
        weight: 25,
        description: "사이트의 첫인상과 로딩 속도를 평가합니다",
        methodology: "LCP, FID, CLS 등 Core Web Vitals 측정",
        subcriteria: [],
      },
      {
        category: "이탈 방지",
        score: 75,
        weight: 20,
        description: "사용자의 이탈을 방지하는 요소를 평가합니다",
        methodology: "CTA 배치, 네비게이션 구조 분석",
        subcriteria: [],
      },
      {
        category: "모바일 경험",
        score: 78,
        weight: 20,
        description: "모바일 환경에서의 사용성을 평가합니다",
        methodology: "반응형 디자인, 터치 인터랙션 분석",
        subcriteria: [],
      },
      {
        category: "체류 유도",
        score: 70,
        weight: 15,
        description: "사용자의 체류 시간을 늘리는 요소를 평가합니다",
        methodology: "콘텐츠 품질, 인게이지먼트 요소 분석",
        subcriteria: [],
      },
      {
        category: "접근성",
        score: 62,
        weight: 10,
        description: "웹 접근성 준수 여부를 평가합니다",
        methodology: "WCAG 2.1 기준 자동화 테스트",
        subcriteria: [],
      },
      {
        category: "SEO",
        score: 72,
        weight: 10,
        description: "검색 엔진 최적화 수준을 평가합니다",
        methodology: "메타 태그, 구조화 데이터 분석",
        subcriteria: [],
      },
    ],
    improvements: [
      {
        id: "imp-009",
        category: "첫인상",
        title: "상품 이미지 로딩 속도 최적화",
        priority: "critical" as const,
        currentState: "평균 5.2초 로딩, 대용량 원본 이미지 사용",
        targetState: "2초 이내 로딩, CDN + 이미지 최적화 적용",
        impact: "페이지 로딩 속도 60% 개선, 첫 구매 전환율 증가",
        effort: "Medium" as const,
        status: "fail" as const,
        impactOnRetention: "빠른 로딩으로 첫 방문자의 재방문율 증가",
        impactOnBounceRate: "이탈률 58% → 38% 예상",
      },
      {
        id: "imp-010",
        category: "이탈 방지",
        title: "장바구니 이탈 방지 팝업",
        priority: "high" as const,
        currentState: "장바구니 추가 후 82%가 구매 없이 이탈",
        targetState: "Exit Intent 감지 시 할인 쿠폰 제공 팝업",
        impact: "장바구니 이탈률 82% → 58%로 감소, 매출 증가",
        effort: "Easy" as const,
        status: "fail" as const,
        impactOnRetention: "할인 혜택으로 재방문 유도",
        impactOnBounceRate: "구매 전환 증가로 전체 이탈률 감소",
      },
      {
        id: "imp-011",
        category: "접근성",
        title: "스크린 리더 지원 강화",
        priority: "medium" as const,
        currentState: "상품 정보가 이미지로만 제공, alt 텍스트 부재",
        targetState: "모든 상품에 대체 텍스트, ARIA 레이블 추가",
        impact: "시각 장애인 접근성 대폭 향상, 법적 리스크 감소",
        effort: "Medium" as const,
        status: "warning" as const,
        impactOnRetention: "접근성 개선으로 고객층 확대",
        impactOnBounceRate: "장애인 사용자 이탈 감소",
      },
      {
        id: "imp-012",
        category: "체류 유도",
        title: "실시간 재고 알림 및 타이머",
        priority: "high" as const,
        currentState: "재고 정보가 모호하게 표시",
        targetState: "실시간 재고 수량 표시 + 할인 종료 타이머",
        impact: "구매 긴박감 조성, 전환율 45% 증가 예상",
        effort: "Medium" as const,
        status: "warning" as const,
        impactOnRetention: "한정 상품 알림으로 재방문 유도",
        impactOnBounceRate: "구매 결정 시간 단축으로 이탈률 감소",
      },
    ],
    currentMetrics: {
      bounceRate: "58%",
      avgSessionTime: "2분 12초",
      pagesPerSession: "2.3페이지",
      conversionRate: "3.1%",
      mobileBounceRate: "62%",
    },
    industryBenchmark: {
      bounceRate: "45-55%",
      avgSessionTime: "3분 00초",
      pagesPerSession: "3.5페이지",
      conversionRate: "4.2%",
    },
    targetMetrics: {
      bounceRate: "38-42%",
      avgSessionTime: "4분 35초",
      pagesPerSession: "4.8페이지",
      conversionRate: "6.2%",
    },
  },
};

// 로컬스토리지에 데이터 저장
export function createSampleData() {
  try {
    // 사용자 데이터 저장
    localStorage.setItem(
      "protouchdesign:customUsers",
      JSON.stringify(sampleUsers)
    );
    console.log("✅ 샘플 사용자 생성 완료");

    // 프로젝트 데이터 저장
    localStorage.setItem(
      "protouchdesign:mockProjects",
      JSON.stringify(sampleProjects)
    );
    console.log("✅ 샘플 프로젝트 생성 완료");

    // 리포트 데이터 저장
    localStorage.setItem(
      "protouchdesign:mockReports",
      JSON.stringify(sampleReports)
    );
    console.log("✅ 샘플 리포트 생성 완료");

    console.log("\n📋 생성된 샘플 계정:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 일반 사용자:");
    console.log("   이메일: demo@protouchdesign.com");
    console.log("   비밀번호: demo1234");
    console.log("   플랜: Pro");
    console.log("\n🔧 관리자:");
    console.log("   이메일: admin@protouchdesign.com");
    console.log("   비밀번호: admin1234");
    console.log("   플랜: Enterprise");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ 페이지를 새로고침하고 위 계정으로 로그인하세요!");

    return {
      success: true,
      users: sampleUsers,
      projects: sampleProjects,
      reports: sampleReports,
    };
  } catch (error) {
    console.error("❌ 샘플 데이터 생성 실패:", error);
    return { success: false, error };
  }
}

// 브라우저 환경에서 자동 실행
if (typeof window !== "undefined") {
  (window as any).createSampleData = createSampleData;
  console.log("💡 브라우저 콘솔에서 createSampleData() 함수를 실행하세요!");
}
