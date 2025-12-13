// Gemini API 사용 가능한 모델 확인 스크립트
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error("❌ VITE_GEMINI_API_KEY가 설정되지 않았습니다.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    console.log("🔍 사용 가능한 Gemini 모델 목록 확인 중...\n");
    
    // SDK에서 제공하는 모델 목록 확인 방법
    // 참고: @google/generative-ai SDK는 listModels 메서드를 제공하지 않을 수 있음
    
    // 대신 일반적으로 사용 가능한 모델들을 테스트
    const modelsToTest = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.0-pro",
      "models/gemini-pro",
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash",
    ];
    
    console.log("📋 테스트할 모델 목록:");
    modelsToTest.forEach((model, i) => {
      console.log(`  ${i + 1}. ${model}`);
    });
    console.log();
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`🧪 테스트 중: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`  ✅ 성공! 응답: ${response.text().substring(0, 50)}...`);
        console.log(`  👉 사용 가능한 모델: ${modelName}\n`);
        break; // 첫 번째 성공한 모델 발견 시 중단
      } catch (error) {
        console.log(`  ❌ 실패: ${error.message}\n`);
      }
    }
    
  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
  }
}

listModels();
