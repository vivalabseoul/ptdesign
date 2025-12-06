import OpenAI from "openai";

// OpenAI API Key는 .env 파일에서 VITE_OPENAI_API_KEY로 설정하세요
const OPENAI_API_KEY = "";

export const getOpenAIClient = (apiKey?: string) => {
  // 1. 함수 인자 -> 2. .env 파일 -> 3. 코드 내 상수 순서로 확인
  const key = apiKey || import.meta.env.VITE_OPENAI_API_KEY || OPENAI_API_KEY;

  if (!key) {
    throw new Error(
      "OpenAI API Key가 설정되지 않았습니다. .env 파일에 VITE_OPENAI_API_KEY를 설정해주세요."
    );
  }

  return new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true,
    timeout: 180000, // 3분 (180초) = 180,000ms
  });
};

export async function analyzeWebsite(url: string, apiKey?: string) {
  const openai = getOpenAIClient(apiKey);

  const prompt = `
    Analyze the main page UI/UX of: ${url}
    
    Focus ONLY on the homepage/landing page. Provide a quick analysis in Korean.

    JSON Structure:
    {
      "totalScore": number (0-100),
      "evaluationCriteria": [
        {
          "category": "첫인상" | "이탈 방지" | "모바일 경험" | "체류 유도" | "접근성" | "SEO",
          "score": number (0-100),
          "weight": number,
          "description": string,
          "methodology": string
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
        "conversionRate": string
      },
      "industryBenchmark": {
        "bounceRate": string,
        "avgSessionTime": string
      },
      "targetMetrics": {
        "bounceRate": string,
        "avgSessionTime": string
      }
    }

    RULES:
    1. At least 3 improvements (most critical only).
    2. Vary categories and priorities.
    3. Keep descriptions concise.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo", // 빠른 모델 (2-3배 속도 향상)
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content received from OpenAI");

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI Analysis Failed:", error);
    throw error;
  }
}
