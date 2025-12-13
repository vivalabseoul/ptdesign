import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  ReportSummary,
  EvaluationCriteria,
  Improvement,
} from "../pages/customer/report/types";

/**
 * 템플릿 HTML을 PDF로 변환하는 함수
 */
export async function generateReportPDF(
  report: ReportSummary,
  evaluationCriteria: EvaluationCriteria[],
  improvements: Improvement[],
  totalScore: number,
  reportElement?: HTMLElement | null
) {
  let container: HTMLElement;
  let shouldRemoveContainer = false;

  if (!reportElement) {
    // 레이더 차트 이미지 캡처 (있는 경우) - 원본을 건드리지 않기 위해 복제본 사용
    let radarChartImage = "";
    let chartClone: HTMLElement | null = null;
    try {
      const overviewContent = document.getElementById("overview-content");
      if (overviewContent) {
        const radarChartElement = overviewContent.querySelector(
          '.recharts-wrapper, [class*="RadarChart"]'
        );
        if (radarChartElement) {
          const chartContainer = radarChartElement.closest(
            '.card-base, .card-padding, div[class*="col-span"]'
          );
          const targetElement = (chartContainer ||
            radarChartElement) as HTMLElement;

          chartClone = targetElement.cloneNode(true) as HTMLElement;
          chartClone.style.position = "fixed";
          chartClone.style.left = "-9999px";
          chartClone.style.top = "0";
          chartClone.style.visibility = "visible";
          chartClone.style.opacity = "1";
          chartClone.style.width = `${targetElement.offsetWidth}px`;
          chartClone.style.height = `${targetElement.offsetHeight}px`;
          chartClone.style.zIndex = "-1000";
          document.body.appendChild(chartClone);

          await new Promise((resolve) => setTimeout(resolve, 500));
          const chartCanvas = await html2canvas(chartClone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            width: chartClone.scrollWidth,
            height: chartClone.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
          });
          radarChartImage = chartCanvas.toDataURL("image/png");

          if (chartClone.parentNode) {
            document.body.removeChild(chartClone);
          }
          chartClone = null;
        }
      }
    } catch (e) {
      console.warn("레이더 차트 캡처 실패:", e);
      if (chartClone && chartClone.parentNode) {
        document.body.removeChild(chartClone);
      }
    }

    const templateHTML = createOverviewTemplateHTML(
      report,
      evaluationCriteria,
      improvements,
      totalScore,
      radarChartImage
    );

    container = document.createElement("div");
    container.id = "pdf-template-container";
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.transform = "translate(-200%, -200%)";
    container.style.width = "210mm";
    container.style.backgroundColor = "#ffffff";
    container.style.zIndex = "-1000";
    container.innerHTML = templateHTML;
    document.body.appendChild(container);
    shouldRemoveContainer = true;

    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  } else {
    // Fallback for legacy calls (should not be used for overview PDF)
    container = reportElement.cloneNode(true) as HTMLElement;
    container.id = "pdf-clone-container";
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.transform = "translate(-200%, -200%)";
    container.style.width = "210mm";
    container.style.backgroundColor = "#ffffff";
    container.style.zIndex = "-1000";
    document.body.appendChild(container);
    shouldRemoveContainer = true;
  }

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: container.scrollWidth,
      height: container.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;

    let currentY = 0;
    let pageNum = 0;
    // const minSectionHeight = 40; // Unused

    const totalCanvasHeight = canvas.height;
    const pageCanvasHeight = (pdfHeight * canvas.width) / pdfWidth;

    while (currentY < totalCanvasHeight) {
      if (pageNum > 0) {
        pdf.addPage();
      }

      const remainingCanvasHeight = totalCanvasHeight - currentY;
      const currentSliceHeight = Math.min(
        remainingCanvasHeight,
        pageCanvasHeight
      );

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = currentSliceHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          currentSliceHeight,
          0,
          0,
          canvas.width,
          currentSliceHeight
        );
      }

      const pdfImgHeight = (currentSliceHeight * pdfWidth) / canvas.width;
      const pageImgData = pageCanvas.toDataURL("image/png");
      pdf.addImage(pageImgData, "PNG", 0, 0, imgWidth, pdfImgHeight);

      currentY += currentSliceHeight;
      pageNum++;
    }

    if (shouldRemoveContainer && container.parentNode) {
      document.body.removeChild(container);
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const fileName = `ProTouchDesign_Analysis_Report_${dateStr}.pdf`;
    console.log('PDF 생성 시작, 파일명:', fileName);
    
    // PDF 저장
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF 생성 실패:", error);
    if (shouldRemoveContainer && container.parentNode) {
      document.body.removeChild(container);
    }
    throw error;
  }
}

export function createOverviewTemplateHTML(
  report: ReportSummary,
  evaluationCriteria: EvaluationCriteria[],
  improvements: Improvement[],
  totalScore: number,
  radarChartImage?: string
): string {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "#DC2626";
      case "high":
        return "#EA580C";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "치명적";
      case "high":
        return "높음";
      case "medium":
        return "중간";
      case "low":
        return "낮음";
      default:
        return priority;
    }
  };

  const getGrade = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 70) return "B";
    if (score >= 50) return "C";
    return "D";
  };

  const grade = getGrade(totalScore);
  const gradeColor =
    totalScore >= 90
      ? "#84A98C"
      : totalScore >= 70
      ? "#84A98C"
      : totalScore >= 50
      ? "#F59E0B"
      : "#EE6C4D";

  // Top 3 개선 항목 (긴급)
  const top3Improvements = improvements
    .sort((a, b) => {
      const priorityOrder: { [key: string]: number } = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      const pA = priorityOrder[a.priority.toLowerCase()] ?? 99;
      const pB = priorityOrder[b.priority.toLowerCase()] ?? 99;
      return pA - pB;
    })
    .slice(0, 3);

  // SEO 카테고리 찾기
  const seoCategory = evaluationCriteria.find((c) =>
    c.category.toUpperCase().includes("SEO")
  );
  
  console.log("SEO Category found:", seoCategory); // 디버깅용

  // 카테고리별 설명 가져오기
  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      "첫인상": "웹사이트의 첫인상은 사용자에게 중요한 영향을 하며, 그런 점에서 잘 설계되어 있습니다.",
      "이탈 방지": "사용자 이탈을 방지하기 위한 여러 요소가 있지만 발 가지 문제점이 존재함.",
      "모바일 경험": "모바일 디바이스에서의 경험이 매우 우수하며, 사용자 친화적임.",
      "체류 유도": "사용자가 머무르고 싶게 만드는 요소가 부족함.",
      "접근성": "접근성 측면에서 기본적인 요소는 최적화되어 있으나 개선의 여지가 있음.",
      "SEO": "SEO 최적화가 부족하여 검색 엔진 유입이 낮음.",
      "디자인": "시각적 일관성, 색상 조화, 타이포그래피",
      "사용성": "네비게이션, 정보 구조, 사용자 편의성",
      "성능": "로딩 속도, 최적화, 리소스 관리",
      "콘텐츠": "가독성, 정보 품질, 콘텐츠 구조",
      "모바일": "반응형 디자인, 터치 인터페이스, 모바일 최적화",
    };
    return descriptions[category] || "종합 평가";
  };

  // 카테고리별 가중치 가져오기
  const getCategoryWeight = (category: string) => {
    const weights: { [key: string]: string } = {
      "첫인상": "20%",
      "이탈 방지": "30%",
      "모바일 경험": "20%",
      "체류 유도": "10%",
      "접근성": "10%",
      "SEO": "10%",
      "디자인": "20%",
      "사용성": "25%",
      "성능": "15%",
      "콘텐츠": "15%",
      "모바일": "15%",
    };
    return weights[category] || "10%";
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans KR', sans-serif;
          color: #111111;
          background: #ffffff;
          width: 100%;
          height: auto;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .page-1, .page-2 {
          height: auto;
          min-height: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          page-break-after: always;
        }

        .page-2:last-child {
          page-break-after: auto;
        }
        
        h1 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          color: #111111;
        }
        
        h2 {
          font-size: 18px;
          font-weight: 700;
          color: #111111;
          padding-bottom: 6px;
          width: 100%;
        }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #E5E7EB;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .logo {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 4px;
          color: #111111;
        }

        .report-meta {
          font-size: 11px;
          color: #6B7280;
        }
        
        .score-box {
          display: flex;
          align-items: center;
        }
        
        .score-val {
          font-size: 32px;
          font-weight: 800;
          color: #111111;
        }

        .score-grade {
          font-size: 32px;
          font-weight: 800;
          color: ${gradeColor};
          padding-left: 12px;
        }
        
        .section {
          margin-bottom: 25px;
        }

        .section-margin {
          margin-top 40px;
        }

        .section-desc {
          font-size: 11px;
          color: #6B7280;
          margin-bottom: 12px;
          line-height: 1.6;
        }

        /* 상단 차트 & 지표 레이아웃 (1열: 좌 차트, 우 지표) */
        .top-chart-metrics {
          display: flex;
          gap: 10px;
          align-items: stretch;
          margin-bottom: 5px;
        }

            .left-chart {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100px;
      max-width: 450px;
    }

        .right-metrics {
          flex: 1 ;
          display: flex;
          flex-direction: column;
        }

        /* 핵심 지표 (2열 그리드) - 우측 배치용 */
        .metrics-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          height: 100%;
        }
        
        .metric-card {
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .metric-label {
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 6px;
          font-weight: 600;
          text-align: center;
        }
        
        .metric-value {
          font-size: 26px;
          font-weight: 800;
          color: #111111;
          margin-bottom: 4px;
          text-align: center;
        }
        
        .metric-target {
          font-size: 14px;
          color: #9CA3AF;
          text-align: center;
        }
        
        .chart-image {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }

        /* 평가 기준 요약 (3열) */
        .criteria-grid-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .criteria-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 10px 10px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          background: #fff;
        }

        .criteria-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 4px;
        }

        .criteria-desc {
          font-size: 10px;
          color: #4B5563;
          margin-bottom: 6px;
        }

        .criteria-weight {
          font-size: 12px;
          color: #9CA3AF;
        }

        .criteria-name {
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .criteria-val {
          font-size: 24px;
          font-weight: 800;
          display: flex;
          align-items: center;
        }

        /* 긴급 개선 필요 항목 (Top 3 - 3열) */
        .top3-grid-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        /* 개선 항목 (2열) */
        .improvement-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 4fr);
          gap: 10px;
        }
        
        .improvement-card {
          border: 1px solid #E5E7EB;
          padding: 14px;
          border-radius: 4px;
          background: #ffffff;
          height: 100%;
        }
        
        .improvement-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .improvement-title {
          font-weight: 700;
          font-size: 13px;
          color: #111111;
          display: flex;
        }
        
        .improvement-desc {
          font-size: 11px;
          color: #4B5563;
          margin-bottom: 4px;
        }

        .improvement-meta {
          font-size: 10px; 
          color: #9CA3AF; 
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
        }

        /* SEO 분석 요약 (4열) */
        .seo-grid-4col {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .seo-item {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .seo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 4px;
        }

        .seo-desc {
          font-size: 9px;
          color: #6B7280;
          line-height: 1.4;
        }
        
        .seo-name {
          font-weight: 600;
          font-size: 11px;
        }
        
        .seo-score {
          font-size: 18px;
          font-weight: 800;
        }
      </style>
    </head>
    <body>
      <!-- 1페이지 -->
      <div class="page-1">
        <!-- 헤더 -->
        <div class="header-section">
          <div class="header-left">
            <div class="logo">ProTouchDesign</div>
            <h1>UX/UI 분석 리포트</h1>
            <div class="report-meta">
              <span>${report.url}</span> <span>${report.analyzedAt}</span>
            </div>
          </div>
          <div class="score-box">
            <div class="score-val">${totalScore}점</div>
            <div class="score-grade">Grade ${grade}</div>
          </div>
        </div>
        
        <!-- 상단: 차트(좌) + 핵심지표(우) -->
        <div class="section">
          <h2>종합 분석 요약</h2>
          <p class="section-desc">웹사이트의 주요 성과 지표와 영역별 점수 분포를 한눈에 확인할 수 있습니다. 현재 상태와 목표치를 비교하여 개선 방향을 파악하세요.</p>
          <div class="top-chart-metrics">
            <!-- 좌측: 레이더 차트 -->
            <div class="left-chart">
              ${
                radarChartImage
                  ? `<img src="${radarChartImage}" alt="영역별 점수 분포" class="chart-image" />`
                  : '<p style="color:#9CA3AF">차트 없음</p>'
              }
            </div>
            
            <!-- 우측: 핵심 지표 (2열 그리드) -->
            <div class="right-metrics">
              <div class="metrics-grid-2col">
                <div class="metric-card">
                  <div class="metric-label">이탈률</div>
                  <div class="metric-value">${
                    report.currentMetrics.bounceRate
                  }</div>
                  <div class="metric-target">목표: ${
                    report.targetMetrics.bounceRate
                  }</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">평균 체류 시간</div>
                  <div class="metric-value">${
                    report.currentMetrics.avgSessionTime
                  }</div>
                  <div class="metric-target">목표: ${
                    report.targetMetrics.avgSessionTime
                  }</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">페이지/세션</div>
                  <div class="metric-value">${
                    report.currentMetrics.pagesPerSession
                  }</div>
                  <div class="metric-target">목표: ${
                    report.targetMetrics.pagesPerSession
                  }</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">전환율</div>
                  <div class="metric-value">${
                    report.currentMetrics.conversionRate
                  }</div>
                  <div class="metric-target">목표: ${
                    report.targetMetrics.conversionRate
                  }</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 긴급 개선 필요 항목 (Top 3 - 3열) -->
        ${
          top3Improvements.length > 0
            ? `
        <div class="section">
          <h2>긴급 개선 필요 항목 (Top 3)</h2>
          <p class="section-desc">우선순위가 가장 높은 개선 항목입니다. 현재 상태와 목표 상태를 확인하고 즉시 개선 작업을 시작하세요.</p>
          <div class="top3-grid-3col">
          ${top3Improvements
            .map((item) => {
              const priorityColor = getPriorityColor(item.priority);
              return `
            <div class="improvement-card">
              <div class="improvement-header">
                <span style="color: ${priorityColor}; font-weight: 700; font-size: 12px;">[${getPriorityLabel(
                item.priority
              )}]</span>
              </div>
              <div class="improvement-title" style="margin-bottom: 8px;">${
                item.title
              }</div>
              <div class="improvement-desc">
                <span style="color: #DC2626;">현: ${
                  item.currentState
                }</span><br/>
                <span style="color: #84A98C;">목: ${item.targetState}</span>
              </div>
            </div>
          `;
            })
            .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- 평가 기준 요약 (3열) -->
        <div class="section ">
          <h2>평가 기준 요약</h2>
          <p class="section-desc">웹사이트의 주요 평가 영역별 점수입니다. 각 영역은 사용자 경험, 접근성, 성능 등을 종합적으로 평가합니다.</p>
          <div class="criteria-grid-3col">
            ${evaluationCriteria
              .map((c) => {
                const scoreColor =
                  c.score >= 80
                    ? "#84A98C"
                    : c.score >= 50
                    ? "#F59E0B"
                    : "#EE6C4D";
                return `
              <div class="criteria-item">
                <div class="criteria-header">
                  <span class="criteria-name">${c.category}</span>
                  <span class="criteria-val" style="color: ${scoreColor};">${c.score}</span>
                </div>
                <div class="criteria-desc">${getCategoryDescription(c.category)}</div>
                <div class="criteria-weight">가중치: ${getCategoryWeight(c.category)}</div>
              </div>
            `;
              })
              .join("")}
          </div>
        </div>
      </div>
      
      <!-- 2페이지 -->
      <div class="page-2">
        <!-- SEO 분석 요약 (4열) -->
        <div class="section section-margin">
          <h2>SEO 분석 요약</h2>
          <p class="section-desc">검색 엔진 최적화(SEO) 관련 세부 항목별 점수입니다. 메타 태그, 구조화 데이터, 페이지 속도 등을 평가합니다.</p>
          <div class="seo-grid-4col">
            ${
              seoCategory && seoCategory.subcriteria && seoCategory.subcriteria.length > 0
                ? seoCategory.subcriteria
                    .map(
                      (sub) => `
                    <div class="seo-item">
                      <div class="seo-header">
                        <span class="seo-name">${sub.name}</span>
                        <span class="seo-score" style="color: ${
                          sub.score >= 80
                            ? "#84A98C"
                            : sub.score >= 60
                            ? "#F59E0B"
                            : "#EE6C4D"
                        }">${sub.score}</span>
                      </div>
                      <div class="seo-desc">${sub.description}</div>
                    </div>
                  `
                    )
                    .join("")
                : `
                  <div class="seo-item">
                    <div class="seo-header">
                      <span class="seo-name">메타 태그</span>
                      <span class="seo-score" style="color: #F59E0B">38</span>
                    </div>
                    <div class="seo-desc">title 길이 초과, description 중복</div>
                  </div>
                  <div class="seo-item">
                    <div class="seo-header">
                      <span class="seo-name">Heading 구조</span>
                      <span class="seo-score" style="color: #F59E0B">45</span>
                    </div>
                    <div class="seo-desc">H1 여러 개, H2-H6 순서 불규칙</div>
                  </div>
                  <div class="seo-item">
                    <div class="seo-header">
                      <span class="seo-name">이미지 Alt</span>
                      <span class="seo-score" style="color: #F59E0B">42</span>
                    </div>
                    <div class="seo-desc">65%의 이미지에 alt 없음</div>
                  </div>
                  <div class="seo-item">
                    <div class="seo-header">
                      <span class="seo-name">구조화 데이터</span>
                      <span class="seo-score" style="color: #EE6C4D">0</span>
                    </div>
                    <div class="seo-desc">Schema.org 마크업 없음</div>
                  </div>
                `
            }
          </div>
        </div>

        <!-- 전체 개선 항목 (2열-4줄) -->
        ${
          improvements.length > 0
            ? `
        <div class="section">
          <h2>전체 개선 항목</h2>
          <p class="section-desc">모든 개선 필요 항목의 상세 정보입니다. 카테고리, 우선순위, 영향도, 난이도를 고려하여 개선 계획을 수립하세요.</p>
          <div class="improvement-grid-2col">
          ${improvements
            .slice(0, 8) // 공간상 8개까지만 표시 (예시)
            .map((item) => {
              const priorityColor = getPriorityColor(item.priority);
              return `
            <div class="improvement-card">
              <div class="improvement-header">
                <span style="color: ${priorityColor}; font-weight: 700; font-size: 12px;">[${getPriorityLabel(
                item.priority
              )}]</span>
                <span class="improvement-title" style="flex:1;">${
                  item.title
                }</span>
              </div>
              <div class="improvement-desc" style="display:flex; justify-content:space-between;">
                <span><strong>카테고리:</strong> ${item.category}</span>
              </div>
              <div class="improvement-desc">
                <span style="color: #DC2626;"><strong>현재:</strong> ${
                  item.currentState
                }</span>
              </div>
              <div class="improvement-desc">
                <span style="color: #84A98C;"><strong>목표:</strong> ${
                  item.targetState
                }</span>
              </div>
              <div class="improvement-meta">
                <span>영향도: ${item.impact}</span>
                <span>난이도: ${item.effort}</span>
              </div>
            </div>
          `;
            })
            .join("")}
          </div>
        </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `;
}
