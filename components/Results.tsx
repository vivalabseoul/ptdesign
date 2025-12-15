/* report page */

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { PaymentGate } from "./PaymentGate";
import { Navbar } from "./Navbar";
import { SectionNav } from "./SectionNav";
import { useSubscription } from "../hooks/useSubscription";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

export interface AnalysisResult {
  url: string;
  siteName: string;
  siteAddress?: string;
  analysisDate: string;
  authorName: string;
  authorContact: string;
  screenshotUrl?: string; // 사이트 스크린샷 URL
  improvedDesignUrls?: Array<{
    issueId: string;
    issueTitle: string;
    imageUrl: string;
    description: string;
  }>; // 개선된 디자인 이미지 URLs
  issues: Array<{
    category: string;
    severity: "high" | "medium" | "low";
    title: string;
    description: string;
    recommendation: string;
    visualExample?: {
      type: "color" | "spacing" | "size";
      before?: string;
      after?: string;
    };
    improvedDesignUrl?: string; // 해당 이슈의 개선된 디자인 이미지 URL
  }>;
  score: {
    overall: number;
    usability: number;
    accessibility: number;
    visual: number;
    performance: number;
    seo?: number;
  };
  seo?: {
    score: number;
    metaTags: {
      title: boolean;
      description: boolean;
      keywords: boolean;
      ogTags: boolean;
    };
    headings: {
      h1Count: number;
      h1Structure: "good" | "warning" | "poor";
      headingHierarchy: "good" | "warning" | "poor";
    };
    images: {
      totalImages: number;
      imagesWithAlt: number;
      altTagCoverage: number;
    };
    links: {
      internalLinks: number;
      externalLinks: number;
      brokenLinks: number;
    };
    performance: {
      pageSpeed: number;
      mobileFriendly: boolean;
      coreWebVitals: {
        lcp: number; // Largest Contentful Paint
        fid: number; // First Input Delay
        cls: number; // Cumulative Layout Shift
      };
    };
    structuredData: {
      hasSchema: boolean;
      schemaTypes: string[];
    };
    issues: Array<{
      type: string;
      severity: "high" | "medium" | "low";
      title: string;
      description: string;
      recommendation: string;
    }>;
  };
}

interface ResultsProps {
  result: AnalysisResult;
  onReset: () => void;
  onBackToList?: () => void;
  returnTo?: string;
}

export function Results({
  result,
  onReset,
  onBackToList,
  returnTo,
}: ResultsProps) {
  const { isPaid } = useSubscription();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const getSeverityColor = (severity: string) => {
    const colors = {
      high: "bg-red-50 text-red-900 border-red-200",
      medium: "bg-orange-50 text-orange-900 border-orange-200",
      low: "bg-gray-50 text-gray-900 border-gray-200",
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getSeverityLabel = (severity: string) => {
    const labels = { high: "높음", medium: "중간", low: "낮음" };
    return labels[severity as keyof typeof labels] || severity;
  };

  const getScoreColor = (score: number) =>
    score >= 60 ? "text-orange-500" : "text-red-600";

  const getScoreBarColor = (score: number) =>
    score >= 60 ? "bg-orange-500" : "bg-red-600";

  const getScoreRank = (score: number) => {
    if (score >= 90)
      return { rank: "S", label: "최상위 10%", percentile: "상위 10%" };
    if (score >= 80)
      return { rank: "A", label: "상위 20%", percentile: "상위 20%" };
    if (score >= 70)
      return { rank: "B", label: "상위 40%", percentile: "상위 40%" };
    if (score >= 60)
      return { rank: "C", label: "중간 수준", percentile: "상위 60%" };
    if (score >= 50)
      return { rank: "D", label: "하위 40%", percentile: "하위 40%" };
    return { rank: "F", label: "하위 20%", percentile: "하위 20%" };
  };

  const downloadPDFReport = async () => {
    const severityLabel = (severity: string) => {
      const labels: { [key: string]: string } = {
        high: "높음",
        medium: "중간",
        low: "낮음",
      };
      return labels[severity] || severity;
    };

    const rank = getScoreRank(result.score.overall);

    // 막대그래프 SVG 생성
    const createBarChart = () => {
      const scores = [
        { label: "사용성", score: result.score.usability },
        { label: "접근성", score: result.score.accessibility },
        { label: "시각", score: result.score.visual },
        { label: "성능", score: result.score.performance },
      ];

      const barHeight = 40;
      const gap = 20;
      const totalHeight = scores.length * (barHeight + gap);

      return `
        <svg width="100%" height="${totalHeight}" style="margin: 20px 0;">
          ${scores
            .map((item, i) => {
              const y = i * (barHeight + gap);
              const barWidth = item.score;
              const color = item.score >= 60 ? "#f97316" : "#dc2626";
              return `
              <g>
                <text x="0" y="${
                  y + 25
                }" style="font-size: 14px; fill: #000;">${item.label}</text>
                <rect x="100" y="${y}" width="${
                barWidth * 4
              }" height="${barHeight}" fill="${color}" opacity="0.2"/>
                <rect x="100" y="${y}" width="${
                barWidth * 4
              }" height="${barHeight}" fill="${color}" opacity="0.8"/>
                <text x="${100 + barWidth * 4 + 10}" y="${
                y + 25
              }" style="font-size: 16px; font-weight: 700; fill: ${color};">${
                item.score
              }</text>
              </g>
            `;
            })
            .join("")}
        </svg>
      `;
    };

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #000; line-height: 1.6; font-size:16px; }
    h1 { color: #f97316; border-left: 4px solid #f97316; padding-left: 16px; font-weight: 700; font-size:28px; margin-bottom:10px; }
    h2 { margin-top: 40px; color: #000; font-weight: 700; font-size: 22px; border-bottom: 2px solid #000; padding-bottom: 10px; }
    h3 { color: #f97316; font-weight: 700; font-size: 18px; margin-top: 30px; }
    .header { margin-bottom: 40px; border-bottom: 3px solid #f97316; padding-bottom: 20px; }
    .meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; font-size: 14px; }
    .meta-label { color: #6b7280; }
    .meta-value { font-weight: 600; }
    .score-section { margin: 40px 0; padding: 30px; border: 3px solid #000; background: #fafafa; }
    .overall-score { text-align: center; margin-bottom: 30px; }
    .overall-score .number { font-size: 72px; font-weight: 900; color: ${
      result.score.overall >= 60 ? "#f97316" : "#dc2626"
    }; }
    .rank-badge { display: inline-block; padding: 8px 24px; background: #000; color: #fff; font-size: 24px; font-weight: 700; margin: 10px 0; }
    .percentile { color: #6b7280; font-size: 16px; }
    .score-item { margin: 20px 0; padding: 15px; border-left: 4px solid #f97316; background: white; }
    .issue { margin: 30px 0; padding: 25px; border: 2px solid #e5e7eb; page-break-inside: avoid; background: white; }
    .issue-title { font-weight: 700; font-size: 18px; margin-bottom: 15px; color: #000; }
    .severity { display: inline-block; padding: 6px 16px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-right: 10px; }
    .severity-high { background: #fef2f2; color: #991b1b; border: 2px solid #dc2626; }
    .severity-medium { background: #fff7ed; color: #9a3412; border: 2px solid #f97316; }
    .severity-low { background: #f9fafb; color: #1f2937; border: 2px solid #6b7280; }
    .category-badge { display: inline-block; padding: 6px 16px; background: #000; color: #fff; font-size: 12px; font-weight: 600; }
    .recommendation { background: #fff7ed; border-left: 6px solid #f97316; padding: 20px; margin-top: 15px; }
    .visual-example { margin-top: 15px; padding: 20px; background: #f9fafb; border: 2px dashed #d1d5db; }
    .color-box { display: inline-block; width: 80px; height: 80px; border: 2px solid #000; margin: 10px; vertical-align: middle; }
    .color-label { display: block; text-align: center; margin-top: 5px; font-size: 11px; font-weight: 700; }
    .arrow { display: inline-block; margin: 0 15px; font-size: 24px; color: #f97316; vertical-align: middle; }
    .criteria { background: #fafafa; padding: 25px; margin: 30px 0; border-left: 4px solid #000; }
    .criteria-item { margin: 15px 0; padding: 15px; background: white; border: 1px solid #e5e7eb; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #000; color: #6b7280; font-size: 12px; }
    .brand { color: #f97316; font-weight: 700; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>
  <div class="header">
    <h1>UI/UX 디자인 분석 보고서</h1>
    <div class="meta-info">
      <div><span class="meta-label">사이트명</span><br/><span class="meta-value">${
        result.siteName
      }</span></div>
      <div><span class="meta-label">사이트 주소</span><br/><span class="meta-value">${
        result.siteAddress
      }</span></div>
      <div><span class="meta-label">분석 URL</span><br/><span class="meta-value">${
        result.url
      }</span></div>
      <div><span class="meta-label">분석일</span><br/><span class="meta-value">${new Date(
        result.analysisDate
      ).toLocaleDateString("ko-KR")}</span></div>
      <div><span class="meta-label">작성자</span><br/><span class="meta-value">${
        result.authorName
      }</span></div>
      <div><span class="meta-label">연락처</span><br/><span class="meta-value">${
        result.authorContact
      }</span></div>
    </div>
  </div>

  <div class="score-section">
    <div class="overall-score">
      <div class="number">${result.score.overall}</div>
      <div class="rank-badge">${rank.rank} 등급</div>
      <div class="percentile">${rank.percentile} · ${rank.label}</div>
    </div>

    <h3>세부 점수 분포</h3>
    ${createBarChart()}
  </div>

  <div class="page-break"></div>

  <div class="criteria">
    <h2>분석 기준 및 평가 방법</h2>
    
    <div class="criteria-item">
      <strong>1. 사용성 (Usability)</strong>
      <p>사용자가 목표를 얼마나 효율적이고 직관적으로 달성할 수 있는지 평가합니다.</p>
      <ul>
        <li>내비게이션의 명확성과 일관성</li>
        <li>CTA(Call To Action) 버튼의 가시성과 배치</li>
        <li>모바일 터치 영역 크기 (최소 44x44px 권장)</li>
        <li>폼 입력의 편의성과 에러 처리</li>
      </ul>
    </div>

    <div class="criteria-item">
      <strong>2. 접근성 (Accessibility)</strong>
      <p>모든 사용자가 콘텐츠에 접근하고 사용할 수 있는지 평가합니다. WCAG 2.1 기준을 따릅니다.</p>
      <ul>
        <li>색상 대비율 (텍스트 4.5:1, 대형 텍스트 3:1 이상)</li>
        <li>키보드 네비게이션 지원</li>
        <li>스크린 리더 호환성 (ARIA 레이블)</li>
        <li>대체 텍스트 및 텍스트 확대 가능 여부</li>
      </ul>
    </div>

    <div class="criteria-item">
      <strong>3. 시각 디자인 (Visual Design)</strong>
      <p>시각적 일관성과 미적 완성도를 평가합니다.</p>
      <ul>
        <li>타이포그래피 일관성 (폰트 크기, 행간, 위계)</li>
        <li>여백 시스템 (8px 기반 그리드 권장)</li>
        <li>색상 팔레트의 조화와 일관성</li>
        <li>시각적 위계 및 정보 구조</li>
      </ul>
    </div>

    <div class="criteria-item">
      <strong>4. 성능 (Performance)</strong>
      <p>페이지 로딩 속도와 사용자 경험에 영향을 주는 기술적 요소를 평가합니다.</p>
      <ul>
        <li>이미지 최적화 (WebP, lazy loading)</li>
        <li>CSS/JavaScript 번들 크기</li>
        <li>렌더링 성능 및 애니메이션 프레임</li>
        <li>모바일 최적화</li>
      </ul>
    </div>

    <div class="criteria-item">
      <strong>등급 기준</strong>
      <p>S등급(90-100): 최상위 10% · A등급(80-89): 상위 20% · B등급(70-79): 상위 40% · C등급(60-69): 중간 수준 · D등급(50-59): 하위 40% · F등급(0-49): 하위 20%</p>
    </div>
  </div>

  <div class="page-break"></div>

  <h2>발견된 문제점 및 개선 방안 (${result.issues.length}개)</h2>
  ${result.issues
    .map(
      (issue, index) => `
    <div class="issue">
      <div>
        <span class="category-badge">${issue.category}</span>
        <span class="severity severity-${issue.severity}">${severityLabel(
        issue.severity
      )}</span>
      </div>
      <div class="issue-title">${index + 1}. ${issue.title}</div>
      <p><strong>문제 상황:</strong> ${issue.description}</p>
      <div class="recommendation">
        <p><strong>개선 방안:</strong> ${issue.recommendation}</p>
      </div>
      ${
        issue.visualExample
          ? `
        <div class="visual-example">
          <p><strong>시각적 예시:</strong></p>
          ${
            issue.visualExample.type === "color"
              ? `
            <div style="margin-top: 10px;">
              <div style="display: inline-block; text-align: center;">
                <div class="color-box" style="background-color: ${issue.visualExample.before};"></div>
                <div class="color-label">변경 전<br/>${issue.visualExample.before}</div>
              </div>
              <span class="arrow">→</span>
              <div style="display: inline-block; text-align: center;">
                <div class="color-box" style="background-color: ${issue.visualExample.after};"></div>
                <div class="color-label">변경 후<br/>${issue.visualExample.after}</div>
              </div>
            </div>
          `
              : issue.visualExample.type === "spacing"
              ? `
            <p>변경 전: ${issue.visualExample.before}</p>
            <p>변경 후: ${issue.visualExample.after}</p>
          `
              : issue.visualExample.type === "size"
              ? `
            <p>변경 전: ${issue.visualExample.before}</p>
            <p>변경 후: ${issue.visualExample.after}</p>
          `
              : ""
          }
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("")}

  <div class="footer">
    <p><strong>분석 제공:</strong> <span class="brand">Pro</span> Touch Design · AI 기반 UI/UX 자동 분석 서비스</p>
    <p><strong>작성자:</strong> ${result.authorName} (${
      result.authorContact
    })</p>
    <p style="margin-top: 10px; color: #9ca3af;">본 보고서는 AI 분석을 기반으로 작성되었습니다. 실제 개선 작업 시 전문가의 검토를 권장합니다.</p>
  </div>
</body>
</html>
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = pdfContent;

    try {
      // 동적으로 html2pdf.js import
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 15,
        filename: `ProTouch-분석보고서-${result.siteName}-${Date.now()}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          ignoreElements: (element: HTMLElement) => {
            // 네비게이션 영역 제외
            return (
              element.classList.contains("no-print") ||
              element.closest(".no-print") !== null
            );
          },
        },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      html2pdf().set(opt).from(tempDiv).save();
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  const downloadAIGuideline = () => {
    const severityLabel = (severity: string) => {
      const labels: { [key: string]: string } = {
        high: "높음",
        medium: "중간",
        low: "낮음",
      };
      return labels[severity] || severity;
    };

    const rank = getScoreRank(result.score.overall);

    // SEO 데이터 준비
    const seoData = result.seo || {
      score: Math.round(
        (result.score.performance + result.score.accessibility) / 2
      ),
      metaTags: {
        title: true,
        description: true,
        keywords: false,
        ogTags: true,
      },
      headings: {
        h1Count: 1,
        h1Structure: "good" as const,
        headingHierarchy: "good" as const,
      },
      images: { totalImages: 10, imagesWithAlt: 8, altTagCoverage: 80 },
      links: { internalLinks: 20, externalLinks: 5, brokenLinks: 0 },
      performance: {
        pageSpeed: result.score.performance,
        mobileFriendly: true,
        coreWebVitals: { lcp: 2.5, fid: 100, cls: 0.1 },
      },
      structuredData: { hasSchema: false, schemaTypes: [] },
      issues: [],
    };

    // 심각도별 이슈 분류
    const highSeverityIssues = result.issues.filter(
      (i) => i.severity === "high"
    );
    const mediumSeverityIssues = result.issues.filter(
      (i) => i.severity === "medium"
    );
    const lowSeverityIssues = result.issues.filter((i) => i.severity === "low");

    // 카테고리별 이슈 분류
    const categoryCount: { [key: string]: number } = {};
    result.issues.forEach((issue) => {
      categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
    });

    // 점수 해석
    const getScoreInterpretation = (score: number, category: string) => {
      if (score >= 90)
        return `${category} 점수가 매우 우수합니다. 현재 상태를 유지하면서 세부 개선에 집중하세요.`;
      if (score >= 80)
        return `${category} 점수가 우수합니다. 몇 가지 개선 사항을 적용하면 더욱 향상될 수 있습니다.`;
      if (score >= 70)
        return `${category} 점수가 양호합니다. 주요 개선 사항을 적용하여 점수를 향상시키세요.`;
      if (score >= 60)
        return `${category} 점수가 보통 수준입니다. 즉시 개선이 필요한 항목들을 우선적으로 처리하세요.`;
      if (score >= 50)
        return `${category} 점수가 미흡합니다. 전면적인 개선 작업이 필요합니다.`;
      return `${category} 점수가 매우 낮습니다. 긴급한 개선 작업이 필요하며, 전문가의 도움을 고려하세요.`;
    };

    const guidelines = `# UI/UX 개선 작업 지침서

## 프로젝트 정보
- **사이트명:** ${result.siteName}
- **사이트 주소:** ${result.siteAddress || result.url}
- **분석 URL:** ${result.url}
- **분석일:** ${new Date(result.analysisDate).toLocaleDateString("ko-KR")}
- **작성자:** ${result.authorName} (${result.authorContact})

---

## 종합 평가 및 점수 해석

### 전체 점수
- **종합 점수:** ${result.score.overall}/100 (${rank.rank}등급 - ${
      rank.percentile
    })
- **평가:** ${
      result.score.overall >= 90
        ? "매우 우수 - 최상위 10%에 해당하는 수준입니다."
        : result.score.overall >= 80
        ? "우수 - 상위 20%에 해당하는 수준입니다."
        : result.score.overall >= 70
        ? "양호 - 상위 40%에 해당하는 수준입니다."
        : result.score.overall >= 60
        ? "보통 - 중간 수준으로 개선 여지가 있습니다."
        : result.score.overall >= 50
        ? "미흡 - 개선이 필요한 수준입니다."
        : "불량 - 전면적인 개선이 필요합니다."
    }

### 세부 점수 및 해석

#### 1. 사용성 (Usability): ${result.score.usability}/100
${getScoreInterpretation(result.score.usability, "사용성")}

**주요 평가 항목:**
- 내비게이션 구조의 명확성
- CTA(Call To Action) 버튼의 가시성 및 배치
- 모바일 터치 영역 크기 (최소 44x44px 권장)
- 폼 입력의 편의성 및 에러 처리
- 정보 구조 및 사용자 플로우

**개선 방향:**
${
  result.score.usability < 70
    ? "- 내비게이션 메뉴 구조를 단순화하고 일관성 있게 개선\n- 주요 CTA 버튼의 크기와 색상을 강조\n- 모바일 환경에서 터치 영역을 확대 (최소 44x44px)\n- 폼 입력 시 실시간 유효성 검사 및 명확한 에러 메시지 제공\n- 사용자 여정(User Journey) 최적화"
    : "- 현재 사용성이 양호한 수준입니다. 세부 개선에 집중하세요.\n- A/B 테스트를 통한 CTA 버튼 최적화\n- 사용자 피드백 수집 및 반영"
}

#### 2. 접근성 (Accessibility): ${result.score.accessibility}/100
${getScoreInterpretation(result.score.accessibility, "접근성")}

**주요 평가 항목:**
- WCAG 2.1 준수 여부 (AA 수준 권장)
- 색상 대비율 (텍스트 4.5:1, 대형 텍스트 3:1 이상)
- 키보드 네비게이션 지원
- 스크린 리더 호환성 (ARIA 레이블)
- 대체 텍스트 제공

**개선 방향:**
${
  result.score.accessibility < 70
    ? "- 모든 텍스트의 색상 대비율을 4.5:1 이상으로 조정\n- 키보드만으로 모든 기능에 접근 가능하도록 구현\n- 모든 이미지에 적절한 alt 텍스트 추가\n- ARIA 레이블 및 역할 속성 추가\n- 포커스 인디케이터 명확하게 표시"
    : "- 현재 접근성이 양호한 수준입니다. WCAG AAA 수준을 목표로 하세요.\n- 스크린 리더 테스트를 정기적으로 수행\n- 키보드 네비게이션 최적화"
}

#### 3. 시각 디자인 (Visual Design): ${result.score.visual}/100
${getScoreInterpretation(result.score.visual, "시각 디자인")}

**주요 평가 항목:**
- 타이포그래피 일관성 (폰트 크기, 행간, 위계)
- 여백 시스템 (8px 기반 그리드 권장)
- 색상 팔레트의 조화 및 일관성
- 시각적 위계 및 정보 구조
- 아이콘 및 이미지 품질

**개선 방향:**
${
  result.score.visual < 70
    ? "- 타이포그래피 스케일을 체계화 (예: 12px, 14px, 16px, 20px, 24px, 32px)\n- 8px 기반 그리드 시스템 적용\n- 색상 팔레트를 제한하고 일관성 있게 사용\n- 시각적 위계를 명확히 하여 정보 전달력 향상\n- 아이콘 스타일 통일"
    : "- 현재 시각 디자인이 양호한 수준입니다. 브랜드 아이덴티티 강화에 집중하세요.\n- 마이크로 인터랙션 추가\n- 애니메이션 및 전환 효과 최적화"
}

#### 4. 성능 (Performance): ${result.score.performance}/100
${getScoreInterpretation(result.score.performance, "성능")}

**주요 평가 항목:**
- 이미지 최적화 (WebP, lazy loading)
- CSS/JavaScript 번들 크기
- 렌더링 성능 (FCP, LCP)
- 모바일 최적화
- 로딩 시간

**개선 방향:**
${
  result.score.performance < 70
    ? "- 이미지를 WebP 형식으로 변환 및 최적화\n- 이미지 lazy loading 구현\n- CSS/JavaScript 번들 크기 최적화 (코드 스플리팅)\n- 불필요한 라이브러리 제거\n- CDN 활용 및 캐싱 전략 수립\n- 모바일 최적화 (반응형 이미지, 터치 최적화)"
    : "- 현재 성능이 양호한 수준입니다. 지속적인 모니터링이 필요합니다.\n- Core Web Vitals 최적화\n- Progressive Web App (PWA) 구현 고려"
}

#### 5. SEO (Search Engine Optimization): ${seoData.score}/100
${getScoreInterpretation(seoData.score, "SEO")}

**주요 평가 항목:**
- 메타 태그 (Title, Description, OG Tags)
- 헤딩 구조 (H1-H6)
- 이미지 Alt 태그
- 내부/외부 링크 구조
- 구조화된 데이터 (Schema.org)
- Core Web Vitals

**현재 상태:**
- **메타 태그:** ${
      seoData.metaTags.title ? "✓ Title 태그 있음" : "✗ Title 태그 없음"
    } / ${
      seoData.metaTags.description
        ? "✓ Description 태그 있음"
        : "✗ Description 태그 없음"
    } / ${seoData.metaTags.ogTags ? "✓ OG 태그 있음" : "✗ OG 태그 없음"}
- **헤딩 구조:** H1 태그 ${seoData.headings.h1Count}개 / 구조 ${
      seoData.headings.h1Structure === "good"
        ? "양호"
        : seoData.headings.h1Structure === "warning"
        ? "주의 필요"
        : "개선 필요"
    }
- **이미지:** 전체 ${seoData.images.totalImages}개 / Alt 태그 ${
      seoData.images.imagesWithAlt
    }개 (${seoData.images.altTagCoverage}%)
- **링크:** 내부 ${seoData.links.internalLinks}개 / 외부 ${
      seoData.links.externalLinks
    }개 / 깨진 링크 ${seoData.links.brokenLinks}개
- **Core Web Vitals:** LCP ${seoData.performance.coreWebVitals.lcp.toFixed(
      2
    )}s / FID ${seoData.performance.coreWebVitals.fid.toFixed(
      0
    )}ms / CLS ${seoData.performance.coreWebVitals.cls.toFixed(2)}
- **구조화된 데이터:** ${seoData.structuredData.hasSchema ? "✓ 있음" : "✗ 없음"}

**개선 방향:**
${
  seoData.score < 70
    ? "- 모든 페이지에 고유한 Title과 Description 메타 태그 추가\n- H1 태그를 페이지당 1개만 사용하고, 헤딩 계층 구조 개선\n- 모든 이미지에 설명적인 Alt 텍스트 추가\n- 내부 링크 구조 개선 및 깨진 링크 수정\n- 구조화된 데이터 (Schema.org) 추가\n- Core Web Vitals 최적화 (LCP < 2.5s, FID < 100ms, CLS < 0.1)"
    : "- 현재 SEO가 양호한 수준입니다. 고급 SEO 기법을 적용하세요.\n- 구조화된 데이터 확대\n- 사이트맵 및 robots.txt 최적화\n- 다국어 SEO 고려"
}

---

## 발견된 문제점 및 상세 개선 지침 (${result.issues.length}개)

### 우선순위별 개선 로드맵

#### 🔴 긴급 (높은 심각도) - ${highSeverityIssues.length}개
${
  highSeverityIssues.length > 0
    ? "즉시 개선이 필요한 항목입니다. 사용자 경험에 직접적인 영향을 미칩니다."
    : "높은 심각도의 이슈가 없습니다. 중간 심각도 이슈부터 개선하세요."
}

#### 🟡 중요 (중간 심각도) - ${mediumSeverityIssues.length}개
${
  mediumSeverityIssues.length > 0
    ? "단계적으로 개선해야 할 항목입니다. 사용자 경험 향상에 도움이 됩니다."
    : "중간 심각도의 이슈가 없습니다."
}

#### 🟢 참고 (낮은 심각도) - ${lowSeverityIssues.length}개
${
  lowSeverityIssues.length > 0
    ? "여유가 있을 때 개선하면 좋은 항목입니다."
    : "낮은 심각도의 이슈가 없습니다."
}

### 카테고리별 이슈 분포
${Object.entries(categoryCount)
  .map(([category, count]) => `- **${category}:** ${count}개`)
  .join("\n")}

---

## 상세 개선 지침

${result.issues
  .map(
    (issue, index) => `
### ${index + 1}. ${issue.title}

**카테고리:** ${issue.category}  
**심각도:** ${severityLabel(issue.severity)} ${
      issue.severity === "high"
        ? "🔴"
        : issue.severity === "medium"
        ? "🟡"
        : "🟢"
    }  
**우선순위:** ${
      issue.severity === "high"
        ? "긴급 - 즉시 개선 필요"
        : issue.severity === "medium"
        ? "중요 - 단계적 개선"
        : "참고 - 여유 있을 때 개선"
    }

#### 문제 상황
${issue.description}

#### 개선 방안
${issue.recommendation}

${
  issue.visualExample
    ? `#### 시각적 예시
${
  issue.visualExample.type === "color"
    ? `**색상 변경:**
- 변경 전: \`${issue.visualExample.before}\`
- 변경 후: \`${issue.visualExample.after}\`
- 적용 방법: CSS에서 해당 색상 값을 \`${issue.visualExample.after}\`로 변경하고, 대비율이 4.5:1 이상인지 확인하세요.`
    : issue.visualExample.type === "spacing"
    ? `**여백 변경:**
- 변경 전: \`${issue.visualExample.before}\`
- 변경 후: \`${issue.visualExample.after}\`
- 적용 방법: CSS에서 padding 또는 margin 값을 \`${issue.visualExample.after}\`로 변경하세요. 8px 그리드 시스템을 따르는 것이 좋습니다.`
    : issue.visualExample.type === "size"
    ? `**크기 변경:**
- 변경 전: \`${issue.visualExample.before}\`
- 변경 후: \`${issue.visualExample.after}\`
- 적용 방법: CSS에서 font-size, width, height 등의 값을 \`${issue.visualExample.after}\`로 변경하세요.`
    : ""
}`
    : ""
}

${
  issue.improvedDesignUrl
    ? `#### 개선된 디자인 제안
AI가 생성한 개선된 디자인 이미지가 있습니다. 참고하여 구현하세요.
- 이미지 URL: ${issue.improvedDesignUrl}`
    : ""
}

#### 구현 단계
1. **현재 상태 분석**
   - 문제가 발생하는 위치와 원인을 정확히 파악하세요.
   - 브라우저 개발자 도구를 사용하여 현재 CSS 속성을 확인하세요.

2. **개선 방안 적용**
   - 위 개선 방안에 따라 코드를 수정하세요.
   - ${
     issue.visualExample
       ? `구체적인 값: \`${issue.visualExample.after}\``
       : "관련된 모든 요소를 일관성 있게 수정하세요."
   }

3. **테스트**
   - 다양한 브라우저와 디바이스에서 테스트하세요.
   - 접근성 도구를 사용하여 개선 사항을 검증하세요.

4. **검증**
   - 변경 사항이 사용자 경험에 긍정적인 영향을 미치는지 확인하세요.
   - 성능에 부정적인 영향을 미치지 않는지 확인하세요.

#### 예상 효과
- 사용자 경험 향상
- 접근성 개선
- 성능 최적화
- SEO 개선 (해당되는 경우)

#### AI 작업 지시
\`\`\`
위 개선 방안을 코드에 적용해주세요.

구체적인 작업:
1. ${issue.category} 카테고리의 "${issue.title}" 문제를 해결하세요.
2. ${issue.description}
3. ${issue.recommendation}
${
  issue.visualExample
    ? `4. ${
        issue.visualExample.type === "color"
          ? "색상"
          : issue.visualExample.type === "spacing"
          ? "여백"
          : "크기"
      } 값을 \`${issue.visualExample.after}\`로 변경하세요.`
    : ""
}

**중요: 디자인 시스템 규칙 준수**
5. **색상 시스템:** 다음 4개 컬러만 사용하세요.
   - 메인 컬러: \`#ff6b35\` (오렌지) - 포인트 컬러로 사용
   - 서브 컬러: \`#f5f5f5\` (라이트 그레이) - 서브 배경으로 사용
   - 블랙: \`#000000\` 또는 \`#171717\` (다크 그레이) - 강조 텍스트로 사용
   - 화이트: \`#ffffff\` 또는 \`#fafafa\` (라이트 그레이) - 기본 배경으로 사용
   - 다른 색상(빨강, 파랑, 초록 등)은 절대 사용하지 마세요.
   - 그라데이션이 필요한 경우 위 4개 컬러의 명도 차이로만 구성하세요.
   - 예: 메인 컬러 그라데이션 (\`rgba(255, 107, 53, 0.2)\` → \`rgba(255, 107, 53, 0.8)\`)
   - 예: 블랙 그라데이션 (\`#333333\` → \`#000000\`)
   - 예: 화이트 그라데이션 (\`#ffffff\` → \`#f5f5f5\`)

6. **텍스트 색상:** 다음 색상만 사용하세요.
   - 기본 텍스트: \`#666666\` (그레이)
   - 강조 텍스트: \`#000000\` (블랙)
   - 배경 텍스트: \`#ffffff\` (화이트)
   - 포인트 텍스트: \`#ff6b35\` (메인 컬러)

7. **폰트 사이즈:** 반응형 폰트 사이즈 시스템을 적용하세요.
   - 모바일: 기본 14px, 제목 20px-40px
   - 태블릿: 기본 16px, 제목 24px-48px
   - 데스크톱: 기본 18px, 제목 28px-64px
   - 모든 텍스트에 적절한 폰트 사이즈를 적용하세요.

8. **텍스트 정렬:** 일관된 정렬을 적용하세요.
   - 제목: 왼쪽 정렬 (\`text-left\`) 또는 중앙 정렬 (\`text-center\`)
   - 본문: 왼쪽 정렬 (\`text-left\`)
   - 버튼: 중앙 정렬 (\`text-center\`)
   - 카드 제목: 왼쪽 정렬 (\`text-left\`)
   - 카드 본문: 왼쪽 정렬 (\`text-left\`)

9. 관련된 CSS/디자인 시스템도 함께 업데이트하세요.
10. 접근성 가이드라인(WCAG 2.1)을 준수해야 합니다.
11. 변경 사항이 다른 부분에 영향을 미치지 않는지 확인하세요.
12. 반응형 디자인을 고려하여 모바일, 태블릿, 데스크톱에서 모두 잘 작동하는지 확인하세요.
13. 코드 변경 후 테스트를 수행하고, 필요시 수정하세요.

코드 변경 시 다음을 포함해주세요:
- 변경 전 코드
- 변경 후 코드
- 변경 이유
- 폰트 사이즈 및 정렬 적용 내역
- 색상 시스템 준수 내역 (4개 컬러만 사용)
- 테스트 결과
\`\`\`

---
`
  )
  .join("\n")}

${
  seoData.issues && seoData.issues.length > 0
    ? `## SEO 개선 사항

${seoData.issues
  .map(
    (issue, index) => `
### ${index + 1}. ${issue.title}

**심각도:** ${severityLabel(issue.severity)}  
**타입:** ${issue.type}

#### 문제 상황
${issue.description}

#### 개선 방안
${issue.recommendation}

#### 구현 가이드
1. SEO 도구를 사용하여 현재 상태를 확인하세요.
2. 위 개선 방안에 따라 메타 태그, 헤딩 구조, 이미지 등을 수정하세요.
3. Google Search Console을 사용하여 개선 사항을 검증하세요.

---
`
  )
  .join("\n")}`
    : ""
}

## 디자인 시스템 가이드

### 🎨 색상 시스템 (4개 컬러만 사용)

**중요:** 다음 4개 컬러만 사용할 수 있습니다. 다른 컬러는 절대 사용하지 마세요.

#### 기본 컬러 팔레트
- **메인 컬러 (Primary):** \`#ff6b35\` (오렌지)
- **서브 컬러 (Secondary):** \`#f5f5f5\` (라이트 그레이)
- **블랙 (Black):** \`#000000\` 또는 \`#171717\` (다크 그레이)
- **화이트 (White):** \`#ffffff\` 또는 \`#fafafa\` (라이트 그레이)

#### 명도 변형 (같은 색상의 명도만 변경)
- **메인 컬러 명도 변형:**
  - 밝은 톤: \`rgba(255, 107, 53, 0.1)\`, \`rgba(255, 107, 53, 0.2)\`, \`rgba(255, 107, 53, 0.5)\`
  - 어두운 톤: \`rgba(255, 107, 53, 0.8)\`, \`rgba(255, 107, 53, 0.9)\`
- **서브 컬러 명도 변형:**
  - 밝은 톤: \`#fafafa\`, \`#f9f9f9\`
  - 어두운 톤: \`#e5e5e5\`, \`#d4d4d4\`
- **블랙 명도 변형:**
  - 밝은 톤: \`#333333\`, \`#666666\`, \`#999999\`
  - 어두운 톤: \`#000000\`, \`#171717\`
- **화이트 명도 변형:**
  - 밝은 톤: \`#ffffff\`
  - 어두운 톤: \`#fafafa\`, \`#f5f5f5\`

#### 색상 사용 규칙
1. **텍스트 색상:**
   - 기본 텍스트: \`#666666\` (그레이)
   - 강조 텍스트: \`#000000\` (블랙)
   - 배경 텍스트: \`#ffffff\` (화이트)
   - 포인트 텍스트: \`#ff6b35\` (메인 컬러)

2. **배경 색상:**
   - 기본 배경: \`#ffffff\` (화이트)
   - 서브 배경: \`#f5f5f5\` (서브 컬러)
   - 다크 배경: \`#000000\` 또는 \`#171717\` (블랙)

3. **버튼 색상:**
   - 메인 버튼: \`#ff6b35\` (메인 컬러) 배경, \`#ffffff\` (화이트) 텍스트
   - 서브 버튼: \`#f5f5f5\` (서브 컬러) 배경, \`#000000\` (블랙) 텍스트
   - 아웃라인 버튼: 투명 배경, \`#000000\` (블랙) 또는 \`#ff6b35\` (메인 컬러) 테두리

4. **그라데이션 규칙:**
   - **중요:** 그라데이션은 반드시 위 4개 컬러 중에서만 사용하세요.
   - 같은 색상의 명도 차이로만 그라데이션을 만들 수 있습니다.
   - 예: 메인 컬러 그라데이션 (\`rgba(255, 107, 53, 0.2)\` → \`rgba(255, 107, 53, 0.8)\`)
   - 예: 블랙 그라데이션 (\`#333333\` → \`#000000\`)
   - 예: 화이트 그라데이션 (\`#ffffff\` → \`#f5f5f5\`)
   - **절대 금지:** 다른 색상(빨강, 파랑, 초록 등)을 그라데이션에 사용하지 마세요.

#### 색상 코드 예시
\`\`\`css
:root {
  /* 기본 컬러 팔레트 (4개만 사용) */
  --color-primary: #ff6b35;      /* 메인 컬러 (오렌지) */
  --color-secondary: #f5f5f5;    /* 서브 컬러 (라이트 그레이) */
  --color-black: #000000;        /* 블랙 */
  --color-white: #ffffff;        /* 화이트 */
  
  /* 메인 컬러 명도 변형 */
  --color-primary-light: rgba(255, 107, 53, 0.1);
  --color-primary-medium: rgba(255, 107, 53, 0.5);
  --color-primary-dark: rgba(255, 107, 53, 0.8);
  
  /* 서브 컬러 명도 변형 */
  --color-secondary-light: #fafafa;
  --color-secondary-dark: #e5e5e5;
  
  /* 블랙 명도 변형 */
  --color-black-light: #666666;  /* 텍스트 기본 색상 */
  --color-black-medium: #333333;
  --color-black-dark: #000000;
  
  /* 화이트 명도 변형 */
  --color-white-light: #ffffff;
  --color-white-dark: #fafafa;
  
  /* 텍스트 색상 */
  --text-primary: #666666;       /* 기본 텍스트 */
  --text-secondary: #000000;     /* 강조 텍스트 */
  --text-white: #ffffff;         /* 배경 텍스트 */
  --text-accent: #ff6b35;        /* 포인트 텍스트 (메인 컬러) */
  
  /* 배경 색상 */
  --bg-primary: #ffffff;         /* 기본 배경 */
  --bg-secondary: #f5f5f5;       /* 서브 배경 */
  --bg-dark: #000000;            /* 다크 배경 */
}

/* 그라데이션 예시 (같은 색상의 명도만 사용) */
.gradient-primary {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 107, 53, 0.8));
}

.gradient-black {
  background: linear-gradient(135deg, #333333, #000000);
}

.gradient-white {
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
}
\`\`\`

---

## 📐 폰트 사이즈 및 정렬 개선 가이드 (최우선 개선 사항)

### 폰트 사이즈 시스템

#### 타이포그래피 스케일
웹사이트 전반에 일관된 폰트 사이즈 시스템을 적용하세요.

\`\`\`css
:root {
  /* 폰트 사이즈 스케일 (반응형) */
  --font-size-xs: 12px;      /* 작은 텍스트, 캡션 */
  --font-size-sm: 14px;      /* 보조 텍스트 */
  --font-size-base: 16px;    /* 기본 텍스트 (본문) */
  --font-size-lg: 18px;      /* 큰 텍스트 */
  --font-size-xl: 20px;      /* 제목 텍스트 */
  --font-size-2xl: 24px;     /* 섹션 제목 */
  --font-size-3xl: 28px;     /* 페이지 제목 */
  --font-size-4xl: 32px;     /* 큰 페이지 제목 */
  --font-size-5xl: 36px;     /* 히어로 제목 */
  --font-size-6xl: 48px;     /* 큰 히어로 제목 */
  
  /* 모바일 폰트 사이즈 (작게) */
  --font-size-xs-mobile: 11px;
  --font-size-sm-mobile: 13px;
  --font-size-base-mobile: 14px;
  --font-size-lg-mobile: 16px;
  --font-size-xl-mobile: 18px;
  --font-size-2xl-mobile: 20px;
  --font-size-3xl-mobile: 24px;
  --font-size-4xl-mobile: 28px;
  --font-size-5xl-mobile: 32px;
  --font-size-6xl-mobile: 40px;
  
  /* 데스크톱 폰트 사이즈 (크게) */
  --font-size-xs-desktop: 13px;
  --font-size-sm-desktop: 15px;
  --font-size-base-desktop: 18px;
  --font-size-lg-desktop: 20px;
  --font-size-xl-desktop: 24px;
  --font-size-2xl-desktop: 28px;
  --font-size-3xl-desktop: 32px;
  --font-size-4xl-desktop: 40px;
  --font-size-5xl-desktop: 48px;
  --font-size-6xl-desktop: 64px;
  
  /* 행간 (Line Height) */
  --line-height-tight: 1.25;    /* 제목용 */
  --line-height-normal: 1.5;    /* 본문용 */
  --line-height-relaxed: 1.75;  /* 읽기 쉬운 본문용 */
  
  /* 자간 (Letter Spacing) */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.02em;
  --letter-spacing-wider: 0.05em;
}

/* 기본 텍스트 스타일 */
body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
}

/* 제목 스타일 */
h1 {
  font-size: var(--font-size-6xl);
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: var(--letter-spacing-tight);
}

h2 {
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: var(--letter-spacing-tight);
}

h3 {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  font-weight: 600;
  color: var(--text-secondary);
}

h4 {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-normal);
  font-weight: 600;
  color: var(--text-secondary);
}

h5 {
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-normal);
  font-weight: 600;
  color: var(--text-secondary);
}

h6 {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-normal);
  font-weight: 600;
  color: var(--text-secondary);
}

/* 본문 텍스트 */
p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
}

/* 작은 텍스트 */
small {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
}

/* 링크 텍스트 */
a {
  font-size: inherit;
  color: var(--text-accent);
  text-decoration: none;
}

a:hover {
  color: var(--color-primary-dark);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  h1 {
    font-size: var(--font-size-6xl-mobile);
  }
  
  h2 {
    font-size: var(--font-size-5xl-mobile);
  }
  
  h3 {
    font-size: var(--font-size-4xl-mobile);
  }
  
  h4 {
    font-size: var(--font-size-3xl-mobile);
  }
  
  h5 {
    font-size: var(--font-size-2xl-mobile);
  }
  
  h6 {
    font-size: var(--font-size-xl-mobile);
  }
  
  p {
    font-size: var(--font-size-base-mobile);
  }
  
  body {
    font-size: var(--font-size-base-mobile);
  }
}

/* 데스크톱 반응형 */
@media (min-width: 1024px) {
  h1 {
    font-size: var(--font-size-6xl-desktop);
  }
  
  h2 {
    font-size: var(--font-size-5xl-desktop);
  }
  
  h3 {
    font-size: var(--font-size-4xl-desktop);
  }
  
  h4 {
    font-size: var(--font-size-3xl-desktop);
  }
  
  h5 {
    font-size: var(--font-size-2xl-desktop);
  }
  
  h6 {
    font-size: var(--font-size-xl-desktop);
  }
  
  p {
    font-size: var(--font-size-base-desktop);
  }
  
  body {
    font-size: var(--font-size-base-desktop);
  }
}
\`\`\`

### 텍스트 정렬 개선

#### 정렬 규칙
1. **제목 정렬:**
   - H1, H2: 왼쪽 정렬 (\`text-left\`) 또는 중앙 정렬 (\`text-center\`)
   - H3, H4, H5, H6: 왼쪽 정렬 (\`text-left\`)

2. **본문 정렬:**
   - 기본: 왼쪽 정렬 (\`text-left\`)
   - 중앙 정렬: 특별한 경우만 사용 (\`text-center\`)
   - 오른쪽 정렬: 숫자, 날짜 등 특별한 경우만 사용 (\`text-right\`)

3. **버튼 텍스트 정렬:**
   - 기본: 중앙 정렬 (\`text-center\`)
   - 아이콘과 함께: 중앙 정렬 (\`text-center\`)

4. **카드 내 텍스트 정렬:**
   - 제목: 왼쪽 정렬 (\`text-left\`)
   - 본문: 왼쪽 정렬 (\`text-left\`)
   - 버튼: 중앙 정렬 (\`text-center\`)

#### 정렬 코드 예시
\`\`\`css
/* 제목 정렬 */
.heading-left {
  text-align: left;
}

.heading-center {
  text-align: center;
}

/* 본문 정렬 */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* 버튼 정렬 */
.button-text {
  text-align: center;
}

/* 카드 정렬 */
.card-title {
  text-align: left;
}

.card-content {
  text-align: left;
}

.card-button {
  text-align: center;
}

/* 반응형 정렬 */
@media (max-width: 768px) {
  .heading-center-mobile {
    text-align: center;
  }
  
  .text-left-mobile {
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .heading-left-desktop {
    text-align: left;
  }
  
  .text-justify-desktop {
    text-align: justify;
  }
}
\`\`\`

### 폰트 사이즈 개선 체크리스트

#### 1. 제목 폰트 사이즈 개선
- [ ] H1 태그: 모바일 40px, 태블릿 48px, 데스크톱 64px
- [ ] H2 태그: 모바일 32px, 태블릿 40px, 데스크톱 48px
- [ ] H3 태그: 모바일 24px, 태블릿 28px, 데스크톱 32px
- [ ] H4 태그: 모바일 20px, 태블릿 24px, 데스크톱 28px
- [ ] H5 태그: 모바일 18px, 태블릿 20px, 데스크톱 24px
- [ ] H6 태그: 모바일 16px, 태블릿 18px, 데스크톱 20px

#### 2. 본문 폰트 사이즈 개선
- [ ] 기본 텍스트: 모바일 14px, 태블릿 16px, 데스크톱 18px
- [ ] 작은 텍스트: 모바일 12px, 태블릿 13px, 데스크톱 14px
- [ ] 큰 텍스트: 모바일 16px, 태블릿 18px, 데스크톱 20px

#### 3. 버튼 폰트 사이즈 개선
- [ ] 기본 버튼: 모바일 16px, 태블릿 18px, 데스크톱 20px
- [ ] 큰 버튼: 모바일 18px, 태블릿 20px, 데스크톱 24px
- [ ] 작은 버튼: 모바일 14px, 태블릿 16px, 데스크톱 18px

#### 4. 입력 필드 폰트 사이즈 개선
- [ ] 기본 입력: 모바일 16px, 태블릿 18px, 데스크톱 20px
- [ ] 큰 입력: 모바일 18px, 태블릿 20px, 데스크톱 24px
- [ ] 작은 입력: 모바일 14px, 태블릿 16px, 데스크톱 18px

#### 5. 네비게이션 폰트 사이즈 개선
- [ ] 메뉴 항목: 모바일 16px, 태블릿 18px, 데스크톱 20px
- [ ] 로고 텍스트: 모바일 18px, 태블릿 20px, 데스크톱 24px
- [ ] 버튼 텍스트: 모바일 14px, 태블릿 16px, 데스크톱 18px

### 텍스트 정렬 개선 체크리스트

#### 1. 제목 정렬 개선
- [ ] 모든 H1 태그 정렬 확인 (왼쪽 또는 중앙)
- [ ] 모든 H2 태그 정렬 확인 (왼쪽 또는 중앙)
- [ ] 모든 H3-H6 태그 정렬 확인 (왼쪽)
- [ ] 섹션 제목 정렬 일관성 확인

#### 2. 본문 정렬 개선
- [ ] 모든 본문 텍스트 왼쪽 정렬 확인
- [ ] 중앙 정렬이 필요한 특별한 경우만 사용
- [ ] 오른쪽 정렬이 필요한 특별한 경우만 사용
- [ ] 정렬 일관성 확인

#### 3. 버튼 정렬 개선
- [ ] 모든 버튼 텍스트 중앙 정렬 확인
- [ ] 아이콘과 텍스트 함께 있을 때 정렬 확인
- [ ] 버튼 내 텍스트 정렬 일관성 확인

#### 4. 카드 정렬 개선
- [ ] 카드 제목 왼쪽 정렬 확인
- [ ] 카드 본문 왼쪽 정렬 확인
- [ ] 카드 버튼 중앙 정렬 확인
- [ ] 카드 내 요소 정렬 일관성 확인

#### 5. 폼 정렬 개선
- [ ] 라벨 왼쪽 정렬 확인
- [ ] 입력 필드 왼쪽 정렬 확인
- [ ] 에러 메시지 왼쪽 정렬 확인
- [ ] 제출 버튼 중앙 정렬 확인

### 폰트 사이즈 및 정렬 개선 우선순위

#### 1단계: 긴급 개선 (1주일)
1. **제목 폰트 사이즈 통일**
   - 모든 H1 태그를 동일한 사이즈로 통일
   - 모든 H2 태그를 동일한 사이즈로 통일
   - 모든 H3-H6 태그를 동일한 사이즈로 통일

2. **본문 폰트 사이즈 통일**
   - 모든 본문 텍스트를 동일한 사이즈로 통일
   - 작은 텍스트와 큰 텍스트 구분

3. **제목 정렬 통일**
   - 모든 H1-H6 태그 정렬 일관성 확인
   - 섹션별 제목 정렬 통일

#### 2단계: 중요 개선 (2주일)
1. **버튼 폰트 사이즈 통일**
   - 모든 버튼 텍스트 사이즈 통일
   - 버튼 크기별 폰트 사이즈 정의

2. **입력 필드 폰트 사이즈 통일**
   - 모든 입력 필드 텍스트 사이즈 통일
   - 플레이스홀더 텍스트 사이즈 통일

3. **본문 정렬 통일**
   - 모든 본문 텍스트 정렬 일관성 확인
   - 특별한 경우만 중앙/오른쪽 정렬 사용

#### 3단계: 참고 개선 (1개월)
1. **네비게이션 폰트 사이즈 통일**
   - 메뉴 항목 폰트 사이즈 통일
   - 로고 텍스트 폰트 사이즈 통일

2. **카드 폰트 사이즈 통일**
   - 카드 제목 폰트 사이즈 통일
   - 카드 본문 폰트 사이즈 통일

3. **반응형 폰트 사이즈 최적화**
   - 모바일, 태블릿, 데스크톱별 폰트 사이즈 최적화
   - 화면 크기별 정렬 최적화

### 폰트 사이즈 및 정렬 개선 코드 예시

#### 제목 폰트 사이즈 개선
\`\`\`css
/* 개선 전 */
h1 {
  font-size: 32px;
}

/* 개선 후 */
h1 {
  font-size: var(--font-size-6xl);
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--text-secondary);
  text-align: left;
}

@media (max-width: 768px) {
  h1 {
    font-size: var(--font-size-6xl-mobile);
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: var(--font-size-6xl-desktop);
  }
}
\`\`\`

#### 본문 폰트 사이즈 개선
\`\`\`css
/* 개선 전 */
p {
  font-size: 14px;
}

/* 개선 후 */
p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
  text-align: left;
}

@media (max-width: 768px) {
  p {
    font-size: var(--font-size-base-mobile);
  }
}

@media (min-width: 1024px) {
  p {
    font-size: var(--font-size-base-desktop);
  }
}
\`\`\`

#### 버튼 폰트 사이즈 개선
\`\`\`css
/* 개선 전 */
.button {
  font-size: 14px;
}

/* 개선 후 */
.button {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  font-weight: 600;
  color: var(--text-white);
  text-align: center;
  background-color: var(--color-primary);
  padding: 12px 24px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .button {
    font-size: var(--font-size-base-mobile);
    padding: 10px 20px;
  }
}

@media (min-width: 1024px) {
  .button {
    font-size: var(--font-size-base-desktop);
    padding: 14px 28px;
  }
}
\`\`\`

#### 입력 필드 폰트 사이즈 개선
\`\`\`css
/* 개선 전 */
input {
  font-size: 14px;
}

/* 개선 후 */
input {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--text-secondary);
  text-align: left;
  padding: 12px 16px;
  border: 2px solid var(--color-secondary-dark);
  border-radius: 8px;
}

input::placeholder {
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

@media (max-width: 768px) {
  input {
    font-size: var(--font-size-base-mobile);
    padding: 10px 14px;
  }
  
  input::placeholder {
    font-size: var(--font-size-base-mobile);
  }
}

@media (min-width: 1024px) {
  input {
    font-size: var(--font-size-base-desktop);
    padding: 14px 18px;
  }
  
  input::placeholder {
    font-size: var(--font-size-base-desktop);
  }
}
\`\`\`

#### 텍스트 정렬 개선
\`\`\`css
/* 개선 전 */
.title {
  text-align: center;
}

.content {
  text-align: justify;
}

/* 개선 후 */
.title {
  text-align: left;
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--text-secondary);
}

.content {
  text-align: left;
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
}

/* 특별한 경우만 중앙 정렬 */
.title-center {
  text-align: center;
}

/* 특별한 경우만 오른쪽 정렬 */
.text-right {
  text-align: right;
}
\`\`\`

---

## 카테고리별 상세 가이드

### 사용성 (Usability) 개선 가이드

#### 내비게이션 개선
- **목표:** 사용자가 원하는 정보를 3클릭 이내에 찾을 수 있도록 구조화
- **방법:**
  - 메뉴 구조를 단순화 (최대 3단계 깊이)
  - 명확한 라벨 사용
  - 브레드크럼(Breadcrumb) 추가
  - 검색 기능 강화
- **폰트 사이즈:** 메뉴 항목 16px (모바일), 18px (태블릿), 20px (데스크톱)
- **정렬:** 왼쪽 정렬 (\`text-left\`)
- **색상:** 텍스트 \`#666666\`, 호버 시 \`#ff6b35\` (메인 컬러)
- **코드 예시:**
\`\`\`html
<nav aria-label="메인 내비게이션">
  <ul>
    <li><a href="/">홈</a></li>
    <li><a href="/about">회사 소개</a></li>
    <li><a href="/products">제품</a></li>
    <li><a href="/contact">문의</a></li>
  </ul>
</nav>
\`\`\`
\`\`\`css
nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav ul li {
  display: inline-block;
  margin-right: 24px;
}

nav ul li a {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  text-decoration: none;
  text-align: left;
  transition: color 0.3s ease;
}

nav ul li a:hover {
  color: var(--text-accent);
}
\`\`\`

#### CTA 버튼 개선
- **목표:** 사용자의 행동을 유도하는 명확한 CTA 버튼
- **방법:**
  - 버튼 크기 최소 44x44px (모바일)
  - 명확한 텍스트 사용 ("지금 시작하기" 등)
  - 색상 대비율 4.5:1 이상
  - 적절한 위치에 배치
- **폰트 사이즈:** 16px (모바일), 18px (태블릿), 20px (데스크톱)
- **정렬:** 중앙 정렬 (\`text-center\`)
- **색상:** 배경 \`#ff6b35\` (메인 컬러), 텍스트 \`#ffffff\` (화이트)
- **코드 예시:**
\`\`\`css
.cta-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: var(--text-white);
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cta-button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .cta-button {
    font-size: var(--font-size-base-mobile);
    padding: 10px 20px;
  }
}

@media (min-width: 1024px) {
  .cta-button {
    font-size: var(--font-size-base-desktop);
    padding: 14px 28px;
  }
}
\`\`\`

#### 모바일 터치 최적화
- **목표:** 모바일 사용자가 쉽게 클릭할 수 있는 터치 영역
- **방법:**
  - 모든 클릭 가능한 요소의 최소 크기 44x44px
  - 버튼 간 간격 최소 8px
  - 스와이프 제스처 지원
- **폰트 사이즈:** 버튼 텍스트 16px 이상 (모바일)
- **정렬:** 중앙 정렬 (\`text-center\`)
- **색상:** 배경 \`#ff6b35\` (메인 컬러), 텍스트 \`#ffffff\` (화이트)
- **코드 예시:**
\`\`\`css
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
  margin: 4px;
  font-size: var(--font-size-base);
  text-align: center;
  background-color: var(--color-primary);
  color: var(--text-white);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .touch-target {
    font-size: var(--font-size-base-mobile);
    min-width: 44px;
    min-height: 44px;
  }
}
\`\`\`

### 접근성 (Accessibility) 개선 가이드

#### 색상 대비율 개선
- **목표:** WCAG 2.1 AA 수준 달성 (텍스트 4.5:1, 대형 텍스트 3:1)
- **방법:**
  - 대비율 계산 도구 사용 (WebAIM Contrast Checker)
  - 어두운 배경에 밝은 텍스트 또는 밝은 배경에 어두운 텍스트 사용
  - 색상만으로 정보를 전달하지 않기 (텍스트, 아이콘 추가)
- **색상 규칙:** 텍스트는 \`#666666\` (기본), \`#000000\` (강조), \`#ffffff\` (배경), \`#ff6b35\` (포인트)만 사용
- **폰트 사이즈:** 기본 텍스트 16px (모바일), 18px (태블릿), 20px (데스크톱)
- **정렬:** 왼쪽 정렬 (\`text-left\`)
- **코드 예시:**
\`\`\`css
/* 좋은 예: 대비율 4.5:1 이상 */
.text-primary {
  font-size: var(--font-size-base);
  color: var(--text-primary);        /* #666666 */
  background-color: var(--bg-primary); /* #ffffff */
  text-align: left;
}

.text-secondary {
  font-size: var(--font-size-base);
  color: var(--text-secondary);      /* #000000 */
  background-color: var(--bg-primary); /* #ffffff */
  text-align: left;
}

.text-accent {
  font-size: var(--font-size-base);
  color: var(--text-accent);         /* #ff6b35 (메인 컬러) */
  background-color: var(--bg-primary); /* #ffffff */
  text-align: left;
}

.text-white {
  font-size: var(--font-size-base);
  color: var(--text-white);          /* #ffffff */
  background-color: var(--bg-dark);  /* #000000 */
  text-align: left;
}

/* 나쁜 예: 대비율 2.5:1 (충분하지 않음) - 사용 금지 */
.text-low-contrast {
  color: #999999;  /* 다른 컬러 사용 금지 */
  background-color: #ffffff;
}
\`\`\`

#### 키보드 네비게이션
- **목표:** 키보드만으로 모든 기능에 접근 가능
- **방법:**
  - 모든 인터랙티브 요소에 키보드 포커스 가능
  - 포커스 순서 논리적으로 구성
  - 명확한 포커스 인디케이터 제공
  - 스킵 링크 추가
- **폰트 사이즈:** 링크 텍스트 16px (모바일), 18px (태블릿), 20px (데스크톱)
- **정렬:** 왼쪽 정렬 (\`text-left\`)
- **색상:** 텍스트 \`#666666\`, 포커스 시 \`#ff6b35\` (메인 컬러)
- **코드 예시:**
\`\`\`html
<!-- 스킵 링크 -->
<a href="#main-content" class="skip-link">본문으로 건너뛰기</a>

<!-- 키보드 접근 가능한 버튼 -->
<button aria-label="메뉴 열기" onclick="toggleMenu()">
  <span class="menu-icon"></span>
</button>
\`\`\`
\`\`\`css
.skip-link {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  text-align: left;
  text-decoration: none;
  padding: 8px 16px;
  background-color: var(--bg-primary);
  border: 2px solid var(--color-primary);
  border-radius: 4px;
}

.skip-link:focus {
  color: var(--text-accent);
  border-color: var(--color-primary);
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  text-align: center;
  padding: 8px 16px;
  background-color: var(--bg-primary);
  border: 2px solid var(--color-black);
  border-radius: 8px;
  cursor: pointer;
}

button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .skip-link,
  button {
    font-size: var(--font-size-base-mobile);
  }
}

@media (min-width: 1024px) {
  .skip-link,
  button {
    font-size: var(--font-size-base-desktop);
  }
}
\`\`\`

#### 스크린 리더 지원
- **목표:** 스크린 리더 사용자가 모든 정보에 접근 가능
- **방법:**
  - 모든 이미지에 alt 텍스트 추가
  - ARIA 레이블 및 역할 속성 사용
  - 폼 입력에 레이블 연결
  - 에러 메시지를 명확하게 표시
- **폰트 사이즈:** 라벨 16px (모바일), 18px (태블릿), 20px (데스크톱)
- **정렬:** 왼쪽 정렬 (\`text-left\`)
- **색상:** 라벨 텍스트 \`#666666\`, 에러 메시지 \`#ff6b35\` (메인 컬러)
- **코드 예시:**
\`\`\`html
<!-- 이미지 -->
<img src="logo.png" alt="회사 로고" />

<!-- 버튼 -->
<button aria-label="장바구니에 추가" aria-describedby="cart-description">
  추가
</button>
<div id="cart-description" class="sr-only">상품을 장바구니에 추가합니다.</div>

<!-- 폼 -->
<label for="email">이메일</label>
<input type="email" id="email" aria-required="true" aria-invalid="false" />
<div role="alert" aria-live="polite" id="email-error"></div>
\`\`\`
\`\`\`css
label {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  text-align: left;
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

input {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  text-align: left;
  padding: 12px 16px;
  border: 2px solid var(--color-secondary-dark);
  border-radius: 8px;
  background-color: var(--bg-primary);
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
}

input[aria-invalid="true"] {
  border-color: var(--color-primary);
}

.error-message {
  font-size: var(--font-size-sm);
  color: var(--text-accent);
  text-align: left;
  margin-top: 4px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (max-width: 768px) {
  label,
  input,
  .error-message {
    font-size: var(--font-size-base-mobile);
  }
}

@media (min-width: 1024px) {
  label,
  input,
  .error-message {
    font-size: var(--font-size-base-desktop);
  }
}
\`\`\`

### 시각 디자인 개선 가이드

#### 타이포그래피 시스템 (폰트 사이즈 및 정렬 최우선)
- **목표:** 일관성 있고 읽기 쉬운 텍스트
- **방법:**
  - 타이포그래피 스케일 정의 (모바일, 태블릿, 데스크톱별)
  - 행간(Line Height) 1.5-1.75 권장
  - 폰트 패밀리 2-3개로 제한
  - 모든 텍스트 정렬 일관성 유지
- **폰트 사이즈:** 반응형 폰트 사이즈 시스템 적용 (위 "폰트 사이즈 시스템" 참조)
- **정렬:** 제목 왼쪽/중앙, 본문 왼쪽, 버튼 중앙
- **색상:** 텍스트 \`#666666\` (기본), \`#000000\` (강조), \`#ffffff\` (배경), \`#ff6b35\` (포인트)
- **코드 예시:**
\`\`\`css
:root {
  /* 폰트 사이즈 스케일 (반응형) */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;
  --font-size-5xl: 36px;
  --font-size-6xl: 48px;
  
  /* 모바일 폰트 사이즈 */
  --font-size-xs-mobile: 11px;
  --font-size-sm-mobile: 13px;
  --font-size-base-mobile: 14px;
  --font-size-lg-mobile: 16px;
  --font-size-xl-mobile: 18px;
  --font-size-2xl-mobile: 20px;
  --font-size-3xl-mobile: 24px;
  --font-size-4xl-mobile: 28px;
  --font-size-5xl-mobile: 32px;
  --font-size-6xl-mobile: 40px;
  
  /* 데스크톱 폰트 사이즈 */
  --font-size-xs-desktop: 13px;
  --font-size-sm-desktop: 15px;
  --font-size-base-desktop: 18px;
  --font-size-lg-desktop: 20px;
  --font-size-xl-desktop: 24px;
  --font-size-2xl-desktop: 28px;
  --font-size-3xl-desktop: 32px;
  --font-size-4xl-desktop: 40px;
  --font-size-5xl-desktop: 48px;
  --font-size-6xl-desktop: 64px;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* 텍스트 색상 (4개 컬러만 사용) */
  --text-primary: #666666;
  --text-secondary: #000000;
  --text-white: #ffffff;
  --text-accent: #ff6b35;
}

h1 {
  font-size: var(--font-size-6xl);
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--text-secondary);
  text-align: left;
}

h2 {
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--text-secondary);
  text-align: left;
}

h3 {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
}

h4 {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-normal);
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
}

h5 {
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-normal);
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
}

h6 {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-normal);
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
}

p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
  text-align: left;
}

@media (max-width: 768px) {
  h1 { font-size: var(--font-size-6xl-mobile); }
  h2 { font-size: var(--font-size-5xl-mobile); }
  h3 { font-size: var(--font-size-4xl-mobile); }
  h4 { font-size: var(--font-size-3xl-mobile); }
  h5 { font-size: var(--font-size-2xl-mobile); }
  h6 { font-size: var(--font-size-xl-mobile); }
  p { font-size: var(--font-size-base-mobile); }
}

@media (min-width: 1024px) {
  h1 { font-size: var(--font-size-6xl-desktop); }
  h2 { font-size: var(--font-size-5xl-desktop); }
  h3 { font-size: var(--font-size-4xl-desktop); }
  h4 { font-size: var(--font-size-3xl-desktop); }
  h5 { font-size: var(--font-size-2xl-desktop); }
  h6 { font-size: var(--font-size-xl-desktop); }
  p { font-size: var(--font-size-base-desktop); }
}
\`\`\`

#### 여백 시스템
- **목표:** 8px 기반 그리드 시스템으로 일관성 있는 여백
- **방법:**
  - 8px의 배수로 여백 정의 (8px, 16px, 24px, 32px, 40px, 48px 등)
  - 섹션 간 간격 통일
  - 요소 간 간격 통일
- **폰트 사이즈:** 섹션 제목에 적용된 폰트 사이즈 유지
- **정렬:** 섹션 제목 왼쪽 정렬, 본문 왼쪽 정렬
- **색상:** 배경 \`#ffffff\` (기본), \`#f5f5f5\` (서브), \`#000000\` (다크)
- **코드 예시:**
\`\`\`css
:root {
  --spacing-1: 8px;
  --spacing-2: 16px;
  --spacing-3: 24px;
  --spacing-4: 32px;
  --spacing-5: 40px;
  --spacing-6: 48px;
}

.section {
  padding: var(--spacing-6) var(--spacing-4);
  margin-bottom: var(--spacing-6);
  background-color: var(--bg-primary);
}

.section-title {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--text-secondary);
  text-align: left;
  margin-bottom: var(--spacing-4);
}

.section-content {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
  text-align: left;
}

.card {
  padding: var(--spacing-3);
  margin-bottom: var(--spacing-2);
  background-color: var(--bg-primary);
  border: 2px solid var(--color-secondary-dark);
  border-radius: 8px;
}

.card-title {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
  margin-bottom: var(--spacing-2);
}

.card-content {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
  text-align: left;
}

@media (max-width: 768px) {
  .section-title {
    font-size: var(--font-size-4xl-mobile);
  }
  
  .section-content,
  .card-content {
    font-size: var(--font-size-base-mobile);
  }
  
  .card-title {
    font-size: var(--font-size-3xl-mobile);
  }
}

@media (min-width: 1024px) {
  .section-title {
    font-size: var(--font-size-4xl-desktop);
  }
  
  .section-content,
  .card-content {
    font-size: var(--font-size-base-desktop);
  }
  
  .card-title {
    font-size: var(--font-size-3xl-desktop);
  }
}
\`\`\`

#### 색상 팔레트 (4개 컬러만 사용)
- **목표:** 일관성 있고 접근성 있는 색상 시스템
- **방법:**
  - **메인 컬러 (Primary):** \`#ff6b35\` (오렌지) - 포인트 컬러로 사용
  - **서브 컬러 (Secondary):** \`#f5f5f5\` (라이트 그레이) - 서브 배경으로 사용
  - **블랙 (Black):** \`#000000\` 또는 \`#171717\` (다크 그레이) - 강조 텍스트로 사용
  - **화이트 (White):** \`#ffffff\` 또는 \`#fafafa\` (라이트 그레이) - 기본 배경으로 사용
  - 각 색상의 명도 변형만 사용 (같은 색상의 명도 차이)
  - 대비율 고려한 색상 조합
- **중요:** 다른 색상(빨강, 파랑, 초록 등)은 절대 사용하지 마세요.
- **폰트 색상:** \`#666666\` (기본), \`#000000\` (강조), \`#ffffff\` (배경), \`#ff6b35\` (포인트)
- **코드 예시:**
\`\`\`css
:root {
  /* 기본 컬러 팔레트 (4개만 사용) */
  --color-primary: #ff6b35;      /* 메인 컬러 (오렌지) */
  --color-secondary: #f5f5f5;    /* 서브 컬러 (라이트 그레이) */
  --color-black: #000000;        /* 블랙 */
  --color-white: #ffffff;        /* 화이트 */
  
  /* 메인 컬러 명도 변형 (같은 색상의 명도만 변경) */
  --color-primary-light: rgba(255, 107, 53, 0.1);
  --color-primary-medium: rgba(255, 107, 53, 0.5);
  --color-primary-dark: rgba(255, 107, 53, 0.8);
  
  /* 서브 컬러 명도 변형 */
  --color-secondary-light: #fafafa;
  --color-secondary-dark: #e5e5e5;
  
  /* 블랙 명도 변형 */
  --color-black-light: #666666;  /* 텍스트 기본 색상 */
  --color-black-medium: #333333;
  --color-black-dark: #000000;
  
  /* 화이트 명도 변형 */
  --color-white-light: #ffffff;
  --color-white-dark: #fafafa;
  
  /* 텍스트 색상 */
  --text-primary: #666666;       /* 기본 텍스트 */
  --text-secondary: #000000;     /* 강조 텍스트 */
  --text-white: #ffffff;         /* 배경 텍스트 */
  --text-accent: #ff6b35;        /* 포인트 텍스트 (메인 컬러) */
  
  /* 배경 색상 */
  --bg-primary: #ffffff;         /* 기본 배경 */
  --bg-secondary: #f5f5f5;       /* 서브 배경 */
  --bg-dark: #000000;            /* 다크 배경 */
}

.button-primary {
  font-size: var(--font-size-base);
  background-color: var(--color-primary);
  color: var(--text-white);
  text-align: center;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}

.button-secondary {
  font-size: var(--font-size-base);
  background-color: var(--color-secondary);
  color: var(--text-secondary);
  text-align: center;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid var(--color-black);
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-secondary:hover {
  background-color: var(--color-secondary-dark);
}

/* 그라데이션 예시 (같은 색상의 명도만 사용) */
.gradient-primary {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 107, 53, 0.8));
}

.gradient-black {
  background: linear-gradient(135deg, #333333, #000000);
}

.gradient-white {
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
}

/* 절대 금지: 다른 색상을 그라데이션에 사용하지 마세요 */
/* .gradient-red { background: linear-gradient(135deg, #ff0000, #ff6666); } */  /* 사용 금지 */
/* .gradient-blue { background: linear-gradient(135deg, #0000ff, #6666ff); } */ /* 사용 금지 */
/* .gradient-green { background: linear-gradient(135deg, #00ff00, #66ff66); } */ /* 사용 금지 */

@media (max-width: 768px) {
  .button-primary,
  .button-secondary {
    font-size: var(--font-size-base-mobile);
    padding: 10px 20px;
  }
}

@media (min-width: 1024px) {
  .button-primary,
  .button-secondary {
    font-size: var(--font-size-base-desktop);
    padding: 14px 28px;
  }
}
\`\`\`

### 성능 최적화 가이드

#### 이미지 최적화
- **목표:** 빠른 로딩 시간과 적은 데이터 사용량
- **방법:**
  - WebP 형식 사용 (지원하지 않는 브라우저를 위한 fallback 제공)
  - 이미지 크기 최적화 (필요한 크기만큼만)
  - Lazy loading 구현
  - 반응형 이미지 사용 (srcset)
- **폰트 사이즈:** 이미지 alt 텍스트는 기본 폰트 사이즈 사용
- **정렬:** 이미지 캡션은 왼쪽 정렬 (\`text-left\`)
- **색상:** 이미지 배경은 \`#ffffff\` (화이트) 또는 \`#f5f5f5\` (서브 컬러)
- **코드 예시:**
\`\`\`html
<!-- Lazy loading -->
<img src="image.jpg" alt="설명" loading="lazy" />

<!-- 반응형 이미지 -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="설명" />
</picture>

<!-- srcset -->
<img 
  srcset="image-small.jpg 480w, image-medium.jpg 768w, image-large.jpg 1200w"
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
  src="image-medium.jpg"
  alt="설명"
/>

<!-- 이미지 캡션 -->
<figure>
  <img src="image.jpg" alt="설명" />
  <figcaption>이미지 설명</figcaption>
</figure>
\`\`\`
\`\`\`css
img {
  max-width: 100%;
  height: auto;
  background-color: var(--bg-primary);
}

figure {
  margin: var(--spacing-4) 0;
}

figcaption {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-align: left;
  margin-top: var(--spacing-2);
}

@media (max-width: 768px) {
  figcaption {
    font-size: var(--font-size-sm-mobile);
  }
}

@media (min-width: 1024px) {
  figcaption {
    font-size: var(--font-size-sm-desktop);
  }
}
\`\`\`

#### 코드 최적화
- **목표:** 작은 번들 크기와 빠른 실행
- **방법:**
  - 불필요한 라이브러리 제거
  - 코드 스플리팅(Code Splitting)
  - Tree Shaking
  - Minification 및 압축
- **코드 예시:**
\`\`\`javascript
// 동적 import (코드 스플리팅)
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

#### 캐싱 전략
- **목표:** 빠른 재방문 경험
- **방법:**
  - 브라우저 캐싱 활용
  - CDN 사용
  - Service Worker 구현 (PWA)
- **코드 예시:**
\`\`\`
# .htaccess (Apache)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
\`\`\`

### SEO 개선 가이드

#### 메타 태그 최적화
- **목표:** 검색 엔진과 소셜 미디어에서 최적의 표시
- **방법:**
  - 각 페이지에 고유한 Title 태그 (50-60자)
  - 각 페이지에 고유한 Description 태그 (150-160자)
  - OG 태그 추가 (Open Graph)
  - Twitter Card 태그 추가
- **코드 예시:**
\`\`\`html
<head>
  <!-- 기본 메타 태그 -->
  <title>페이지 제목 - 사이트명</title>
  <meta name="description" content="페이지 설명 (150-160자)" />
  <meta name="keywords" content="키워드1, 키워드2, 키워드3" />
  
  <!-- OG 태그 -->
  <meta property="og:title" content="페이지 제목" />
  <meta property="og:description" content="페이지 설명" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="페이지 제목" />
  <meta name="twitter:description" content="페이지 설명" />
  <meta name="twitter:image" content="https://example.com/image.jpg" />
</head>
\`\`\`

#### 헤딩 구조 개선
- **목표:** 검색 엔진이 콘텐츠 구조를 이해할 수 있도록
- **방법:**
  - H1 태그는 페이지당 1개만 사용
  - 헤딩 계층 구조 유지 (H1 → H2 → H3 순서)
  - 헤딩에 키워드 포함
- **코드 예시:**
\`\`\`html
<article>
  <h1>메인 제목 (페이지당 1개만)</h1>
  <section>
    <h2>섹션 제목</h2>
    <h3>하위 섹션 제목</h3>
    <p>내용...</p>
  </section>
</article>
\`\`\`

#### 구조화된 데이터
- **목표:** 검색 엔진이 콘텐츠를 더 잘 이해할 수 있도록
- **방법:**
  - Schema.org 마크업 추가
  - JSON-LD 형식 사용
  - 적절한 스키마 타입 선택 (Article, Product, Organization 등)
- **코드 예시:**
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "기사 제목",
  "author": {
    "@type": "Person",
    "name": "작성자 이름"
  },
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-02",
  "image": "https://example.com/image.jpg",
  "description": "기사 설명"
}
</script>
\`\`\`

---

## 구현 우선순위

### 1단계: 긴급 개선 (1-2주)
${
  highSeverityIssues.length > 0
    ? highSeverityIssues
        .map(
          (issue, index) => `${index + 1}. ${issue.title} (${issue.category})`
        )
        .join("\n")
    : "긴급 개선 사항이 없습니다."
}

### 2단계: 중요 개선 (2-4주)
${
  mediumSeverityIssues.length > 0
    ? mediumSeverityIssues
        .map(
          (issue, index) => `${index + 1}. ${issue.title} (${issue.category})`
        )
        .join("\n")
    : "중요 개선 사항이 없습니다."
}

### 3단계: 참고 개선 (1-2개월)
${
  lowSeverityIssues.length > 0
    ? lowSeverityIssues
        .map(
          (issue, index) => `${index + 1}. ${issue.title} (${issue.category})`
        )
        .join("\n")
    : "참고 개선 사항이 없습니다."
}

---

## 테스트 체크리스트

### 접근성 테스트
- [ ] 색상 대비율 검사 (WebAIM Contrast Checker)
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 테스트 (NVDA, JAWS, VoiceOver)
- [ ] 모든 이미지에 alt 텍스트 확인
- [ ] 모든 폼 입력에 레이블 확인
- [ ] 포커스 인디케이터 확인

### 성능 테스트
- [ ] 페이지 로딩 시간 측정 (목표: 3초 이내)
- [ ] Lighthouse 성능 점수 확인 (목표: 90점 이상)
- [ ] Core Web Vitals 확인 (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] 이미지 최적화 확인
- [ ] 코드 번들 크기 확인

### 호환성 테스트
- [ ] 주요 브라우저 테스트 (Chrome, Firefox, Safari, Edge)
- [ ] 모바일 디바이스 테스트 (iOS, Android)
- [ ] 태블릿 디바이스 테스트
- [ ] 반응형 디자인 확인 (다양한 화면 크기)

### SEO 테스트
- [ ] 메타 태그 확인
- [ ] 헤딩 구조 확인
- [ ] 구조화된 데이터 확인 (Google Rich Results Test)
- [ ] 사이트맵 확인
- [ ] robots.txt 확인
- [ ] 내부 링크 구조 확인

### 사용성 테스트
- [ ] 사용자 플로우 테스트
- [ ] CTA 버튼 테스트
- [ ] 폼 제출 테스트
- [ ] 에러 처리 테스트
- [ ] 로딩 상태 테스트

---

## 예상 효과

### 개선 전
- 종합 점수: ${result.score.overall}/100
- 사용성: ${result.score.usability}/100
- 접근성: ${result.score.accessibility}/100
- 시각 디자인: ${result.score.visual}/100
- 성능: ${result.score.performance}/100
- SEO: ${seoData.score}/100

### 개선 후 (예상)
- 종합 점수: ${Math.min(100, result.score.overall + 15)}/100 (목표: +15점)
- 사용성: ${Math.min(100, result.score.usability + 10)}/100 (목표: +10점)
- 접근성: ${Math.min(100, result.score.accessibility + 15)}/100 (목표: +15점)
- 시각 디자인: ${Math.min(100, result.score.visual + 10)}/100 (목표: +10점)
- 성능: ${Math.min(100, result.score.performance + 10)}/100 (목표: +10점)
- SEO: ${Math.min(100, seoData.score + 15)}/100 (목표: +15점)

### 비즈니스 효과
- 사용자 만족도 향상
- 이탈률 감소
- 전환율 증가
- 검색 엔진 랭킹 향상
- 접근성 개선으로 더 많은 사용자에게 서비스 제공
- 모바일 사용자 경험 개선

---

## 분석 기준 상세 설명

### 1. 사용성 (Usability)
사용성이란 사용자가 웹사이트를 사용하여 목표를 달성하는데 얼마나 쉽고 효율적인지를 측정합니다.

**평가 항목:**
- **내비게이션:** 사용자가 원하는 정보를 쉽게 찾을 수 있는지
- **CTA 버튼:** 사용자의 행동을 유도하는 버튼이 명확한지
- **모바일 터치:** 모바일 환경에서 터치하기 쉬운지
- **폼 입력:** 폼을 쉽게 작성할 수 있는지
- **정보 구조:** 정보가 논리적으로 구성되어 있는지

**개선 방법:**
- 사용자 테스트 수행
- 사용자 피드백 수집
- A/B 테스트 진행
- 사용자 여정 최적화

### 2. 접근성 (Accessibility) - WCAG 2.1
접근성이란 모든 사용자가 웹사이트를 사용할 수 있도록 하는 것입니다.

**평가 항목:**
- **색상 대비:** 텍스트와 배경의 대비율이 충분한지 (4.5:1 이상)
- **키보드 네비게이션:** 키보드만으로 모든 기능에 접근할 수 있는지
- **스크린 리더:** 스크린 리더로 모든 정보를 접근할 수 있는지
- **대체 텍스트:** 이미지에 적절한 alt 텍스트가 있는지
- **폼 레이블:** 폼 입력에 명확한 레이블이 있는지

**개선 방법:**
- WCAG 2.1 가이드라인 준수
- 접근성 도구 사용
- 스크린 리더 테스트
- 키보드 네비게이션 테스트

### 3. 시각 디자인 (Visual Design)
시각 디자인이란 웹사이트의 시각적 요소가 일관성 있고 조화로운지를 측정합니다.

**평가 항목:**
- **타이포그래피:** 폰트 크기, 행간, 위계가 일관성 있는지
- **여백 시스템:** 여백이 체계적으로 구성되어 있는지 (8px 그리드)
- **색상 팔레트:** 색상이 조화롭고 일관성 있는지
- **시각적 위계:** 정보의 중요도가 시각적으로 명확한지
- **아이콘 및 이미지:** 아이콘과 이미지가 일관성 있는지

**개선 방법:**
- 디자인 시스템 구축
- 타이포그래피 스케일 정의
- 색상 팔레트 정의
- 여백 시스템 정의

### 4. 성능 (Performance)
성능이란 웹사이트가 얼마나 빠르게 로드되고 실행되는지를 측정합니다.

**평가 항목:**
- **이미지 최적화:** 이미지가 최적화되어 있는지
- **번들 크기:** CSS/JavaScript 번들이 최적화되어 있는지
- **렌더링 성능:** 페이지가 빠르게 렌더링되는지
- **모바일 최적화:** 모바일 환경에서 최적화되어 있는지
- **로딩 시간:** 페이지 로딩 시간이 빠른지 (목표: 3초 이내)

**개선 방법:**
- 이미지 최적화 (WebP, lazy loading)
- 코드 최적화 (코드 스플리팅, Tree Shaking)
- 캐싱 전략 수립
- CDN 사용
- 성능 모니터링

### 5. SEO (Search Engine Optimization)
SEO란 검색 엔진에서 웹사이트가 잘 노출되도록 최적화하는 것입니다.

**평가 항목:**
- **메타 태그:** Title, Description, OG 태그가 적절한지
- **헤딩 구조:** H1-H6 태그가 적절하게 사용되고 있는지
- **이미지 Alt 태그:** 이미지에 적절한 alt 텍스트가 있는지
- **링크 구조:** 내부/외부 링크가 적절하게 구성되어 있는지
- **구조화된 데이터:** Schema.org 마크업이 있는지
- **Core Web Vitals:** LCP, FID, CLS가 적절한지

**개선 방법:**
- 메타 태그 최적화
- 헤딩 구조 개선
- 이미지 Alt 태그 추가
- 구조화된 데이터 추가
- 사이트맵 및 robots.txt 최적화
- Core Web Vitals 최적화

---

## AI에게 전달할 메시지

위 지침서의 모든 개선 사항을 우선순위에 따라 코드에 적용해주세요.

### 작업 순서
1. **긴급 개선 사항** (높은 심각도)부터 처리하세요.
2. 각 항목별로 구체적인 코드 변경을 제안하세요.
3. 변경 이유를 설명하세요.
4. 변경 사항이 다른 부분에 영향을 미치지 않는지 확인하세요.
5. 테스트를 수행하고, 필요시 수정하세요.

### 코드 작성 시 포함할 내용
- 변경 전 코드
- 변경 후 코드
- 변경 이유
- 테스트 결과
- 브라우저 호환성 확인
- 성능 영향 확인
- 접근성 확인

### 주의 사항
- **색상 시스템:** 다음 4개 컬러만 사용하세요. 다른 컬러는 절대 사용하지 마세요.
  - 메인 컬러: \`#ff6b35\` (오렌지) - 포인트 컬러로 사용
  - 서브 컬러: \`#f5f5f5\` (라이트 그레이) - 서브 배경으로 사용
  - 블랙: \`#000000\` 또는 \`#171717\` (다크 그레이) - 강조 텍스트로 사용
  - 화이트: \`#ffffff\` 또는 \`#fafafa\` (라이트 그레이) - 기본 배경으로 사용
  - 그라데이션이 필요한 경우 위 4개 컬러의 명도 차이로만 구성하세요.
  - 다른 색상(빨강, 파랑, 초록 등)을 그라데이션에 사용하지 마세요.

- **텍스트 색상:** 다음 색상만 사용하세요.
  - 기본 텍스트: \`#666666\` (그레이)
  - 강조 텍스트: \`#000000\` (블랙)
  - 배경 텍스트: \`#ffffff\` (화이트)
  - 포인트 텍스트: \`#ff6b35\` (메인 컬러)

- **폰트 사이즈 및 정렬:** 최우선 개선 사항입니다.
  - 모든 텍스트에 반응형 폰트 사이즈를 적용하세요.
  - 모바일, 태블릿, 데스크톱별 폰트 사이즈를 정의하세요.
  - 모든 텍스트 정렬을 일관되게 적용하세요.
  - 제목은 왼쪽 또는 중앙 정렬, 본문은 왼쪽 정렬, 버튼은 중앙 정렬하세요.

- 접근성 가이드라인(WCAG 2.1)을 준수하세요.
- 반응형 디자인을 고려하세요.
- 성능에 부정적인 영향을 미치지 않도록 하세요.
- 기존 기능을 손상시키지 않도록 하세요.
- 사용자 경험을 향상시키는 것을 최우선으로 하세요.

---

## 추가 리소스

### 도구
- **접근성:** WebAIM Contrast Checker, WAVE, axe DevTools
- **성능:** Lighthouse, PageSpeed Insights, WebPageTest
- **SEO:** Google Search Console, Google Rich Results Test, Schema.org Validator
- **디자인:** Figma, Adobe XD, Sketch

### 문서
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Web Docs:** https://developer.mozilla.org/
- **Google Web Fundamentals:** https://web.dev/
- **A11y Project:** https://www.a11yproject.com/

### 학습 자료
- **접근성:** WebAIM, A11y Project
- **성능:** Web.dev, Google Developers
- **SEO:** Google Search Central, Moz
- **디자인:** Material Design, Human Interface Guidelines

---

**보고서 제공:** Pro Touch Design  
**작성자:** ${result.authorName} (${result.authorContact})  
**생성일:** ${new Date().toLocaleDateString("ko-KR")}  
**문의:** ${result.authorContact}

---

*이 지침서는 AI 기반 분석을 통해 생성되었습니다. 실제 구현 시 전문가의 검토를 권장합니다.*
`;

    const blob = new Blob([guidelines], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ProTouch-AI지침서-${result.siteName}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rank = getScoreRank(result.score.overall);

  // 섹션 네비게이션 메뉴
  const sections = [
    { id: "overall-score", label: "종합 점수" },
    { id: "distribution", label: "분포 차트" },
    { id: "seo-analysis", label: "SEO 분석" },
    { id: "issues", label: "문제점" },
    { id: "criteria", label: "분석 기준" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SectionNav sections={sections} />
      <section className="section section-light pt-[160px] md:pt-[176px]">
        <div className="container max-w-6xl">
          <div className="spacing-section pt-4">
            <div className="spacing-lg">
              <p className="text-primary mb-2 text-lg uppercase tracking-wider">
                분석 완료
              </p>
              <h2 className="mb-4 text-6xl font-bold">
                {result.siteName} 분석 결과
              </h2>
              <div className="mt-4 space-y-2 text-lg">
                <p className="font-medium">
                  <span className="text-gray-600">조사자:</span>{" "}
                  {result.authorName}
                </p>
                <p className="font-medium">
                  <span className="text-gray-600">연락처:</span>{" "}
                  {result.authorContact}
                </p>
              </div>
            </div>
            <div className="space-y-1  text-lg">
              <p>{result.siteAddress}</p>
              <p className="text-lg">{result.url}</p>
            </div>
          </div>

          {/* 스크린샷 섹션 */}
          {result.screenshotUrl && (
            <Card
              className="spacing-lg border-2 border-black mb-8"
              id="screenshot"
            >
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-3xl font-semibold">
                  사이트 스크린샷
                </CardTitle>
                <CardDescription>
                  분석 대상 웹사이트의 현재 상태
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative w-full overflow-hidden rounded-lg border-2 border-gray-200">
                  <img
                    src={result.screenshotUrl}
                    alt={`${result.siteName} 스크린샷`}
                    className="w-full h-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="spacing-lg border-2 border-black" id="overall-score">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-3xl font-semibold">
                종합 점수 및 등급
              </CardTitle>
              <CardDescription>전체 평균 점수와 상대 랭킹</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-center mb-12">
                <div
                  className={`mb-4 ${getScoreColor(result.score.overall)}`}
                  style={{
                    fontSize: "8rem",
                    fontWeight: "900",
                    lineHeight: "1",
                  }}
                >
                  {result.score.overall}
                </div>
                <div className="inline-block px-8 py-3 bg-black text-white mb-3 title-xl">
                  {rank.rank} 등급
                </div>
                <p className=" text-lg">
                  {rank.percentile} · {rank.label}
                </p>
              </div>

              {/* 레이더 차트 */}
              {(() => {
                const seoScore =
                  result.seo?.score ||
                  Math.round(
                    (result.score.performance + result.score.accessibility) / 2
                  );
                const radarData = [
                  {
                    category: "사용성",
                    score: result.score.usability,
                    fullMark: 100,
                  },
                  {
                    category: "접근성",
                    score: result.score.accessibility,
                    fullMark: 100,
                  },
                  {
                    category: "시각",
                    score: result.score.visual,
                    fullMark: 100,
                  },
                  {
                    category: "성능",
                    score: result.score.performance,
                    fullMark: 100,
                  },
                  { category: "SEO", score: seoScore, fullMark: 100 },
                ];

                // 레이더 차트 분석
                const avgScore =
                  radarData.reduce((sum, item) => sum + item.score, 0) /
                  radarData.length;
                const maxScore = Math.max(
                  ...radarData.map((item) => item.score)
                );
                const minScore = Math.min(
                  ...radarData.map((item) => item.score)
                );
                const weakAreas = radarData
                  .filter((item) => item.score < 60)
                  .map((item) => item.category);
                const strongAreas = radarData
                  .filter((item) => item.score >= 80)
                  .map((item) => item.category);

                return (
                  <div className="mt-12 mb-8">
                    <h3 className="text-3xl font-semibold mb-4 text-center">
                      종합 평가 레이더 차트
                    </h3>
                    <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">
                      레이더 차트는 5개 평가 항목(사용성, 접근성, 시각, 성능,
                      SEO)에 대한 종합적인 평가를 시각화합니다. 각 축의 점수가
                      중심에 가까울수록 해당 영역의 점수가 낮고, 바깥쪽에
                      가까울수록 높은 점수를 의미합니다. 균형잡힌 다각형 모양이
                      이상적입니다.
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="점수"
                          dataKey="score"
                          stroke="#f97316"
                          fill="#f97316"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-bold mb-3 text-lg">
                        레이더 차트 분석
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-2xl">
                        <div>
                          <p className="text-gray-600 mb-2">
                            평균 점수:{" "}
                            <span className="font-bold text-black">
                              {avgScore.toFixed(1)}점
                            </span>
                          </p>
                          <p className="text-gray-600 mb-2">
                            최고 점수:{" "}
                            <span className="font-bold text-green-600">
                              {maxScore}점
                            </span>{" "}
                            (
                            {
                              radarData.find((item) => item.score === maxScore)
                                ?.category
                            }
                            )
                          </p>
                          <p className="text-gray-600">
                            최저 점수:{" "}
                            <span className="font-bold text-red-600">
                              {minScore}점
                            </span>{" "}
                            (
                            {
                              radarData.find((item) => item.score === minScore)
                                ?.category
                            }
                            )
                          </p>
                        </div>
                        <div>
                          {strongAreas.length > 0 && (
                            <p className="text-gray-600 mb-2">
                              <span className="font-bold text-green-600">
                                강점 영역:
                              </span>{" "}
                              {strongAreas.join(", ")}
                            </p>
                          )}
                          {weakAreas.length > 0 && (
                            <p className="text-gray-600 mb-2">
                              <span className="font-bold text-red-600">
                                개선 필요:
                              </span>{" "}
                              {weakAreas.join(", ")}
                            </p>
                          )}
                          {weakAreas.length === 0 && (
                            <p className="text-gray-600">
                              <span className="font-bold text-green-600">
                                ✓
                              </span>{" "}
                              모든 영역이 60점 이상입니다.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 막대 차트 */}
              {(() => {
                const seoScore =
                  result.seo?.score ||
                  Math.round(
                    (result.score.performance + result.score.accessibility) / 2
                  );
                const barChartData = [
                  { name: "사용성", 점수: result.score.usability },
                  { name: "접근성", 점수: result.score.accessibility },
                  { name: "시각", 점수: result.score.visual },
                  { name: "성능", 점수: result.score.performance },
                  { name: "SEO", 점수: seoScore },
                ];

                // 막대 차트 분석
                const sortedData = [...barChartData].sort(
                  (a, b) => b.점수 - a.점수
                );
                const excellentCount = barChartData.filter(
                  (item) => item.점수 >= 80
                ).length;
                const goodCount = barChartData.filter(
                  (item) => item.점수 >= 60 && item.점수 < 80
                ).length;
                const poorCount = barChartData.filter(
                  (item) => item.점수 < 60
                ).length;

                return (
                  <div className="mt-12 mb-8">
                    <h3 className="text-3xl font-semibold mb-4 text-center">
                      세부 점수 비교
                    </h3>
                    <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">
                      막대 차트는 각 평가 항목의 점수를 한눈에 비교할 수 있게
                      해줍니다. 주황색 막대는 60점 이상(양호), 빨간색 막대는
                      60점 미만(개선 필요)을 나타냅니다. 모든 항목이 균형있게
                      높은 점수를 받는 것이 이상적입니다.
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={barChartData}
                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(value: number) => [`${value}점`, "점수"]}
                          labelFormatter={(label) => label}
                        />
                        <Bar
                          dataKey="점수"
                          fill="#f97316"
                          radius={[8, 8, 0, 0]}
                        >
                          <LabelList
                            dataKey="점수"
                            position="top"
                            formatter={(value: any) => value != null ? `${value}점` : ''}
                            style={{
                              fill: "#000",
                              fontSize: 14,
                              fontWeight: "bold",
                            }}
                          />
                          {barChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.점수 >= 60 ? "#f97316" : "#dc2626"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-bold mb-3 text-lg">점수 분포 분석</h4>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {excellentCount}개
                          </p>
                          <p className="text-gray-600">우수 (80점 이상)</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {goodCount}개
                          </p>
                          <p className="text-gray-600">양호 (60-79점)</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">
                            {poorCount}개
                          </p>
                          <p className="text-gray-600">개선 필요 (60점 미만)</p>
                        </div>
                      </div>
                      <div className="text-gray-700">
                        <p className="mb-2">
                          <span className="font-bold">최고 점수:</span>{" "}
                          {sortedData[0].name} ({sortedData[0].점수}점)
                        </p>
                        <p>
                          <span className="font-bold">최저 점수:</span>{" "}
                          {sortedData[sortedData.length - 1].name} (
                          {sortedData[sortedData.length - 1].점수}점)
                        </p>
                        {poorCount > 0 && (
                          <p className="mt-2 text-red-600">
                            ⚠️ {poorCount}개 항목이 개선이 필요합니다. 특히{" "}
                            {barChartData
                              .filter((item) => item.점수 < 60)
                              .map((item) => item.name)
                              .join(", ")}{" "}
                            항목에 집중하세요.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* 이슈 분석 차트 섹션 */}
          {(() => {
            const categoryCount: { [key: string]: number } = {};
            result.issues.forEach((issue) => {
              categoryCount[issue.category] =
                (categoryCount[issue.category] || 0) + 1;
            });
            const pieChartData = Object.entries(categoryCount).map(
              ([name, value]) => ({
                name,
                value,
              })
            );
            const COLORS = [
              "#f97316",
              "#ea580c",
              "#dc2626",
              "#991b1b",
              "#7f1d1d",
              "#431407",
            ];
            const severityCount = {
              high: result.issues.filter((i) => i.severity === "high").length,
              medium: result.issues.filter((i) => i.severity === "medium")
                .length,
              low: result.issues.filter((i) => i.severity === "low").length,
            };
            const severityData = [
              { name: "높음", value: severityCount.high, color: "#dc2626" },
              { name: "중간", value: severityCount.medium, color: "#f97316" },
              { name: "낮음", value: severityCount.low, color: "#6b7280" },
            ];

            return (
              <div
                className="grid md:grid-cols-2 gap-8 spacing-lg"
                id="distribution"
              >
                <Card className="border-2 border-black">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-3xl font-semibold">
                      이슈 카테고리 분포
                    </CardTitle>
                    <CardDescription>카테고리별 발견된 이슈 수</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <p className="text-gray-600 mb-4 text-center">
                      파이 차트는 발견된 이슈가 어떤 카테고리에 집중되어 있는지
                      보여줍니다. 비율이 높은 카테고리일수록 해당 영역에 더 많은
                      문제가 있다는 의미입니다.
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-bold mb-2">카테고리 분석:</p>
                      <div className="space-y-1 text-gray-700">
                        {pieChartData
                          .sort((a, b) => b.value - a.value)
                          .map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{item.name}</span>
                              <span className="font-semibold">
                                {item.value}개 (
                                {(
                                  (item.value / result.issues.length) *
                                  100
                                ).toFixed(1)}
                                %)
                              </span>
                            </div>
                          ))}
                      </div>
                      {pieChartData.length > 0 && (
                        <p className="mt-3 text-orange-600 font-medium">
                          💡 가장 많은 이슈가 발견된 카테고리:{" "}
                          <strong>
                            {
                              pieChartData.sort((a, b) => b.value - a.value)[0]
                                .name
                            }
                          </strong>{" "}
                          (
                          {
                            pieChartData.sort((a, b) => b.value - a.value)[0]
                              .value
                          }
                          개)
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-black">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-3xl font-semibold">
                      심각도 분포
                    </CardTitle>
                    <CardDescription>이슈 심각도별 통계</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <p className="text-lg text-gray-600 mb-4 text-center">
                      심각도 분포 차트는 발견된 이슈의 심각도 비율을 보여줍니다.
                      높은 심각도의 이슈가 많을수록 즉시 개선이 필요하며, 낮은
                      심각도는 장기적으로 개선해도 됩니다.
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}개`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-6 space-y-2 text-center">
                      <div className="flex justify-center gap-4 mb-4">
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-900 border-red-200"
                        >
                          높음: {severityCount.high}개
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-900 border-orange-200"
                        >
                          중간: {severityCount.medium}개
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-900 border-gray-200"
                        >
                          낮음: {severityCount.low}개
                        </Badge>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-lg text-left">
                        <p className="font-bold mb-2">우선순위 분석:</p>
                        {severityCount.high > 0 ? (
                          <p className="text-red-600 mb-2">
                            ⚠️ <strong>긴급:</strong> 높은 심각도 이슈{" "}
                            {severityCount.high}개를 우선적으로 해결하세요.
                          </p>
                        ) : (
                          <p className="text-green-600 mb-2">
                            ✓ 높은 심각도 이슈가 없습니다.
                          </p>
                        )}
                        {severityCount.medium > 0 && (
                          <p className="text-orange-600 mb-2">
                            📋 <strong>중요:</strong> 중간 심각도 이슈{" "}
                            {severityCount.medium}개는 단계적으로 개선하세요.
                          </p>
                        )}
                        {severityCount.low > 0 && (
                          <p className="text-gray-600">
                            📝 <strong>참고:</strong> 낮은 심각도 이슈{" "}
                            {severityCount.low}개는 여유가 있을 때 개선하세요.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          <PaymentGate showBlur={!isPaid && !isAdmin}>
            {/* SEO 분석 섹션 */}
            {(() => {
              const seoData = result.seo || {
                score: Math.round(
                  (result.score.performance + result.score.accessibility) / 2
                ),
                metaTags: {
                  title: true,
                  description: true,
                  keywords: false,
                  ogTags: true,
                },
                headings: {
                  h1Count: 1,
                  h1Structure: "good" as const,
                  headingHierarchy: "good" as const,
                },
                images: {
                  totalImages: 10,
                  imagesWithAlt: 8,
                  altTagCoverage: 80,
                },
                links: { internalLinks: 20, externalLinks: 5, brokenLinks: 0 },
                performance: {
                  pageSpeed: result.score.performance,
                  mobileFriendly: true,
                  coreWebVitals: { lcp: 2.5, fid: 100, cls: 0.1 },
                },
                structuredData: { hasSchema: false, schemaTypes: [] },
                issues: [],
              };

              return (
                <Card
                  className="spacing-lg border-2 border-black mt-8"
                  id="seo-analysis"
                >
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-3xl font-semibold">
                      SEO 분석
                    </CardTitle>
                    <CardDescription>
                      검색 엔진 최적화 및 웹사이트 성능 분석
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="text-center mb-8">
                      <div
                        className={`mb-4 font-extrabold ${getScoreColor(
                          seoData.score
                        )}`}
                        style={{
                          fontSize: "6rem",
                          fontWeight: "900",
                          lineHeight: "1",
                        }}
                      >
                        {seoData.score}
                      </div>
                      <p className="text-lg text-gray-600">SEO 점수</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 p-6 border border-gray-200">
                        <h4 className="font-bold mb-4">메타 태그</h4>
                        <div className="space-y-2 text-lg">
                          <div className="flex justify-between">
                            <span>Title 태그</span>
                            <Badge
                              variant={
                                seoData.metaTags.title
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {seoData.metaTags.title ? "✓ 있음" : "✗ 없음"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Description 태그</span>
                            <Badge
                              variant={
                                seoData.metaTags.description
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {seoData.metaTags.description
                                ? "✓ 있음"
                                : "✗ 없음"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Keywords 태그</span>
                            <Badge
                              variant={
                                seoData.metaTags.keywords
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {seoData.metaTags.keywords
                                ? "✓ 있음"
                                : "선택사항"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>OG 태그</span>
                            <Badge
                              variant={
                                seoData.metaTags.ogTags
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {seoData.metaTags.ogTags ? "✓ 있음" : "✗ 없음"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 border border-gray-200">
                        <h4 className="font-bold mb-4">헤딩 구조</h4>
                        <div className="space-y-2 text-lg">
                          <div className="flex justify-between">
                            <span>H1 태그 개수</span>
                            <span className="font-semibold">
                              {seoData.headings.h1Count}개
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>H1 구조</span>
                            <Badge
                              variant={
                                seoData.headings.h1Structure === "good"
                                  ? "default"
                                  : seoData.headings.h1Structure === "warning"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {seoData.headings.h1Structure === "good"
                                ? "✓ 양호"
                                : seoData.headings.h1Structure === "warning"
                                ? "⚠ 주의"
                                : "✗ 개선 필요"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>헤딩 계층 구조</span>
                            <Badge
                              variant={
                                seoData.headings.headingHierarchy === "good"
                                  ? "default"
                                  : seoData.headings.headingHierarchy ===
                                    "warning"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {seoData.headings.headingHierarchy === "good"
                                ? "✓ 양호"
                                : seoData.headings.headingHierarchy ===
                                  "warning"
                                ? "⚠ 주의"
                                : "✗ 개선 필요"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 border border-gray-200">
                        <h4 className="font-bold mb-4">이미지 최적화</h4>
                        <div className="space-y-2 text-lg">
                          <div className="flex justify-between">
                            <span>전체 이미지</span>
                            <span className="font-semibold">
                              {seoData.images.totalImages}개
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Alt 태그 있는 이미지</span>
                            <span className="font-semibold">
                              {seoData.images.imagesWithAlt}개
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Alt 태그 커버리지</span>
                            <span className="font-semibold">
                              {seoData.images.altTagCoverage}%
                            </span>
                          </div>
                          <div className="mt-4">
                            <Progress
                              value={seoData.images.altTagCoverage}
                              className={`h-3 ${
                                seoData.images.altTagCoverage >= 80
                                  ? "bg-green-500"
                                  : seoData.images.altTagCoverage >= 50
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 border border-gray-200">
                        <h4 className="font-bold mb-4">링크 분석</h4>
                        <div className="space-y-2 text-lg">
                          <div className="flex justify-between">
                            <span>내부 링크</span>
                            <span className="font-semibold">
                              {seoData.links.internalLinks}개
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>외부 링크</span>
                            <span className="font-semibold">
                              {seoData.links.externalLinks}개
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>깨진 링크</span>
                            <Badge
                              variant={
                                seoData.links.brokenLinks === 0
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {seoData.links.brokenLinks}개
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Core Web Vitals */}
                    <div className="bg-gray-50 p-6 border border-gray-200 mb-6">
                      <h4 className="font-bold mb-4">Core Web Vitals</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-lg text-gray-600 mb-2">
                            LCP (Largest Contentful Paint)
                          </div>
                          <div className="text-2xl font-bold">
                            {seoData.performance.coreWebVitals.lcp.toFixed(2)}s
                          </div>
                          <Badge
                            variant={
                              seoData.performance.coreWebVitals.lcp <= 2.5
                                ? "default"
                                : seoData.performance.coreWebVitals.lcp <= 4.0
                                ? "secondary"
                                : "destructive"
                            }
                            className="mt-2"
                          >
                            {seoData.performance.coreWebVitals.lcp <= 2.5
                              ? "✓ 좋음"
                              : seoData.performance.coreWebVitals.lcp <= 4.0
                              ? "⚠ 개선 필요"
                              : "✗ 나쁨"}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-lg text-gray-600 mb-2">
                            FID (First Input Delay)
                          </div>
                          <div className="text-2xl font-bold">
                            {seoData.performance.coreWebVitals.fid.toFixed(0)}ms
                          </div>
                          <Badge
                            variant={
                              seoData.performance.coreWebVitals.fid <= 100
                                ? "default"
                                : seoData.performance.coreWebVitals.fid <= 300
                                ? "secondary"
                                : "destructive"
                            }
                            className="mt-2"
                          >
                            {seoData.performance.coreWebVitals.fid <= 100
                              ? "✓ 좋음"
                              : seoData.performance.coreWebVitals.fid <= 300
                              ? "⚠ 개선 필요"
                              : "✗ 나쁨"}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-lg text-gray-600 mb-2">
                            CLS (Cumulative Layout Shift)
                          </div>
                          <div className="text-2xl font-bold">
                            {seoData.performance.coreWebVitals.cls.toFixed(2)}
                          </div>
                          <Badge
                            variant={
                              seoData.performance.coreWebVitals.cls <= 0.1
                                ? "default"
                                : seoData.performance.coreWebVitals.cls <= 0.25
                                ? "secondary"
                                : "destructive"
                            }
                            className="mt-2"
                          >
                            {seoData.performance.coreWebVitals.cls <= 0.1
                              ? "✓ 좋음"
                              : seoData.performance.coreWebVitals.cls <= 0.25
                              ? "⚠ 개선 필요"
                              : "✗ 나쁨"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 구조화된 데이터 */}
                    <div className="bg-gray-50 p-6 border border-gray-200">
                      <h4 className="font-bold mb-4">구조화된 데이터</h4>
                      <div className="flex justify-between items-center">
                        <span>Schema.org 마크업</span>
                        <Badge
                          variant={
                            seoData.structuredData.hasSchema
                              ? "default"
                              : "destructive"
                          }
                        >
                          {seoData.structuredData.hasSchema
                            ? "✓ 있음"
                            : "✗ 없음"}
                        </Badge>
                      </div>
                      {seoData.structuredData.schemaTypes.length > 0 && (
                        <div className="mt-4">
                          <div className="text-lg text-gray-600 mb-2">
                            Schema 타입:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {seoData.structuredData.schemaTypes.map(
                              (type, index) => (
                                <Badge key={index} variant="outline">
                                  {type}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SEO 이슈 */}
                    {seoData.issues && seoData.issues.length > 0 && (
                      <div className="mt-8">
                        <h4 className="font-bold mb-4">SEO 개선 사항</h4>
                        <div className="space-y-4">
                          {seoData.issues.map((issue, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={
                                    issue.severity === "high"
                                      ? "destructive"
                                      : issue.severity === "medium"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {issue.severity === "high"
                                    ? "높음"
                                    : issue.severity === "medium"
                                    ? "중간"
                                    : "낮음"}
                                </Badge>
                                <span className="font-semibold">
                                  {issue.title}
                                </span>
                              </div>
                              <p className="text-lg text-gray-700 mb-2">
                                {issue.description}
                              </p>
                              <p className="text-lg text-orange-900 font-medium">
                                💡 {issue.recommendation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}

            {/* SEO 이후 섹션 - 결제 필요 */}
            <div className="grid md:grid-cols-2 gap-8 spacing-lg">
              <Card className="border-2 border-black flex flex-col h-full">
                <CardHeader className="border-b border-gray-200 flex-shrink-0">
                  <div className="text-primary mb-2">PDF</div>
                  <CardTitle className="text-3xl font-semibold">
                    상세 개선 보고서
                  </CardTitle>
                  <CardDescription>전문가 수준의 분석 보고서</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col flex-1 min-h-0">
                  <p className="mb-6 flex-grow">
                    막대그래프, 등급 랭킹, 시각적 예시, 분석 기준이 포함된 전문
                    보고서
                  </p>
                  <div className="mt-auto pt-4">
                    <Button
                      onClick={downloadPDFReport}
                      className="btn-primary w-full"
                    >
                      PDF 보고서 다운로드
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-black flex flex-col h-full">
                <CardHeader className="border-b border-gray-200 flex-shrink-0">
                  <div className="text-primary mb-2">Markdown</div>
                  <CardTitle className="text-3xl font-semibold">
                    AI 작업 지침서
                  </CardTitle>
                  <CardDescription>AI에게 바로 전달 가능</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col flex-1 min-h-0">
                  <p className="mb-6 flex-grow">
                    ChatGPT, Claude 등 AI에게 바로 전달하여 디자인 개선 작업을
                    진행할 수 있는 지침서
                  </p>
                  <div className="mt-auto pt-4">
                    <Button
                      onClick={downloadAIGuideline}
                      className="btn-secondary w-full"
                    >
                      AI 지침서 다운로드
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="spacing-lg" id="issues">
              <div className="border-l-4 border-primary pl-6 spacing-lg">
                <h3 className="text-3xl font-semibold">발견된 문제점</h3>
                <p className="">{result.issues.length}개</p>
              </div>

              <div className="space-y-6">
                {result.issues.map((issue, index) => (
                  <Card key={index} className="border-2 border-gray-200">
                    <CardHeader className="border-b border-gray-200">
                      <div className="flex justify-between gap-4 spacing-sm">
                        <div className="text-3xl text-gray-300">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-300"
                          >
                            {issue.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSeverityColor(
                              issue.severity
                            )}`}
                          >
                            {getSeverityLabel(issue.severity)}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="title-xl">{issue.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div>
                        <p className="text-gray-500 mb-2">문제 상황</p>
                        <p className="text-gray-700">{issue.description}</p>
                      </div>
                      <div className="border-l-4 border-black pl-6 bg-gray-50 py-4">
                        <p className="text-gray-600 mb-2 uppercase tracking-wider">
                          개선 방안
                        </p>
                        <p className="text-gray-900">{issue.recommendation}</p>
                      </div>

                      {/* 개선된 디자인 이미지 */}
                      {issue.improvedDesignUrl && (
                        <div className="border-2 border-primary p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                          <p className="text-primary font-bold mb-3 text-lg flex items-center">
                            <span className="text-2xl mr-2">✨</span> AI 개선
                            디자인 제안
                          </p>
                          <div className="relative w-full overflow-hidden rounded-lg border-2 border-primary shadow-lg">
                            <img
                              src={issue.improvedDesignUrl}
                              alt={`${issue.title} 개선된 디자인`}
                              className="w-full h-auto"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                          <p className="mt-3 text-gray-700 text-sm italic">
                            AI가 생성한 개선된 디자인 제안입니다. 실제 적용 시
                            추가 검토가 필요합니다.
                          </p>
                        </div>
                      )}

                      {issue.visualExample && (
                        <div className="border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                          <p className="text-gray-600 mb-3">시각적 예시</p>
                          {issue.visualExample.type === "color" && (
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div
                                  className="w-20 h-20 border-2 border-black mb-2"
                                  style={{
                                    backgroundColor: issue.visualExample.before,
                                  }}
                                ></div>
                                <p className="text-xs">변경 전</p>
                                <p className="text-xs">
                                  {issue.visualExample.before}
                                </p>
                              </div>
                              <div className="text-2xl text-primary">→</div>
                              <div className="text-center">
                                <div
                                  className="w-20 h-20 border-2 border-black mb-2"
                                  style={{
                                    backgroundColor: issue.visualExample.after,
                                  }}
                                ></div>
                                <p className="text-xs">변경 후</p>
                                <p className="text-xs">
                                  {issue.visualExample.after}
                                </p>
                              </div>
                            </div>
                          )}
                          {issue.visualExample.type === "spacing" && (
                            <div className="space-y-2">
                              <p>
                                <span className="text-gray-500">변경 전:</span>{" "}
                                {issue.visualExample.before}
                              </p>
                              <p>
                                <span className="text-primary">변경 후:</span>{" "}
                                {issue.visualExample.after}
                              </p>
                            </div>
                          )}
                          {issue.visualExample.type === "size" && (
                            <div className="space-y-2">
                              <p>
                                <span className="text-gray-500">변경 전:</span>{" "}
                                {issue.visualExample.before}
                              </p>
                              <p>
                                <span className="text-primary">변경 후:</span>{" "}
                                {issue.visualExample.after}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 종합 평가 섹션 */}
            {(() => {
              const seoScore =
                result.seo?.score ||
                Math.round(
                  (result.score.performance + result.score.accessibility) / 2
                );
              const allScores = [
                { name: "사용성", score: result.score.usability },
                { name: "접근성", score: result.score.accessibility },
                { name: "시각 디자인", score: result.score.visual },
                { name: "성능", score: result.score.performance },
                { name: "SEO", score: seoScore },
              ];

              const overallScore = result.score.overall;
              const avgScore =
                allScores.reduce((sum, item) => sum + item.score, 0) /
                allScores.length;
              const maxScoreItem = allScores.reduce((max, item) =>
                item.score > max.score ? item : max
              );
              const minScoreItem = allScores.reduce((min, item) =>
                item.score < min.score ? item : min
              );

              const highSeverityCount = result.issues.filter(
                (i) => i.severity === "high"
              ).length;
              const mediumSeverityCount = result.issues.filter(
                (i) => i.severity === "medium"
              ).length;
              const lowSeverityCount = result.issues.filter(
                (i) => i.severity === "low"
              ).length;

              // 종합 평가 등급
              let overallGrade = "";
              let overallDescription = "";
              let overallColor = "";

              if (overallScore >= 90) {
                overallGrade = "S (최상)";
                overallDescription =
                  "웹사이트가 매우 우수한 수준입니다. 모든 영역에서 높은 점수를 받았으며, 발견된 이슈도 적은 편입니다.";
                overallColor = "text-green-600";
              } else if (overallScore >= 80) {
                overallGrade = "A (우수)";
                overallDescription =
                  "웹사이트가 우수한 수준입니다. 대부분의 영역에서 높은 점수를 받았으나, 일부 개선이 필요합니다.";
                overallColor = "text-blue-600";
              } else if (overallScore >= 70) {
                overallGrade = "B (양호)";
                overallDescription =
                  "웹사이트가 양호한 수준입니다. 기본적인 요구사항은 충족하나, 여러 영역에서 개선 여지가 있습니다.";
                overallColor = "text-orange-600";
              } else if (overallScore >= 60) {
                overallGrade = "C (보통)";
                overallDescription =
                  "웹사이트가 보통 수준입니다. 중요한 영역에서 개선이 필요하며, 사용자 경험을 향상시키기 위한 노력이 필요합니다.";
                overallColor = "text-yellow-600";
              } else if (overallScore >= 50) {
                overallGrade = "D (미흡)";
                overallDescription =
                  "웹사이트가 미흡한 수준입니다. 많은 영역에서 개선이 필요하며, 즉시 조치가 필요한 이슈가 다수 발견되었습니다.";
                overallColor = "text-red-600";
              } else {
                overallGrade = "F (불량)";
                overallDescription =
                  "웹사이트가 불량한 수준입니다. 전면적인 개선이 필요하며, 특히 높은 심각도의 이슈를 우선적으로 해결해야 합니다.";
                overallColor = "text-red-700";
              }

              // 주요 개선 영역
              const improvementAreas = allScores
                .filter((item) => item.score < 70)
                .sort((a, b) => a.score - b.score)
                .slice(0, 3)
                .map((item) => item.name);

              // 강점 영역
              const strengthAreas = allScores
                .filter((item) => item.score >= 80)
                .sort((a, b) => b.score - a.score)
                .map((item) => item.name);

              return (
                <Card className="spacing-lg border-2 border-primary mt-8 bg-gradient-to-br from-orange-50 to-white">
                  <CardHeader className="border-b border-orange-200">
                    <CardTitle className="text-4xl font-semibold">
                      종합 평가 및 권장 사항
                    </CardTitle>
                    <CardDescription>
                      전체 분석 결과를 종합한 평가와 개선 방향 제시
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="space-y-8">
                      {/* 전체 평가 */}
                      <div className="text-center p-6 bg-white border-2 border-orange-200 rounded-lg">
                        <div
                          className={`font-extrabold mb-4 ${overallColor}`}
                          style={{ fontSize: "3rem", lineHeight: "1" }}
                        >
                          {overallGrade}
                        </div>
                        <div
                          className="font-bold mb-2"
                          style={{ fontSize: "5rem", lineHeight: "1" }}
                        >
                          {overallScore}
                        </div>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-4">
                          {overallDescription}
                        </p>
                      </div>

                      {/* 핵심 지표 */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 border border-gray-200 rounded-lg text-center">
                          <div
                            className="font-bold text-gray-800 mb-2"
                            style={{ fontSize: "4rem", lineHeight: "1" }}
                          >
                            {result.issues.length}
                          </div>
                          <div className="text-lg text-gray-600">
                            발견된 이슈
                          </div>
                        </div>
                        <div className="bg-white p-6 border border-gray-200 rounded-lg text-center">
                          <div
                            className="font-bold text-red-600 mb-2"
                            style={{ fontSize: "4rem", lineHeight: "1" }}
                          >
                            {highSeverityCount}
                          </div>
                          <div className="text-lg text-gray-600">
                            높은 심각도
                          </div>
                        </div>
                        <div className="bg-white p-6 border border-gray-200 rounded-lg text-center">
                          <div
                            className="font-bold text-blue-600 mb-2"
                            style={{ fontSize: "4rem", lineHeight: "1" }}
                          >
                            {avgScore.toFixed(1)}
                          </div>
                          <div className="text-lg text-gray-600">평균 점수</div>
                        </div>
                      </div>

                      {/* 강점 및 개선 영역 */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {strengthAreas.length > 0 && (
                          <div className="bg-green-50 p-6 border border-green-200 rounded-lg">
                            <h4 className="font-bold text-lg mb-4 text-green-800 flex items-center">
                              <span className="text-2xl mr-2">✓</span> 강점 영역
                            </h4>
                            <ul className="space-y-4">
                              {strengthAreas.map((area, index) => {
                                const areaScore =
                                  allScores.find((item) => item.name === area)
                                    ?.score || 0;
                                return (
                                  <li
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <span className="text-lg font-semibold">
                                      {area}
                                    </span>
                                    <div
                                      className="bg-green-600 text-white px-4 py-2 rounded font-bold"
                                      style={{
                                        fontSize: "2rem",
                                        lineHeight: "1",
                                      }}
                                    >
                                      {areaScore}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                            <p className="mt-4 text-lg text-green-700">
                              이러한 영역은 잘 유지하고, 다른 영역 개선 시
                              참고할 수 있습니다.
                            </p>
                          </div>
                        )}

                        {improvementAreas.length > 0 && (
                          <div className="bg-red-50 p-6 border border-red-200 rounded-lg">
                            <h4 className="font-bold text-lg mb-4 text-red-800 flex items-center">
                              <span className="text-2xl mr-2">⚠️</span> 개선
                              필요 영역
                            </h4>
                            <ul className="space-y-4">
                              {improvementAreas.map((area, index) => {
                                const areaScore =
                                  allScores.find((item) => item.name === area)
                                    ?.score || 0;
                                return (
                                  <li
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <span className="text-lg font-semibold">
                                      {area}
                                    </span>
                                    <div
                                      className="bg-red-600 text-white px-4 py-2 rounded font-bold"
                                      style={{
                                        fontSize: "2rem",
                                        lineHeight: "1",
                                      }}
                                    >
                                      {areaScore}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                            <p className="mt-4 text-lg text-red-700">
                              이러한 영역에 집중하여 개선하면 전체 점수를 크게
                              향상시킬 수 있습니다.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 권장 개선 순서 */}
                      <div className="bg-blue-50 p-6 border border-blue-200 rounded-lg">
                        <h4 className="font-bold text-lg mb-4 text-blue-800">
                          권장 개선 순서
                        </h4>
                        <div className="space-y-4">
                          {highSeverityCount > 0 && (
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                                1
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-red-700 mb-1">
                                  긴급: 높은 심각도 이슈 해결
                                </p>
                                <p className="text-lg text-gray-700">
                                  높은 심각도의 이슈 {highSeverityCount}개를
                                  가장 먼저 해결하세요. 이러한 이슈들은 사용자
                                  경험에 직접적인 영향을 미칩니다.
                                </p>
                                {result.issues
                                  .filter((i) => i.severity === "high")
                                  .slice(0, 3)
                                  .map((issue, index) => (
                                    <p
                                      key={index}
                                      className="text-lg text-gray-600 mt-1 ml-4"
                                    >
                                      • {issue.title}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          )}

                          {minScoreItem.score < 70 && (
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                                {highSeverityCount > 0 ? 2 : 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-orange-700 mb-1">
                                  우선: {minScoreItem.name} 개선
                                </p>
                                <p className="text-lg text-gray-700">
                                  {minScoreItem.name} 영역이{" "}
                                  {minScoreItem.score}
                                  점으로 가장 낮은 점수를 받았습니다. 이 영역을
                                  개선하면 전체 평가 점수가 크게 향상될 수
                                  있습니다.
                                </p>
                              </div>
                            </div>
                          )}

                          {mediumSeverityCount > 0 && (
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                                {highSeverityCount > 0
                                  ? minScoreItem.score < 70
                                    ? 3
                                    : 2
                                  : minScoreItem.score < 70
                                  ? 2
                                  : 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-yellow-700 mb-1">
                                  중요: 중간 심각도 이슈 개선
                                </p>
                                <p className="text-lg text-gray-700">
                                  중간 심각도의 이슈 {mediumSeverityCount}개를
                                  단계적으로 개선하세요. 이러한 이슈들은 사용자
                                  경험을 개선하는 데 도움이 됩니다.
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">
                              {highSeverityCount > 0
                                ? minScoreItem.score < 70
                                  ? 4
                                  : 3
                                : minScoreItem.score < 70
                                ? 3
                                : 2}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-700 mb-1">
                                장기: 지속적인 모니터링 및 개선
                              </p>
                              <p className="text-lg text-gray-700">
                                낮은 심각도의 이슈와 SEO 최적화는 장기적으로
                                개선하세요. 정기적인 분석을 통해 웹사이트의
                                품질을 유지하고 향상시키세요.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 최종 권장사항 */}
                      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 border-2 border-orange-300 rounded-lg">
                        <h4 className="font-bold text-lg mb-4 text-orange-900">
                          최종 권장사항
                        </h4>
                        <div className="space-y-3 text-lg text-gray-800">
                          <p>
                            <strong>1. 즉시 조치:</strong>{" "}
                            {highSeverityCount > 0
                              ? `높은 심각도의 이슈 ${highSeverityCount}개를 최우선으로 해결하세요.`
                              : "긴급한 이슈가 없습니다. 중간 심각도 이슈부터 개선하세요."}
                          </p>
                          <p>
                            <strong>2. 단계적 개선:</strong>{" "}
                            {improvementAreas.length > 0
                              ? `${improvementAreas.join(
                                  ", "
                                )} 영역을 중점적으로 개선하세요.`
                              : "모든 영역이 양호한 수준입니다. 세부 개선에 집중하세요."}
                          </p>
                          <p>
                            <strong>3. 모니터링:</strong> 개선 작업 후 재분석을
                            통해 점수 변화를 확인하고, 지속적으로 웹사이트
                            품질을 모니터링하세요.
                          </p>
                          <p>
                            <strong>4. 사용자 피드백:</strong> 분석 결과를
                            바탕으로 실제 사용자 피드백을 수집하여 우선순위를
                            조정하세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            <div
              className="spacing-lg border-l-4 border-black pl-6 py-8 bg-gray-50"
              id="criteria"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-semibold spacing-md">
                  분석 기준 및 평가 방법
                </h3>
                <div className="text-right">
                  <div
                    className="text-primary font-extrabold"
                    style={{ fontSize: "4rem", lineHeight: "1" }}
                  >
                    {(() => {
                      const criteriaScores = [
                        { name: "사용성", score: result.score.usability },
                        { name: "접근성", score: result.score.accessibility },
                        { name: "시각 디자인", score: result.score.visual },
                        { name: "성능", score: result.score.performance },
                      ];
                      const passedCount = criteriaScores.filter(
                        (item) => item.score >= 60
                      ).length;
                      return `${passedCount}/4`;
                    })()}
                  </div>
                  <p className="text-lg text-gray-600 mt-2">항목 통과</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    number: 1,
                    name: "사용성",
                    score: result.score.usability,
                    description:
                      "내비게이션, CTA 버튼, 모바일 터치 영역, 폼 입력 편의성",
                  },
                  {
                    number: 2,
                    name: "접근성",
                    score: result.score.accessibility,
                    description:
                      "색상 대비율(4.5:1), 키보드 네비게이션, 스크린 리더, WCAG 2.1",
                  },
                  {
                    number: 3,
                    name: "시각 디자인",
                    score: result.score.visual,
                    description:
                      "타이포그래피, 여백 시스템(8px 그리드), 색상 팔레트, 시각적 위계",
                  },
                  {
                    number: 4,
                    name: "성능",
                    score: result.score.performance,
                    description:
                      "이미지 최적화(WebP), 번들 크기, 렌더링 성능, 모바일 최적화",
                  },
                ].map((criteria) => (
                  <div
                    key={criteria.number}
                    className={`bg-white p-6 border-2 rounded-lg ${
                      criteria.score >= 60
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            criteria.score >= 60 ? "bg-green-600" : "bg-red-600"
                          }`}
                          style={{ fontSize: "1.5rem" }}
                        >
                          {criteria.number}
                        </div>
                        <div>
                          <p className="text-xl font-bold mb-1">
                            {criteria.name}
                          </p>
                          <div
                            className={`font-extrabold ${
                              criteria.score >= 60
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                            style={{ fontSize: "2rem", lineHeight: "1" }}
                          >
                            {criteria.score}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-4xl ${
                          criteria.score >= 60
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {criteria.score >= 60 ? "✓" : "✗"}
                      </div>
                    </div>
                    <p className="text-lg text-gray-700">
                      {criteria.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {onBackToList && (
                <Button
                  onClick={onBackToList}
                  variant="outline"
                  className="text-lg py-6 px-12 border-2 border-black hover:bg-black hover:text-white"
                >
                  목록으로 돌아가기
                </Button>
              )}
              <Button
                onClick={onReset}
                variant="outline"
                className="text-lg py-6 px-12 border-2 border-black hover:bg-black hover:text-white"
              >
                다른 사이트 분석하기
              </Button>
            </div>
          </PaymentGate>
        </div>
      </section>
    </div>
  );
}
