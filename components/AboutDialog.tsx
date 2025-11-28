import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-gray-400 hover:text-white p-0 h-auto"
        >
          회사 소개
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>회사 소개</DialogTitle>
          <DialogDescription>
            AI 기술로 디자인 혁신을 만들어가는 Pro Touch Design을 소개합니다
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-8">
            <section>
              <h3 className="mb-4">디자인 혁신을 위한 AI 솔루션</h3>
              <p className="text-gray-600 mb-4 text-lg">
                Pro Touch Design은 AI 기술을 활용하여 웹사이트의 UI/UX 문제를
                자동으로 분석하고, 실행 가능한 개선안을 제공하는 혁신적인 디자인
                분석 플랫폼입니다.
              </p>
              <p className="text-gray-600 text-lg">
                전통적인 UI/UX 분석은 많은 시간과 비용이 소요되었습니다. 우리는
                최신 AI 기술을 통해 이러한 과정을 자동화하고, 누구나 쉽게 전문가
                수준의 디자인 분석 결과를 얻을 수 있도록 만들었습니다.
              </p>
            </section>

            <div className="flex flex-col gap-6 pt-8">
              <div className="border border-gray-300 p-6">
                <div className="text-orange-500 mb-3 text-xl">Mission</div>
                <p className="text-gray-600">
                  모든 웹사이트가 최고의 사용자 경험을 제공할 수 있도록 돕습니다
                </p>
              </div>
              <div className="border border-gray-300 p-6">
                <div className="text-orange-500 mb-3 text-xl">Vision</div>
                <p className="text-gray-600">
                  AI 기반 디자인 분석의 글로벌 표준이 되는 것
                </p>
              </div>
              <div className="border border-gray-300 p-6">
                <div className="text-orange-500 mb-3 text-xl">Values</div>
                <p className="text-gray-600">
                  혁신, 정확성, 접근성을 핵심 가치로 삼습니다
                </p>
              </div>
            </div>

            <section className="pt-8 border-t border-gray-200">
              <h3 className="mb-4">핵심 기술</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-lg">AI 기반 분석 엔진</h4>
                  <p className="text-gray-600">
                    최신 머신러닝 알고리즘을 활용하여 수천 개의 디자인 패턴을
                    학습하고, 실시간으로 웹사이트의 UI/UX 문제를 감지합니다.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-lg">자동화된 보고서 생성</h4>
                  <p className="text-gray-600">
                    복잡한 분석 결과를 이해하기 쉬운 시각적 보고서로 자동
                    변환하여 비전문가도 쉽게 이해할 수 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-lg">AI 작업 지침서</h4>
                  <p className="text-gray-600">
                    분석 결과를 바탕으로 ChatGPT, Claude 등의 AI에게 직접 전달할
                    수 있는 구조화된 지침서를 생성합니다.
                  </p>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-200">
              <h3 className="mb-4">연락처</h3>
              <div className="space-y-2 text-gray-600">
                <p>Email: vivalabseoul@gmail.com</p>
                <p>Phone: +82 10 8317 7187</p>
                <p>Business Hours: 평일 09:00 - 18:00</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
