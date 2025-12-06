import { GuidelinePromptContext } from "./types";

export function generateGuidelinePrompt({
  report,
  evaluationCriteria,
  improvements,
  totalScore,
}: GuidelinePromptContext): string {
  const designImprovements = improvements.filter(
    (item) => 
      item.category === "첫인상" || 
      item.category === "이탈 방지" || 
      item.category === "모바일 경험" || 
      item.category === "체류 유도" ||
      item.category === "접근성"
  );
  
  const criticalDesignItems = designImprovements.filter(
    (item) => item.priority === "critical"
  );
  const highPriorityDesignItems = designImprovements.filter(
    (item) => item.priority === "high"
  );

  return `# AI 디자인 개선 지침서 - ${report.url}

## 디자인 현황 분석

### 현재 UX 지표
- **이탈률**: ${report.currentMetrics.bounceRate} (업계 평균 ${
    report.industryBenchmark.bounceRate
  } 대비 +45%)
- **평균 체류 시간**: ${report.currentMetrics.avgSessionTime}
- **페이지/세션**: ${report.currentMetrics.pagesPerSession}
- **모바일 이탈률**: ${report.currentMetrics.mobileBounceRate}

### 디자인 개선 목표
- **이탈률**: ${report.targetMetrics.bounceRate} (-48% 개선)
- **평균 체류 시간**: ${report.targetMetrics.avgSessionTime} (+371% 개선)
- **페이지/세션**: ${report.targetMetrics.pagesPerSession} (+223% 개선)

---

## [Critical] 치명적 디자인 문제 (즉시 개선 필수)

${criticalDesignItems
  .map(
    (item, index) => `
### ${index + 1}. ${item.title}

**현재 상태**
${item.currentState}

**개선 방향**
${item.targetState}

**예상 효과**
- ${item.impact}
- 체류 시간: ${item.impactOnRetention}
- 이탈률 영향: ${item.impactOnBounceRate}

**작업 규모**: ${item.effort}
`
  )
  .join("\n---\n")}

## [Priority] 우선순위 디자인 개선 항목

${highPriorityDesignItems
  .map(
    (item, index) => `
### ${index + 1}. ${item.title}

**문제**: ${item.currentState}
**해결**: ${item.targetState}
**효과**: ${item.impact}
**난이도**: ${item.effort}
`
  )
  .join("\n")}

---

## AI 디자인 프롬프트

\`\`\`
${report.url}의 웹사이트를 다음과 같이 **디자인 개선**해주세요:

### 1단계: 첫인상 개선 (최우선 - 1주 이내)

#### 히어로 섹션 재설계
- **즉시 표시되는 헤드라인**:
  크기: 48-64px, 굵기: 700-800, 색상: #293241
  "{{핵심 가치를 한 문장으로}}"
  
- **명확한 가치 제안**:
  크기: 20-24px, 굵기: 400-500, 색상: #6B7280
  "{{우리가 해결하는 문제}}"
  
- **강력한 CTA 버튼**:
  크기: 최소 180x56px
  배경색: #EE6C4D (Primary Action)
  텍스트: "{{명확한 행동 유도}}" - 18px, 굵기 600, 색상 #FFFFFF
  호버 효과: 그림자 확대, 약간의 scale(1.05)
  
- **신뢰 요소 배치**:
  - 고객 로고 3-5개 (그레이스케일, 투명도 70%)
  - "X명이 사용 중" 배지
  - 별점 리뷰 위젯 (⭐⭐⭐⭐⭐ 4.8/5.0)

#### 시각적 계층 구조
- 헤드라인 → 부제목 → CTA → 신뢰 요소 순으로 시선 유도
- Z-패턴 또는 F-패턴 레이아웃 적용
- 충분한 여백 (섹션 간 80-120px)

#### 색상 시스템
- **Primary**: #293241 (진한 네이비) - 헤드라인, 중요 텍스트
- **Accent**: #EE6C4D (코랄 오렌지) - CTA, 강조 요소
- **Secondary**: #84A98C (세이지 그린) - 보조 버튼, 링크
- **Success**: #84A98C (세이지 그린) - 성공 메시지, 긍정적 지표
- **Neutral**: #F6F6F6 (라이트 그레이) - 배경, 카드

#### 타이포그래피
- **헤드라인**: Inter, Pretendard, 또는 Outfit (굵게, 높은 가독성)
- **본문**: Inter, Pretendard (Regular 400, Medium 500)
- **최소 크기**: 16px (모바일), 18px (데스크톱)
- **행간**: 1.6-1.8 (본문), 1.2-1.4 (헤드라인)

### 2단계: 네비게이션 \u0026 레이아웃 (1-2주)

#### 네비게이션 디자인
- **헤더 높이**: 64-80px
- **로고 크기**: 높이 32-40px
- **메뉴 항목**: 최대 5개, 16px, 굵기 500, 간격 32-40px
- **Sticky 네비게이션**: 스크롤 시 배경 불투명도 95%, 그림자 추가
- **모바일 메뉴**: 햄버거 아이콘 → 전체 화면 오버레이 또는 슬라이드 메뉴

#### 카드 디자인
- **배경**: #FFFFFF
- **테두리**: 1px solid #E5E7EB 또는 그림자만
- **그림자**: 0 4px 6px rgba(0, 0, 0, 0.05)
- **모서리**: border-radius 12-16px
- **패딩**: 24-32px
- **호버 효과**: 그림자 확대, 약간의 상승 효과

#### 그리드 시스템
- **컨테이너**: max-width 1280px, 중앙 정렬
- **여백**: 좌우 24px (모바일), 48px (데스크톱)
- **컬럼**: 12-column grid
- **간격**: 24px (모바일), 32px (데스크톱)

### 3단계: 모바일 최적화 (2-3주)

#### 터치 UI 디자인
- **버튼 크기**: 최소 44x44px (애플 권장), 48x48px (구글 권장)
- **터치 간격**: 최소 8px
- **엄지 도달 영역**: 중요 액션을 하단 1/3에 배치
- **스와이프 제스처**: 이미지 갤러리, 탭 전환에 활용

#### 모바일 폼 디자인
- **입력 필드 높이**: 최소 48px
- **폰트 크기**: 16px 이상 (자동 줌 방지)
- **레이블**: 입력 필드 위에 배치, 12-14px
- **에러 메시지**: 빨간색 (#EF4444), 입력 필드 아래 표시
- **진행 표시**: 단계별 프로그레스 바

#### 반응형 이미지
- **모바일**: 1x, 2x 해상도 제공
- **데스크톱**: 2x, 3x 해상도 제공
- **Aspect ratio**: 16:9 (히어로), 4:3 (카드), 1:1 (프로필)
- **Lazy loading**: 뷰포트 밖 이미지는 지연 로드

### 4단계: 인터랙션 \u0026 애니메이션 (3주)

#### 마이크로 인터랙션
- **버튼 호버**: 
  - 배경색 변화 (0.2s ease)
  - 그림자 확대 (0.3s ease)
  - 약간의 scale(1.02-1.05)
  
- **카드 호버**:
  - 그림자 강화 (0.3s ease)
  - 약간의 상승 효과 translateY(-4px)
  
- **링크 호버**:
  - 밑줄 애니메이션 (왼쪽에서 오른쪽)
  - 색상 변화 (0.2s ease)

#### 페이지 전환
- **로딩 상태**: 스켈레톤 UI 또는 스피너
- **콘텐츠 등장**: Fade in + Slide up (0.4s ease-out)
- **이미지 로드**: Progressive loading 또는 blur-up

#### 스크롤 애니메이션
- **Parallax**: 배경 이미지 느린 스크롤
- **Reveal on scroll**: 요소가 뷰포트에 들어올 때 fade in
- **Progress indicator**: 읽기 진행률 표시

### 5단계: 시각적 요소 (4주)

#### 아이콘 시스템
- **스타일**: Line icons (2px stroke) 또는 Filled icons
- **크기**: 20px (작은 아이콘), 24px (일반), 32px (큰 아이콘)
- **색상**: Primary 또는 Neutral-600
- **라이브러리**: Lucide, Heroicons, Phosphor

#### 일러스트레이션
- **스타일**: 브랜드 색상 기반 플랫 디자인 또는 3D
- **용도**: 빈 상태, 에러 페이지, 온보딩
- **크기**: 200-400px (모바일), 400-600px (데스크톱)

#### 이미지 처리
- **필터**: 약간의 채도 감소 (90-95%)로 통일감
- **오버레이**: 텍스트 가독성을 위한 그라데이션 오버레이
- **테두리**: border-radius 8-12px

### 6단계: 접근성 디자인 (병행 작업)

#### 색상 대비
- **일반 텍스트**: 최소 4.5:1 (WCAG AA)
- **큰 텍스트** (18px+): 최소 3:1
- **인터랙티브 요소**: 최소 3:1

#### 포커스 상태
- **아웃라인**: 2-3px solid, 색상 #3B82F6 (파란색)
- **오프셋**: 2-4px
- **모든 인터랙티브 요소에 적용**

#### 키보드 네비게이션
- **Tab 순서**: 논리적 순서 (위→아래, 왼쪽→오른쪽)
- **Skip to content**: 헤더 건너뛰기 링크
- **모달**: Esc로 닫기, 포커스 트랩

\`\`\`

---

## 디자인 체크리스트

${designImprovements
  .slice(0, 8)
  .map(
    (item, index) => `
### ${index + 1}. ${item.title}
- [ ] 디자인 시안 작성
- [ ] 사용자 피드백 수집
- [ ] 프로토타입 제작
- [ ] 개발팀 전달
- [ ] 구현 검증
`
  )
  .join("\n")}

---

## 디자인 시스템 요약

### 색상 팔레트
- **Primary**: #293241 (네이비)
- **Accent**: #EE6C4D (코랄)
- **Secondary**: #84A98C (세이지 그린)
- **Success**: #84A98C (그린)
- **Warning**: #F59E0B (앰버)
- **Error**: #EF4444 (레드)
- **Neutral-50**: #F9FAFB
- **Neutral-100**: #F3F4F6
- **Neutral-600**: #4B5563
- **Neutral-900**: #111827

### 타이포그래피 스케일
- **H1**: 48-64px, 굵기 700
- **H2**: 36-48px, 굵기 700
- **H3**: 28-36px, 굵기 600
- **H4**: 24-28px, 굵기 600
- **Body Large**: 18-20px, 굵기 400
- **Body**: 16-18px, 굵기 400
- **Small**: 14px, 굵기 400
- **Caption**: 12px, 굵기 400

### 간격 시스템
- **4px**: 아주 작은 간격
- **8px**: 작은 간격
- **16px**: 기본 간격
- **24px**: 중간 간격
- **32px**: 큰 간격
- **48px**: 섹션 간 간격
- **64px**: 주요 섹션 간 간격

### 그림자
- **Small**: 0 1px 2px rgba(0, 0, 0, 0.05)
- **Medium**: 0 4px 6px rgba(0, 0, 0, 0.05)
- **Large**: 0 10px 15px rgba(0, 0, 0, 0.1)
- **XL**: 0 20px 25px rgba(0, 0, 0, 0.15)

---

## 추가 지원

디자인 관련 추가 문의사항은 담당 전문가 ${report.analyst}에게 연락주세요.
`;
}
