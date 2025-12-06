import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  ReportSummary,
  EvaluationCriteria,
  Improvement,
} from "../pages/customer/report/types";
import { generateGuidelinePrompt } from "../pages/customer/report/guidelinePrompt";

export async function generateAnalysisReportPDF(
  report: ReportSummary,
  evaluationCriteria: EvaluationCriteria[],
  improvements: Improvement[],
  totalScore: number,
  elementId?: string
) {
  // DOM 요소가 제공되면 html2canvas로 캡처하여 PDF 생성 (한글 깨짐 방지)
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // 페이지 높이보다 작으면 한 페이지에
        if (imgHeight <= pdfHeight) {
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        } else {
          // 여러 페이지로 분할 - 더 작은 단위로
          let currentY = 0;
          let pageNum = 0;

          while (currentY < imgHeight) {
            if (pageNum > 0) {
              pdf.addPage();
            }

            // 현재 페이지에 표시할 이미지의 Y 위치
            const yPosition = -currentY;
            pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);

            currentY += pdfHeight;
            pageNum++;
          }
        }

        pdf.save(
          `analysis_report_${report.url}_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
        );
        return;
      } catch (error) {
        console.error("HTML2Canvas capture failed:", error);
        alert("PDF 생성 중 오류가 발생했습니다: " + error);
      }
    }
  }

  // ... 기존 텍스트 기반 생성 로직 (폴백) ...
  const pdf = new jsPDF("p", "mm", "a4");
  // ... (기존 코드 유지)
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  // 헬퍼 함수: 페이지 넘김 체크
  const checkPageBreak = (height: number) => {
    if (currentY + height > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // 헬퍼 함수: 텍스트 추가
  const addText = (
    text: string,
    fontSize: number,
    fontWeight: "normal" | "bold" = "normal",
    align: "left" | "center" | "right" = "left",
    color: string = "#000000"
  ) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", fontWeight);
    pdf.setTextColor(color);

    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.5;

    checkPageBreak(lines.length * lineHeight);

    if (align === "center") {
      pdf.text(text, pageWidth / 2, currentY, { align: "center" });
    } else if (align === "right") {
      pdf.text(text, pageWidth - margin, currentY, { align: "right" });
    } else {
      pdf.text(lines, margin, currentY);
    }

    currentY += lines.length * lineHeight + 2;
  };

  // 1. 표지
  addText("ProTouchDesign", 24, "bold", "center", "#293241");
  currentY += 10;
  addText("UX/UI Analysis Report", 36, "bold", "center", "#293241");
  currentY += 20;

  addText(`Target URL: ${report.url}`, 14, "normal", "center", "#666666");
  addText(`Date: ${report.analyzedAt}`, 12, "normal", "center", "#666666");

  currentY += 40;

  // 종합 점수
  addText(`Total Score: ${totalScore}/100`, 30, "bold", "center", "#EE6C4D");
  addText(`Grade: ${report.grade}`, 40, "bold", "center", "#EE6C4D");

  pdf.addPage();
  currentY = margin;

  // 2. 요약 (Summary)
  addText("1. Executive Summary", 18, "bold", "left", "#293241");
  currentY += 10;

  addText("Current Metrics", 14, "bold", "left");
  addText(`- Bounce Rate: ${report.currentMetrics.bounceRate}`, 12);
  addText(`- Avg Session Time: ${report.currentMetrics.avgSessionTime}`, 12);
  addText(`- Pages/Session: ${report.currentMetrics.pagesPerSession}`, 12);
  addText(`- Conversion Rate: ${report.currentMetrics.conversionRate}`, 12);

  currentY += 10;

  addText("Target Metrics", 14, "bold", "left");
  addText(`- Bounce Rate: ${report.targetMetrics.bounceRate}`, 12);
  addText(`- Avg Session Time: ${report.targetMetrics.avgSessionTime}`, 12);
  addText(`- Pages/Session: ${report.targetMetrics.pagesPerSession}`, 12);
  addText(`- Conversion Rate: ${report.targetMetrics.conversionRate}`, 12);

  currentY += 20;

  // 3. 치명적 문제
  addText("2. Critical Issues", 18, "bold", "left", "#293241");
  currentY += 10;

  const criticalItems = improvements.filter((i) => i.priority === "critical");
  criticalItems.forEach((item, index) => {
    checkPageBreak(40);
    addText(`${index + 1}. ${item.title}`, 14, "bold");
    addText(`Current: ${item.currentState}`, 12);
    addText(`Target: ${item.targetState}`, 12);
    addText(`Impact: ${item.impact}`, 12);
    currentY += 5;
  });

  pdf.addPage();
  currentY = margin;

  // 4. AI 디자인 지침서
  addText("3. AI Design Guidelines", 18, "bold", "left", "#293241");
  currentY += 10;

  const guidelineText = generateGuidelinePrompt({
    report,
    evaluationCriteria,
    improvements,
    totalScore,
  });

  addText(guidelineText, 10);

  pdf.save(
    `analysis_report_${report.url}_${new Date().toISOString().slice(0, 10)}.pdf`
  );
}
