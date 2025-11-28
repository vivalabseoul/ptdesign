import { Download, Monitor } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";

interface MobileDownloadOnlyViewProps {
  reportId: string;
  onDownloadPDF: () => void;
}

export function MobileDownloadOnlyView({ reportId, onDownloadPDF }: MobileDownloadOnlyViewProps) {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "var(--secondary)" + "20" }}
          >
            <Monitor 
              className="w-12 h-12"
              style={{ color: "var(--secondary)" }}
            />
          </div>
          
          <h1 
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--primary)" }}
          >
            PC에서 확인해주세요
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            더 나은 가독성을 위해 분석 리포트는 PC에서만 조회할 수 있습니다.
            <br />
            PDF 다운로드는 모든 디바이스에서 가능합니다.
          </p>
          
          <button
            onClick={onDownloadPDF}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
            style={{ background: "var(--accent)" }}
          >
            <Download className="w-5 h-5" />
            PDF 다운로드
          </button>
          
          <div 
            className="mt-6 p-4 rounded-lg"
            style={{ background: "var(--secondary)" + "10" }}
          >
            <p className="text-base text-gray-700">
              💡 <strong>Tip:</strong> 다운로드한 PDF는 모바일에서도 편하게 확인하실 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
