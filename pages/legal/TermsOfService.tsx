import { LegalLayout } from '../../components/legal/LegalLayout';

export function TermsOfService() {
  return (
    <LegalLayout title="이용약관" lastUpdated="2024년 12월 13일">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">제1조 (목적)</h2>
          <p>
            본 약관은 ProTouch Design(이하 "회사")이 제공하는 디자인 분석 서비스(이하 "서비스")의 이용과 관련하여
            회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제2조 (용어의 정의)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>"서비스"란 회사가 제공하는 AI 기반 디자인 분석 및 피드백 서비스를 의미합니다.</li>
            <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>"회원"이란 회사와 서비스 이용계약을 체결하고 회원 ID를 부여받은 자를 말합니다.</li>
            <li>"고객"이란 서비스를 이용하여 디자인 분석을 의뢰하는 회원을 말합니다.</li>
            <li>"전문가"란 회사의 승인을 받아 디자인 분석 및 피드백을 제공하는 회원을 말합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제3조 (약관의 효력 및 변경)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
            <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.</li>
            <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제4조 (회원가입)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
            <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제5조 (서비스의 제공)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>회사는 다음과 같은 서비스를 제공합니다:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>AI 기반 디자인 분석 서비스</li>
                <li>전문가 디자인 피드백 서비스</li>
                <li>디자인 가이드라인 제공</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </li>
            <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
            <li>회사는 시스템 정기점검, 증설 및 교체를 위해 서비스를 일시 중단할 수 있으며, 예정된 작업의 경우 사전에 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제6조 (서비스 이용요금)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>회사가 제공하는 서비스는 기본적으로 유료입니다. 다만, 회사가 별도로 정한 경우 무료로 제공될 수 있습니다.</li>
            <li>서비스 이용요금은 회사의 정책에 따라 변경될 수 있으며, 변경 시 사전에 공지합니다.</li>
            <li>결제된 이용요금은 원칙적으로 환불되지 않습니다. 다만, 회사의 귀책사유로 서비스를 제공하지 못한 경우 환불합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제7조 (회원의 의무)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>회원은 다음 행위를 하여서는 안 됩니다:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>신청 또는 변경 시 허위내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제8조 (저작권의 귀속)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</li>
            <li>이용자가 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</li>
            <li>회사는 이용자가 게시한 게시물을 서비스 운영, 개선, 홍보 목적으로 사용할 수 있습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제9조 (면책조항)</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
            <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
            <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">제10조 (분쟁해결)</h2>
          <p>
            본 약관에 명시되지 않은 사항은 전기통신사업법 등 관계법령과 상관습에 따릅니다.
            서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
          </p>
        </section>

        <section className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600">
            본 약관은 2024년 12월 13일부터 시행됩니다.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
