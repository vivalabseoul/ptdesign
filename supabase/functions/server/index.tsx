import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createRadarChart } from "./report/chart.ts";
import { generatePDFReport } from "./report/pdf.ts";
import { takeScreenshot } from "./screenshot.ts";
import { generateImprovedDesignsForIssues } from "./improved-design.ts";

const app = new Hono();

// Logging & CORS
app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: ["https://oz-ui-retouch.com", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// --- UI/UX 분석 엔드포인트 ---
app.post("/analyze", async (c) => {
  try {
    const { url, siteName, authorName, authorContact } = await c.req.json();
    if (!url || !siteName || !authorName || !authorContact)
      return c.json({ error: "모든 필드를 입력해주세요." }, 400);

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) return c.json({ error: "API 키가 누락되었습니다." }, 500);

    const prompt = `
당신은 세계적인 UI/UX 분석가입니다. 다음 웹사이트를 전문적으로 분석하세요:
${url}

**중요: 점수는 매우 엄격하게 평가하세요. 대부분의 웹사이트는 60-75점 정도입니다. 80점 이상은 정말 우수한 사이트이며, 90점 이상은 거의 없습니다.**

## 점수 평가 기준 (매우 엄격하게 적용)

### 1. 사용성 (Usability) - 0-100점
- **90-100점**: 내비게이션이 완벽하고 직관적, CTA가 명확, 모바일 최적화 완벽, 폼 UX 우수
- **80-89점**: 대체로 좋지만 일부 개선 필요
- **70-79점**: 기본 기능은 작동하지만 사용성이 평균 이하
- **60-69점**: 사용하기 어려운 부분이 많음
- **50-59점**: 심각한 사용성 문제 존재
- **0-49점**: 사용하기 매우 어려움

### 2. 접근성 (Accessibility) - 0-100점 (WCAG 2.1 기준)
- **90-100점**: WCAG AAA 준수, 모든 접근성 요구사항 충족
- **80-89점**: WCAG AA 대부분 준수
- **70-79점**: 기본 접근성은 있으나 개선 필요
- **60-69점**: 접근성 문제가 다수 존재
- **50-59점**: 심각한 접근성 문제
- **0-49점**: 접근성 거의 없음

### 3. 시각 디자인 (Visual Design) - 0-100점
- **90-100점**: 타이포그래피, 여백, 색상이 완벽하게 조화, 시각적 위계 명확
- **80-89점**: 대체로 잘 디자인되었으나 일부 개선 여지
- **70-79점**: 평균적인 디자인 품질
- **60-69점**: 디자인 일관성 부족
- **50-59점**: 시각적 문제가 많음
- **0-49점**: 디자인 품질이 매우 낮음

### 4. 성능 (Performance) - 0-100점
- **90-100점**: 로딩 속도 매우 빠름, 이미지 최적화 완벽, 번들 크기 최적
- **80-89점**: 성능이 좋으나 일부 최적화 여지
- **70-79점**: 평균적인 성능
- **60-69점**: 성능 개선 필요
- **50-59점**: 느린 로딩, 최적화 부족
- **0-49점**: 매우 느림

### 종합 점수 (Overall)
- 종합 점수는 4개 항목의 평균이지만, 가장 낮은 항목에 더 가중치를 둡니다.
- **90-100점**: 업계 최상위 5% 수준 (매우 드뭄)
- **80-89점**: 상위 15% 수준
- **70-79점**: 상위 40% 수준
- **60-69점**: 중간 수준
- **50-59점**: 하위 40% 수준
- **0-49점**: 하위 20% 수준

**점수 부여 원칙:**
- 문제가 발견되면 즉시 감점하세요
- 완벽하지 않으면 90점 이상 주지 마세요
- 평균적인 웹사이트는 60-70점입니다
- 정말 우수한 사이트만 80점 이상을 주세요

다음 JSON 구조로 응답하세요:
{
  "issues": [
    {
      "category": "usability|accessibility|visual|performance",
      "severity": "high|medium|low",
      "title": "문제 제목",
      "description": "상세 설명",
      "recommendation": "개선 방안"
    }
  ],
  "score": {
    "overall": 0-100,
    "usability": 0-100,
    "accessibility": 0-100,
    "visual": 0-100,
    "performance": 0-100
  },
  "summary": "핵심 문제 요약 (3줄)"
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "당신은 매우 엄격한 UI/UX 분석가입니다. 점수를 후하게 주지 마세요. 대부분의 웹사이트는 60-75점 정도이며, 80점 이상은 정말 우수한 사이트에만 주세요. 문제를 발견하면 즉시 감점하세요.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("OpenAI API 오류:", response.status, errorData);
      return c.json(
        {
          error: `AI 분석 서비스 오류 (${response.status}): ${
            errorData.error?.message || errorData.error || "알 수 없는 오류"
          }`,
        },
        500
      );
    }

    const data = await response.json();

    // OpenAI API 응답 검증
    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error(
        "OpenAI API 응답 형식 오류:",
        JSON.stringify(data, null, 2)
      );
      return c.json({ error: "AI 분석 응답 형식이 올바르지 않습니다." }, 500);
    }

    let content;
    try {
      content = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      console.error("원본 응답:", data.choices[0].message.content);
      return c.json(
        { error: "AI 분석 결과를 파싱하는 중 오류가 발생했습니다." },
        500
      );
    }

    // 필수 필드 검증
    if (!content.score || !content.issues) {
      console.error("필수 필드 누락:", content);
      return c.json(
        { error: "AI 분석 결과에 필수 필드가 누락되었습니다." },
        500
      );
    }

    // 스크린샷 생성
    let screenshotUrl: string | null = null;
    let screenshotError: string | null = null;
    try {
      screenshotUrl = await takeScreenshot(url);
      if (screenshotUrl) {
        console.log("스크린샷 생성 완료:", screenshotUrl);
      } else {
        screenshotError =
          "스크린샷 API 키가 설정되지 않았거나 스크린샷 생성에 실패했습니다.";
        console.warn("스크린샷 생성 실패:", screenshotError);
      }
    } catch (error) {
      screenshotError = `스크린샷 생성 중 오류 발생: ${
        error instanceof Error ? error.message : String(error)
      }`;
      console.error("스크린샷 생성 실패:", screenshotError);
    }

    // 개선된 디자인 이미지 생성 (높은 심각도 이슈 우선)
    let improvedDesignUrls: Array<{
      issueId: string;
      issueTitle: string;
      imageUrl: string;
      description: string;
    }> = [];

    try {
      if (content.issues && content.issues.length > 0) {
        const improvedDesigns = await generateImprovedDesignsForIssues(
          content.issues,
          screenshotUrl || undefined
        );

        improvedDesignUrls = improvedDesigns.map((design, index) => ({
          issueId: `issue-${index}`,
          issueTitle: design.issueTitle,
          imageUrl: design.imageUrl,
          description: design.description,
        }));

        // 각 이슈에 개선된 디자인 URL 매핑
        content.issues = content.issues.map((issue: any, index: number) => {
          const improvedDesign = improvedDesigns.find(
            (d) => d.issueTitle === issue.title
          );
          return {
            ...issue,
            improvedDesignUrl: improvedDesign?.imageUrl,
          };
        });
      }
    } catch (error) {
      console.error("개선된 디자인 이미지 생성 실패:", error);
    }

    const result = {
      id: crypto.randomUUID(),
      url,
      siteName,
      authorName,
      authorContact,
      analysisDate: new Date().toISOString(),
      screenshotUrl: screenshotUrl || undefined,
      improvedDesignUrls:
        improvedDesignUrls.length > 0 ? improvedDesignUrls : undefined,
      ...content,
    };

    await kv.set(`analysis:${result.id}`, result);

    // 차트 및 PDF 생성
    const chartBase64 = await createRadarChart(result.score);
    const pdfBuffer = await generatePDFReport(result, chartBase64);

    return c.json({
      success: true,
      reportId: result.id,
      chart: chartBase64,
      pdfUrl: `/report/${result.id}.pdf`,
      result,
    });
  } catch (e) {
    console.error("Analysis error:", e);
    return c.json({ error: "AI 분석 중 오류가 발생했습니다." }, 500);
  }
});

// --- 관리자용 결과 조회 ---
app.get("/admin/results", async (c) => {
  const all = await kv.getByPrefix("analysis:");
  const results = all
    .map((r: any) => r.value)
    .sort(
      (a, b) =>
        new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime()
    );
  return c.json({ results });
});

Deno.serve(app.fetch);
