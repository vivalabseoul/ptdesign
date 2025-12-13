import { GoogleGenerativeAI } from "@google/generative-ai";

// Google Gemini API Key는 .env 파일에서 VITE_GEMINI_API_KEY로 설정하세요
// 무료 API 키 발급: https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = "";

export const getGeminiClient = (apiKey?: string) => {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY || GEMINI_API_KEY;

  if (!key) {
    throw new Error(
      "Gemini API Key가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해주세요.\n" +
      "무료 API 키 발급: https://makersuite.google.com/app/apikey"
    );
  }

  return new GoogleGenerativeAI(key);
};

export async function analyzeWebsite(url: string, screenshotBase64?: string) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are a professional UX/UI consultant. Analyze the following website and provide a detailed evaluation in Korean.

    Website URL: ${url}

    Based on industry best practices and common UX patterns, provide a realistic analysis of this website.
    Consider typical issues for this type of website (e-commerce, corporate, blog, etc.).

    Return ONLY a valid JSON object with this EXACT structure (ALL fields are REQUIRED):
    {
      "totalScore": number (0-100),
      "evaluationCriteria": [
        {
          "category": "첫인상" | "이탈 방지" | "모바일 경험" | "체류 유도" | "접근성" | "SEO",
          "score": number (0-100),
          "weight": number,
          "description": string,
          "methodology": string,
          "subcriteria": []
        }
      ],
      "improvements": [
        {
          "id": string,
          "category": string,
          "title": string,
          "priority": "critical" | "high" | "medium" | "low",
          "currentState": string,
          "targetState": string,
          "impact": string,
          "effort": "Easy" | "Medium" | "Hard",
          "status": "fail" | "warning",
          "impactOnRetention": string,
          "impactOnBounceRate": string
        }
      ],
      "currentMetrics": {
        "bounceRate": string,
        "avgSessionTime": string,
        "pagesPerSession": string,
        "conversionRate": string,
        "mobileBounceRate": string
      },
      "industryBenchmark": {
        "bounceRate": string,
        "avgSessionTime": string,
        "pagesPerSession": string,
        "conversionRate": string
      },
      "targetMetrics": {
        "bounceRate": string,
        "avgSessionTime": string,
        "pagesPerSession": string,
        "conversionRate": string
      }
    }

    CRITICAL RULES:
    1. Return ONLY the JSON object, no markdown formatting, no code blocks
    2. Include exactly 6 evaluationCriteria (첫인상, 이탈 방지, 모바일 경험, 체류 유도, 접근성, SEO)
    3. Include at least 5-8 improvements with varied priorities (critical, high, medium, low)
    4. Provide realistic scores between 45-85 (not too perfect, not too bad)
    5. All descriptions and text must be in Korean
    6. Include ALL required fields with realistic data
    7. Make currentMetrics, industryBenchmark, and targetMetrics realistic (e.g., bounceRate: "65%", avgSessionTime: "2분 30초")
  `;

  try {
    console.log(`🔍 Analyzing website: ${url}`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(`✅ Gemini API response received`);
    
    // JSON 파싱 전에 마크다운 코드 블록 제거
    let jsonText = text.trim();

    // 다양한 마크다운 포맷 제거
    if (jsonText.includes('```')) {
      const match = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (match) {
        jsonText = match[1].trim();
      }
    }

    console.log(`📊 Parsing JSON response...`);
    const data = JSON.parse(jsonText);
    console.log(`✅ Successfully parsed response`);
    console.log(`   - Total Score: ${data.totalScore}`);
    console.log(`   - Criteria: ${data.evaluationCriteria?.length || 0}`);
    console.log(`   - Improvements: ${data.improvements?.length || 0}`);

    return data;
  } catch (error: any) {
    console.error("❌ Gemini Analysis Failed:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 200)
    });

    // JSON 파싱 에러 처리
    if (error instanceof SyntaxError) {
      console.error("JSON Parsing Error - Response might not be valid JSON");
      throw new Error(
        "Gemini API가 올바른 JSON 형식을 반환하지 않았습니다. 잠시 후 다시 시도해주세요."
      );
    }

    // 더 자세한 에러 메시지 제공
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key not valid")) {
      throw new Error(
        "Gemini API 키가 유효하지 않습니다.\n" +
        ".env 파일의 VITE_GEMINI_API_KEY를 확인해주세요.\n" +
        "무료 API 키 발급: https://makersuite.google.com/app/apikey"
      );
    }

    if (error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("quota")) {
      throw new Error("Gemini API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }

    if (error.message?.includes("Failed to fetch") || error.name === "TypeError") {
      throw new Error(
        "네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요."
      );
    }

    throw new Error(`분석 중 오류가 발생했습니다: ${error.message}`);
  }
}
