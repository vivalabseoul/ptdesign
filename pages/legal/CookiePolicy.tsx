import { LegalLayout } from '../../components/legal/LegalLayout';

export function CookiePolicy() {
  return (
    <LegalLayout title="쿠키 정책" lastUpdated="2024년 12월 13일">
      <div className="space-y-8">
        <section>
          <p className="text-gray-700">
            ProTouch Design(이하 "회사")은 웹사이트 운영을 위해 쿠키를 사용합니다.
            본 쿠키 정책은 회사가 사용하는 쿠키의 종류와 목적, 관리 방법에 대해 설명합니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. 쿠키란?</h2>
          <p>
            쿠키는 웹사이트를 방문할 때 사용자의 컴퓨터나 모바일 기기에 저장되는 작은 텍스트 파일입니다.
            쿠키를 통해 웹사이트는 사용자의 방문 기록, 설정, 로그인 정보 등을 기억할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. 쿠키 사용 목적</h2>
          <p className="mb-4">회사는 다음과 같은 목적으로 쿠키를 사용합니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              <strong>필수 쿠키:</strong> 웹사이트의 기본 기능을 제공하기 위해 반드시 필요한 쿠키입니다.
              로그인 상태 유지, 보안 기능 등에 사용됩니다.
            </li>
            <li>
              <strong>기능 쿠키:</strong> 사용자의 선택사항과 설정을 기억하여 더 나은 사용자 경험을 제공합니다.
              언어 설정, 테마 설정 등에 사용됩니다.
            </li>
            <li>
              <strong>분석 쿠키:</strong> 웹사이트 방문자 수, 페이지 조회 수 등을 분석하여 서비스를 개선합니다.
              Google Analytics 등의 도구를 통해 수집됩니다.
            </li>
            <li>
              <strong>마케팅 쿠키:</strong> 사용자의 관심사에 맞는 광고를 제공하기 위해 사용됩니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. 사용하는 쿠키의 종류</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">쿠키 이름</th>
                  <th className="border border-gray-300 px-4 py-2">목적</th>
                  <th className="border border-gray-300 px-4 py-2">유효기간</th>
                  <th className="border border-gray-300 px-4 py-2">유형</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">session_id</td>
                  <td className="border border-gray-300 px-4 py-2">로그인 세션 유지</td>
                  <td className="border border-gray-300 px-4 py-2">세션 종료 시</td>
                  <td className="border border-gray-300 px-4 py-2">필수</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">user_preferences</td>
                  <td className="border border-gray-300 px-4 py-2">사용자 설정 저장</td>
                  <td className="border border-gray-300 px-4 py-2">1년</td>
                  <td className="border border-gray-300 px-4 py-2">기능</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_ga</td>
                  <td className="border border-gray-300 px-4 py-2">Google Analytics 사용자 구분</td>
                  <td className="border border-gray-300 px-4 py-2">2년</td>
                  <td className="border border-gray-300 px-4 py-2">분석</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_gid</td>
                  <td className="border border-gray-300 px-4 py-2">Google Analytics 사용자 구분</td>
                  <td className="border border-gray-300 px-4 py-2">24시간</td>
                  <td className="border border-gray-300 px-4 py-2">분석</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. 쿠키 관리 방법</h2>
          <p className="mb-4">
            사용자는 쿠키 설정을 통해 쿠키 허용 여부를 선택할 수 있습니다.
            다만, 필수 쿠키를 거부하는 경우 일부 서비스 이용이 제한될 수 있습니다.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">가. 브라우저 설정을 통한 쿠키 관리</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Chrome:</strong> 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터
                </li>
                <li>
                  <strong>Edge:</strong> 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제
                </li>
                <li>
                  <strong>Safari:</strong> 환경설정 &gt; 개인정보 보호 &gt; 쿠키 및 웹 사이트 데이터
                </li>
                <li>
                  <strong>Firefox:</strong> 옵션 &gt; 개인정보 및 보안 &gt; 쿠키 및 사이트 데이터
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">나. 쿠키 배너를 통한 관리</h3>
              <p>
                웹사이트 첫 방문 시 표시되는 쿠키 배너에서 쿠키 사용에 대한 동의 여부를 선택할 수 있습니다.
                설정은 언제든지 변경할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. 제3자 쿠키</h2>
          <p className="mb-4">
            회사는 서비스 개선과 분석을 위해 다음과 같은 제3자 서비스를 사용하며,
            이들 서비스는 자체 쿠키를 설정할 수 있습니다:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Google Analytics (웹사이트 분석)</li>
            <li>Supabase (인증 및 데이터베이스)</li>
          </ul>
          <p className="mt-4">
            제3자 쿠키에 대한 자세한 정보는 해당 서비스 제공업체의 개인정보처리방침을 참조하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. 쿠키 정책의 변경</h2>
          <p>
            본 쿠키 정책은 법령 및 서비스의 변경사항을 반영하기 위해 수정될 수 있습니다.
            쿠키 정책이 변경되는 경우, 변경사항을 웹사이트에 공지하겠습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. 문의</h2>
          <p>
            쿠키 사용과 관련하여 궁금한 사항이 있으시면 아래로 문의해 주시기 바랍니다:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <ul className="space-y-1 text-sm">
              <li>이메일: contact@protouchdesign.com</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600">
            본 쿠키 정책은 2024년 12월 13일부터 시행됩니다.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
