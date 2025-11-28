import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import type { AnalysisResult } from "./Results";

interface AdminProps {
  onViewResult: (result: AnalysisResult) => void;
  onBack: () => void;
}

export function Admin({ onViewResult, onBack }: AdminProps) {
  const [results, setResults] = useState<
    Array<{ id: string; result: AnalysisResult }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-56debe56/admin/results`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to load results");
        return;
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) =>
    score >= 60 ? "text-[var(--primary)]" : "text-red-600";

  return (
    <section className="section-sm section-light">
      <div className="container px-6">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h2 className="title-lg mb-2">분석 결과 관리</h2>
            <p className="text-muted">
              저장된 모든 분석 결과를 확인할 수 있습니다
            </p>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-2 border-black"
          >
            메인으로
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-subtle">로딩 중...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-subtle">아직 분석 결과가 없습니다</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(({ id, result }) => (
              <Card
                key={id}
                className="border-2 border-gray-200 hover:border-primary transition-colors"
              >
                <CardHeader className="border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div
                      className={`text-5xl ${getScoreColor(
                        result.score.overall
                      )}`}
                    >
                      {result.score.overall}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.issues.length}개 이슈
                    </Badge>
                  </div>
                  <CardTitle className="title-lg">{result.siteName}</CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(result.analysisDate).toLocaleDateString("ko-KR")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">사용성</span>
                      <span className={getScoreColor(result.score.usability)}>
                        {result.score.usability}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">접근성</span>
                      <span
                        className={getScoreColor(result.score.accessibility)}
                      >
                        {result.score.accessibility}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">시각</span>
                      <span className={getScoreColor(result.score.visual)}>
                        {result.score.visual}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">성능</span>
                      <span className={getScoreColor(result.score.performance)}>
                        {result.score.performance}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => onViewResult(result)}
                    className="btn-primary"
                  >
                    상세 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
