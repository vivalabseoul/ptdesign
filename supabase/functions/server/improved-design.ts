/**
 * 개선된 디자인 이미지 생성 유틸리티
 * OpenAI DALL-E를 사용하여 개선된 디자인 이미지 생성
 */

interface ImprovedDesignRequest {
  issueTitle: string;
  issueDescription: string;
  recommendation: string;
  category: string;
  severity: "high" | "medium" | "low";
  currentDesignUrl?: string; // 현재 디자인 스크린샷 URL (선택사항)
}

/**
 * OpenAI DALL-E를 사용하여 개선된 디자인 이미지 생성
 */
export async function generateImprovedDesign(
  request: ImprovedDesignRequest
): Promise<string | null> {
  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      console.warn("OpenAI API 키가 설정되지 않았습니다.");
      return null;
    }

    // 개선된 디자인을 위한 프롬프트 생성
    const prompt = `Create a professional UI/UX design improvement mockup showing:
- Category: ${request.category}
- Issue: ${request.issueTitle}
- Problem: ${request.issueDescription}
- Solution: ${request.recommendation}
- Severity: ${request.severity}

The image should show a before/after comparison or an improved design that addresses the issue. 
Style: modern, clean, professional web design mockup. 
Include visual elements that demonstrate the improvement clearly.`;

    // DALL-E 3 API 호출
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("DALL-E API 오류:", error);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;

    if (!imageUrl) {
      console.error("이미지 URL을 받지 못했습니다.");
      return null;
    }

    // 이미지를 Supabase Storage에 업로드하거나 URL을 직접 반환
    // TODO: Supabase Storage에 업로드하는 기능 추가
    
    return imageUrl;
  } catch (error) {
    console.error("개선된 디자인 이미지 생성 오류:", error);
    return null;
  }
}

/**
 * 여러 이슈에 대해 개선된 디자인 이미지 일괄 생성
 */
export async function generateImprovedDesignsForIssues(
  issues: Array<{
    title: string;
    description: string;
    recommendation: string;
    category: string;
    severity: "high" | "medium" | "low";
  }>,
  screenshotUrl?: string
): Promise<Array<{ issueTitle: string; imageUrl: string; description: string }>> {
  const results: Array<{ issueTitle: string; imageUrl: string; description: string }> = [];

  // 높은 심각도 이슈만 우선적으로 처리 (비용 절감)
  const highPriorityIssues = issues.filter((issue) => issue.severity === "high");
  const otherIssues = issues.filter((issue) => issue.severity !== "high");

  // 높은 심각도 이슈부터 처리
  for (const issue of highPriorityIssues) {
    try {
      const imageUrl = await generateImprovedDesign({
        issueTitle: issue.title,
        issueDescription: issue.description,
        recommendation: issue.recommendation,
        category: issue.category,
        severity: issue.severity,
        currentDesignUrl: screenshotUrl,
      });

      if (imageUrl) {
        results.push({
          issueTitle: issue.title,
          imageUrl: imageUrl,
          description: `개선된 디자인: ${issue.recommendation}`,
        });
      }

      // API 레이트 리밋 방지를 위한 딜레이
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`이슈 "${issue.title}"에 대한 이미지 생성 실패:`, error);
    }
  }

  // 중간/낮은 심각도 이슈는 선택적으로 처리
  // (비용을 고려하여 필요시에만 처리)
  if (results.length < 3 && otherIssues.length > 0) {
    for (const issue of otherIssues.slice(0, 3 - results.length)) {
      try {
        const imageUrl = await generateImprovedDesign({
          issueTitle: issue.title,
          issueDescription: issue.description,
          recommendation: issue.recommendation,
          category: issue.category,
          severity: issue.severity,
          currentDesignUrl: screenshotUrl,
        });

        if (imageUrl) {
          results.push({
            issueTitle: issue.title,
            imageUrl: imageUrl,
            description: `개선된 디자인: ${issue.recommendation}`,
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`이슈 "${issue.title}"에 대한 이미지 생성 실패:`, error);
      }
    }
  }

  return results;
}









