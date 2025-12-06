import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
          이용약관
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>이용약관</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="mb-3">제1조 (목적)</h3>
              <p className="text-gray-600">
                본 약관은 Pro Touch Design(이하 "회사")이 제공하는 UI/UX 디자인 분석 서비스(이하 "서비스")의 
                이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="mb-3">제2조 (정의)</h3>
              <div className="text-gray-600 space-y-2">
                <p>1. "서비스"란 회사가 제공하는 AI 기반 웹사이트 UI/UX 분석 및 개선안 제공 서비스를 의미합니다.</p>
                <p>2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.</p>
                <p>3. "분석 보고서"란 서비스를 통해 생성되는 UI/UX 분석 결과물을 의미합니다.</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3">제3조 (약관의 효력 및 변경)</h3>
              <div className="text-gray-600 space-y-2">
                <p>1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.</p>
                <p>2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</p>
                <p>3. 약관 변경 시 적용일자 및 변경사유를 명시하여 현행 약관과 함께 공지합니다.</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3">제4조 (서비스의 제공)</h3>
              <div className="text-gray-600 space-y-2">
                <p>1. 회사는 다음과 같은 서비스를 제공합니다:</p>
                <p className="pl-4">- 웹사이트 UI/UX 자동 분석</p>
                <p className="pl-4">- 분석 결과 보고서 제공 (PDF)</p>
                <p className="pl-4">- AI 작업 지침서 제공</p>
                <p className="pl-4">- 기타 회사가 정하는 서비스</p>
                <p>2. 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.</p>
                <p>3. 회사는 시스템 점검, 보수, 교체 등의 사유로 서비스 제공을 일시적으로 중단할 수 있습니다.</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3">제5조 (이용자의 의무)</h3>
              <div className="text-gray-600 space-y-2">
                <p>1. 이용자는 관계 법령, 본 약관, 이용안내 및 서비스상에 공지한 주의사항을 준수하여야 합니다.</p>
                <p>2. 이용자는 서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복사, 복제, 변경, 번역, 출판, 방송 기타의 방법으로 사용하거나 이를 타인에게 제공할 수 없습니다.</p>
                <p>3. 이용자는 타인의 저작권 등 지적재산권을 침해하는 행위를 하여서는 안 됩니다.</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3">제6조 (개인정보 보호)</h3>
              <div className="text-gray-600 space-y-2">
                <p>1. 회사는 이용자의 개인정보를 보호하기 위하여 개인정보처리방침을 수립하고 공개합니다.</p>
                <p>2. 회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.</p>
                <p>3. 서비스 이용 시 입력된 URL 및 분석 데이터는 서비스 제공 목적으로만 사용됩니다.</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3">제7조 (면책사항)</h3>
              <div className="text-gray-600 space-y-2">
                <p>1. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</p>
                <p>2. 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</p>
                <p>3. 분석 결과는 AI 기반 자동 분석이며, 실제 개선 작업 시 전문가의 검토를 권장합니다.</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3">제8조 (분쟁해결)</h3>
              <p className="text-gray-600">
                본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.
              </p>
            </section>

            <div className="pt-6 border-t border-gray-200 text-gray-500">
              <p>시행일: 2025년 1월 1일</p>
              <p className="mt-2">Pro Touch Design</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
