import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
// import { supabase, AnalysisRecord } from '../utils/supabase/client'; // AWS 마이그레이션
import type { AnalysisResult } from '../components/Results';

// AWS 마이그레이션: 임시 타입 정의
interface AnalysisRecord {
  id: string;
  user_id: string;
  url: string;
  created_at: string;
  [key: string]: any;
}

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAllAnalyses();
    }
  }, [user]);

  const loadAllAnalyses = async () => {
    try {
      // 관리자는 모든 분석 기록을 볼 수 있음
      // AWS 마이그레이션: RDS로 대체 필요
      /*
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading analyses:', error);
      } else {
        setAnalyses(data || []);
      }
      */
      console.log('AWS 마이그레이션: 분석 기록 로드 기능은 AWS RDS 설정 후 구현됩니다.');
      setAnalyses([]);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = (analysis: AnalysisRecord) => {
      const result: AnalysisResult = {
        url: analysis.url,
        siteName: analysis.site_name,
        siteAddress: analysis.site_address,
        analysisDate: analysis.analysis_date,
        authorName: analysis.author_name,
        authorContact: analysis.author_contact,
        issues: analysis.issues,
        score: analysis.score,
        screenshotUrl: analysis.screenshot_url || undefined,
        improvedDesignUrls: analysis.improved_design_urls || undefined,
      };
      navigate('/results', { state: { result, returnTo: '/admin' } });
  };

  const getScoreColor = (score: number) =>
    score >= 60 ? 'text-primary' : 'text-red-500';

  return (
    <div className="min-h-screen bg-white">
      <header className="section-dark border-b-4 border-primary">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="section-title text-white mb-2">관리자 대시보드</h1>
              <p className="text-subtle">모든 분석 기록 관리</p>
            </div>
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="btn-admin"
              >
                사용자 대시보드
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="btn-admin"
              >
                메인으로
              </Button>
              <Button 
                onClick={signOut} 
                variant="outline" 
                className="btn-admin border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="section">
        <div className="container">
          <div className="spacing-section text-center mb-12">
            <h2 className="section-title mb-4">전체 분석 기록</h2>
            <p className="section-desc text-muted">모든 사용자의 분석 결과를 확인할 수 있습니다</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-subtle">로딩 중...</div>
            </div>
          ) : analyses.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-gray-300 text-lg">아직 분석 기록이 없습니다</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="card cursor-pointer group"
                  onClick={() => handleViewResult(analysis)}
                >
                  <div className="border-b-2 border-gray-700 pb-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`text-7xl font-extrabold leading-none ${getScoreColor(analysis.score.overall)}`}>
                        {analysis.score.overall}
                      </div>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300 bg-gray-800/50">
                        {analysis.issues.length}개 이슈
                      </Badge>
                    </div>
                    <h3 className="title-lg text-white mb-3">{analysis.site_name}</h3>
                    <p className="text-subtle text-sm">
                      {new Date(analysis.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">사용성</span>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.score.usability)}`}>
                        {analysis.score.usability}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">접근성</span>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.score.accessibility)}`}>
                        {analysis.score.accessibility}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">시각</span>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.score.visual)}`}>
                        {analysis.score.visual}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">성능</span>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.score.performance)}`}>
                        {analysis.score.performance}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewResult(analysis);
                    }}
                    className="btn-primary w-full"
                  >
                    상세 보기
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

