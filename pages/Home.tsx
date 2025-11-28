import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { WhyProTouch } from "../components/WhyProTouch";
import { Experts } from "../components/Experts";
import { Pricing } from "../components/Pricing";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase/client";

export function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAnalyze = async (data: {
    url: string;
    siteName: string;
  }) => {
    // 로그인 체크 (이미 Hero에서 체크하지만 안전장치)
    if (!isAuthenticated || !user || !user.email) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

    setIsAnalyzing(true);

    // 사용자 정보에서 authorName과 authorContact 가져오기
    const authorName = user.email.split('@')[0] || '사용자';
    const authorContact = user.email;

    try {
      const requestData = {
        ...data,
        authorName,
        authorContact,
      };
      
      console.log("분석 시작:", requestData);
      console.log("API 엔드포인트:", `https://${projectId}.supabase.co/functions/v1/make-server-56debe56/analyze`);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-56debe56/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("응답 상태:", response.status, response.statusText);
      console.log("응답 헤더:", Object.fromEntries(response.headers.entries()));

      // 300번대 리다이렉트 응답 처리
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('Location');
        console.error("리다이렉트 응답:", {
          status: response.status,
          location,
          headers: Object.fromEntries(response.headers.entries())
        });
        alert(`서버 리다이렉트 오류 (${response.status})\n\n엔드포인트가 잘못되었거나 서버 설정에 문제가 있을 수 있습니다.\n\nLocation: ${location || '없음'}`);
        setIsAnalyzing(false);
        return;
      }

      // 응답 본문 읽기 (한 번만 읽을 수 있음)
      const responseText = await response.text();
      
      if (!response.ok) {
        // 에러 응답 처리
        let errorMessage = "분석 중 오류가 발생했습니다";
        try {
          if (responseText) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = JSON.parse(responseText);
              console.error("에러 응답 데이터:", errorData);
              console.error("전체 에러 객체:", JSON.stringify(errorData, null, 2));
              errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
            } else {
              errorMessage = `HTTP ${response.status}: ${response.statusText}\n${responseText}`;
            }
          }
        } catch (parseError) {
          console.error("에러 응답 파싱 오류:", parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}${responseText ? `\n${responseText}` : ''}`;
        }
        alert(`분석 오류:\n${errorMessage}`);
        setIsAnalyzing(false);
        return;
      }

      // 성공 응답 처리
      let responseData;
      try {
        if (!responseText) {
          throw new Error('응답이 비어있습니다');
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = JSON.parse(responseText);
        } else {
          throw new Error(`예상하지 못한 응답 형식: ${responseText.substring(0, 100)}`);
        }
      } catch (parseError) {
        console.error("응답 파싱 오류:", parseError);
        console.error("응답 텍스트:", responseText);
        alert(`분석 결과를 파싱할 수 없습니다:\n${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`);
        setIsAnalyzing(false);
        return;
      }
      
      console.log("분석 결과 응답:", responseData);
      
      if (!responseData.result) {
        console.error("결과 데이터가 없습니다:", responseData);
        alert("분석 결과가 올바르지 않습니다. 다시 시도해주세요.");
        setIsAnalyzing(false);
        return;
      }

      const { result } = responseData;

          // 분석 결과를 데이터베이스에 저장
          if (user) {
            try {
          console.log("저장 시도 - user.id:", user.id);
          const { data: savedData, error: saveError } = await supabase
            .from("analyses")
                .insert([
                  {
                    user_id: user.id,
                    url: result.url,
                    site_name: result.siteName,
                    site_address: result.siteAddress,
                    analysis_date: result.analysisDate,
                    author_name: authorName,
                    author_contact: authorContact,
                    issues: result.issues,
                    score: result.score,
                    screenshot_url: result.screenshotUrl || null,
                    improved_design_urls: result.improvedDesignUrls || null,
                    created_at: new Date().toISOString(),
                  },
            ])
            .select();

          if (saveError) {
            console.error("Error saving analysis:", saveError);
            alert(
              `분석 결과 저장 실패: ${
                saveError.message || "알 수 없는 오류"
              }\n\n결과는 표시되지만 대시보드에 저장되지 않았습니다.`
            );
          } else {
            console.log("분석 결과 저장 성공:", savedData);
          }
        } catch (error) {
          console.error("Error saving analysis:", error);
          alert(
            `분석 결과 저장 중 오류 발생: ${
              error instanceof Error ? error.message : "알 수 없는 오류"
            }\n\n결과는 표시되지만 대시보드에 저장되지 않았습니다.`
          );
        }
      } else {
        console.warn("사용자 정보가 없어 분석 결과를 저장할 수 없습니다.");
      }

      // 결과 페이지로 이동
      navigate("/results", { state: { result } });
    } catch (error) {
      console.error("분석 오류 상세:", error);
      if (error instanceof Error) {
        console.error("에러 이름:", error.name);
        console.error("에러 메시지:", error.message);
        console.error("에러 스택:", error.stack);
        alert(`네트워크 오류가 발생했습니다:\n${error.message}\n\n콘솔을 확인해주세요.`);
      } else {
        alert("알 수 없는 오류가 발생했습니다. 콘솔을 확인해주세요.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        isAuthenticated={isAuthenticated}
        onNavigateToDashboard={() => navigate("/dashboard")}
      />

      <WhyProTouch />
      <Experts />
      <Pricing />
      <Contact />

      <Footer />
    </div>
  );
}
