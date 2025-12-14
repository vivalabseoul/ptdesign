import { LegalLayout } from '../../components/legal/LegalLayout';

export function PrivacyPolicy() {
  return (
    <LegalLayout title="개인정보처리방침" lastUpdated="2024년 12월 13일">
      <div className="space-y-8">
        <section>
          <p className="text-gray-700 mb-4">
            ProTouch Design(이하 "회사")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. 수집하는 개인정보 항목</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">가. 회원가입 시</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>필수항목: 이메일 주소, 이름</li>
                <li>선택항목: 회사명, 연락처</li>
                <li>소셜 로그인 시: 소셜 계정 정보 (이메일, 프로필 정보)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">나. 서비스 이용 시</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>디자인 파일 및 관련 정보</li>
                <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                <li>결제 정보 (결제 시)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. 개인정보의 수집 및 이용 목적</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">가. 회원 관리</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>회원제 서비스 이용에 따른 본인확인</li>
                <li>개인 식별, 불량회원의 부정 이용 방지</li>
                <li>가입 의사 확인, 연령 확인</li>
                <li>불만처리 등 민원처리, 고지사항 전달</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">나. 서비스 제공</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>디자인 분석 서비스 제공</li>
                <li>전문가 피드백 매칭</li>
                <li>맞춤형 서비스 제공</li>
                <li>서비스 이용 통계 분석</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">다. 마케팅 및 광고</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
                <li>이벤트 및 광고성 정보 제공</li>
                <li>서비스 이용에 대한 통계</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. 개인정보의 보유 및 이용 기간</h2>
          <div className="space-y-2">
            <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
            <p>단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-4">
              <li>
                <strong>회원 탈퇴 시:</strong> 회원 탈퇴 후 즉시 파기
                <br />
                <span className="text-sm text-gray-600">단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관</span>
              </li>
              <li>
                <strong>전자상거래 등에서의 소비자보호에 관한 법률:</strong>
                <ul className="list-circle list-inside ml-6 mt-1 space-y-1 text-sm">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                </ul>
              </li>
              <li>
                <strong>통신비밀보호법:</strong> 로그인 기록 3개월
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. 개인정보의 제3자 제공</h2>
          <p>
            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            다만, 다음의 경우에는 예외로 합니다:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mt-4">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. 개인정보 처리 위탁</h2>
          <p>회사는 서비스 향상을 위해 아래와 같이 개인정보를 위탁하고 있습니다:</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">수탁업체</th>
                  <th className="border border-gray-300 px-4 py-2">위탁업무 내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Supabase</td>
                  <td className="border border-gray-300 px-4 py-2">데이터베이스 관리 및 인증 서비스</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">결제대행사</td>
                  <td className="border border-gray-300 px-4 py-2">결제 처리</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. 이용자의 권리와 행사 방법</h2>
          <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 mt-4">
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정 요구</li>
            <li>개인정보 삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
          </ul>
          <p className="mt-4">
            권리 행사는 회사에 대해 서면, 전화, 이메일 등을 통하여 하실 수 있으며,
            회사는 이에 대해 지체 없이 조치하겠습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. 개인정보 보호책임자</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">개인정보 보호책임자</p>
            <ul className="space-y-1 text-sm">
              <li>이름: 문정하</li>
              <li>이메일: contact@protouchdesign.com</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. 개인정보 처리방침의 변경</h2>
          <p>
            본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
            변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>

        <section className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600">
            본 개인정보처리방침은 2024년 12월 13일부터 시행됩니다.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
