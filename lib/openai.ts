import OpenAI from 'openai';

// 여기에 OpenAI API Key를 입력하세요 (따옴표 안에 붙여넣기)
const OPENAI_API_KEY = "";

export const getOpenAIClient = (apiKey?: string) => {
  // 1. 함수 인자 -> 2. .env 파일 -> 3. 코드 내 상수 순서로 확인
  const key = apiKey || import.meta.env.VITE_OPENAI_API_KEY || OPENAI_API_KEY;
  
  if (!key) {
    throw new Error("OpenAI API Key가 설정되지 않았습니다. openai.ts 파일의 OPENAI_API_KEY 변수에 키를 입력해주세요.");
  }

  return new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true
  });
};

export async function analyzeWebsite(url: string, apiKey?: string) {
  const openai = getOpenAIClient(apiKey);

  const prompt = `
    Analyze the UI/UX design of the following website URL: ${url}
    
    You are a professional UI/UX Design Expert.
    Provide a detailed analysis report in the following JSON format.
    Ensure all text content is in Korean.

    Required JSON Structure:
    {
      "totalScore": number (0-100),
      "evaluationCriteria": [
        {
          "category": "첫인상" | "이탈 방지" | "모바일 경험" | "체류 유도" | "접근성" | "SEO",
          "score": number (0-100),
          "weight": number (percentage, sum should be 100),
          "description": string,
          "methodology": string,
          "subcriteria": [
            { "name": string, "score": number, "description": string, "benchmark": string }
          ]
        }
      ],
      "improvements": [
        {
          "id": string (unique),
          "category": string (same as above categories),
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
        "bounceRate": string (e.g., "65%"),
        "avgSessionTime": string (e.g., "1m 30s"),
        "pagesPerSession": string (e.g., "2.5"),
        "conversionRate": string (e.g., "1.2%"),
        "mobileBounceRate": string (e.g., "70%")
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
    
    Generate realistic and specific data based on the URL provided. 
    If you cannot access the URL, generate a hypothetical analysis based on the domain name and industry standards for that type of website.

    IMPORTANT RULES:
    1. "improvements" array must contain at least 6 items.
    2. Distribute improvements across different categories (don't put all in one category).
    3. "category" MUST be exactly one of: "첫인상", "이탈 방지", "모바일 경험", "체류 유도", "접근성", "SEO".
    4. "priority" MUST be exactly one of: "critical", "high", "medium", "low".
    5. "score" in evaluationCriteria must be varied (not all same).
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant designed to output JSON." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "gpt-4o-mini", // JSON mode 지원 모델
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
