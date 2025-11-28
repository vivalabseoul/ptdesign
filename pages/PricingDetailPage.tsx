import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export function PricingDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              돌아가기
            </button>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              가격 정책 <span style={{ color: "var(--accent)" }}>상세 안내</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              ProTouchDesign의 서비스별 상세 기능과 경쟁사 대비 차별점을 확인하세요.
            </p>
          </div>

          {/* Comparison Table Section */}
          <section className="mb-32">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="w-2 h-8 rounded-full" style={{ background: "var(--secondary)" }} />
              서비스 비교
            </h2>
            
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-6 px-8 text-gray-400 font-medium w-1/4">기능 / 서비스</th>
                    <th className="text-center py-6 px-8 font-bold text-xl w-1/6" style={{ color: "var(--accent)" }}>
                      ProTouchDesign
                    </th>
                    <th className="text-center py-6 px-8 text-gray-500 font-medium w-1/6">Hotjar</th>
                    <th className="text-center py-6 px-8 text-gray-500 font-medium w-1/6">Maze</th>
                    <th className="text-center py-6 px-8 text-gray-500 font-medium w-1/6">UserTesting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(
                    [
                      { name: "AI 자동 분석", pt: true, h: true, m: false, u: "triangle" },
                      { name: "전문가 검증", pt: true, h: false, m: false, u: false },
                      { name: "실행 가능한 지침서", pt: true, h: false, m: false, u: false },
                      { name: "시각적 리포트", pt: true, h: true, m: "triangle", u: true },
                      { name: "디자이너 협업 지원", pt: true, h: false, m: false, u: false },
                      { name: "즉시 적용 가능한 CSS", pt: true, h: false, m: false, u: false },
                      { name: "개선 전후 시뮬레이션", pt: true, h: false, m: false, u: false },
                    ] as { name: string; pt: boolean | string; h: boolean | string; m: boolean | string; u: boolean | string }[]
                  ).map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-5 px-8 text-gray-300 font-medium">{row.name}</td>
                      <td className="py-5 px-8 text-center bg-[var(--accent)]/5">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--success)" }}>
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8 text-center">
                        {row.h === true ? (
                          <div className="flex justify-center"><div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><Check className="w-4 h-4 text-gray-400" /></div></div>
                        ) : row.h === "triangle" ? (
                          <span className="text-gray-500 text-lg">△</span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="py-5 px-8 text-center">
                        {row.m === true ? (
                          <div className="flex justify-center"><div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><Check className="w-4 h-4 text-gray-400" /></div></div>
                        ) : row.m === "triangle" ? (
                          <span className="text-gray-500 text-lg">△</span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="py-5 px-8 text-center">
                        {row.u === true ? (
                          <div className="flex justify-center"><div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><Check className="w-4 h-4 text-gray-400" /></div></div>
                        ) : row.u === "triangle" ? (
                          <span className="text-gray-500 text-lg">△</span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* More Products Section */}
          <section id="more-products">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="w-2 h-8 rounded-full" style={{ background: "var(--accent)" }} />
              추가 상품 안내
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Campaign Kit */}
              <div className="rounded-3xl p-10 border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-[var(--accent)]/50 transition-all group">
                <div className="mb-6 inline-flex px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-sm">
                  마케팅 최적화
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">캠페인 킷 (Campaign Kit)</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  랜딩 페이지뿐만 아니라 광고 배너, SNS 소재 등 마케팅 캠페인 전반의 디자인 일관성과 효율을 진단하고 개선합니다.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--accent)]" />
                    광고 소재 A/B 테스트 가이드
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--accent)]" />
                    채널별 디자인 최적화 리포트
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--accent)]" />
                    전환율 중심의 카피라이팅 제안
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  문의하기
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Bulk Vouchers */}
              <div className="rounded-3xl p-10 border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-[var(--secondary)]/50 transition-all group">
                <div className="mb-6 inline-flex px-4 py-1.5 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] font-bold text-sm">
                  기업 / 에이전시
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">대량 바우처 (Bulk Vouchers)</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  여러 프로젝트를 진행하는 에이전시나 대규모 웹사이트를 운영하는 기업을 위한 대량 구매 할인 패키지입니다.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--secondary)]" />
                    최대 30% 할인율 적용
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--secondary)]" />
                    전담 매니저 배정 및 우선 처리
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--secondary)]" />
                    월간 통합 리포트 제공
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  문의하기
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
