import { useEffect, useState } from "react";
import { supabase, SUPABASE_URL, USE_SUPABASE } from "../lib/supabase";
import { Database, Wifi, WifiOff, AlertCircle, RefreshCw } from "lucide-react";

export function SupabaseTest() {
  const [status, setStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);
  const supabaseEnabled = USE_SUPABASE;

  const testConnection = async () => {
    if (!supabaseEnabled) {
      setStatus("error");
      setMessage(
        "Supabase 연결이 비활성화되어 있습니다. 로컬 테스트 계정을 사용 중입니다."
      );
      setDetails(null);
      return;
    }
    setStatus("testing");
    setMessage("Supabase 연결 테스트 중...");

    try {
      // 1. 기본 연결 테스트
      const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true });

      if (error) {
        console.error("연결 테스트 에러:", error);
        setStatus("error");
        setMessage(`연결 실패: ${error.message}`);
        setDetails(error);
        return;
      }

      setStatus("success");
      setMessage("✅ Supabase 연결 성공!");
      setDetails({ data, timestamp: new Date().toISOString() });
    } catch (err: any) {
      console.error("연결 테스트 예외:", err);
      setStatus("error");
      setMessage(`연결 실패: ${err.message || "Unknown error"}`);
      setDetails(err);
    }
  };

  useEffect(() => {
    testConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="bg-white rounded-lg shadow-lg border-2 p-4 max-w-sm"
        style={{ borderColor: "var(--secondary)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Database className="w-5 h-5" style={{ color: "var(--accent)" }} />
          <h3 className="font-semibold" style={{ color: "var(--primary)" }}>
            Supabase 연결 테스트
          </h3>
        </div>

        <button
          onClick={testConnection}
          disabled={status === "testing"}
          className="w-full py-2 px-4 rounded-lg font-semibold transition-all mb-3 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "var(--accent)", color: "white" }}
        >
          {status === "testing" && (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          )}
          {status === "testing" ? "테스트 중..." : "다시 테스트"}
        </button>

        {status !== "idle" && (
          <div
            className={`p-3 rounded-lg flex items-start gap-2 ${
              status === "success"
                ? "bg-green-50 border border-green-200"
                : status === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            {status === "success" && (
              <Wifi className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
            {status === "error" && (
              <WifiOff className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            {status === "testing" && (
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 animate-pulse" />
            )}

            <div className="flex-1">
              <p
                className={`text-base ${
                  status === "success"
                    ? "text-green-800"
                    : status === "error"
                    ? "text-red-800"
                    : "text-blue-800"
                }`}
              >
                {message}
              </p>

              {details && (
                <details className="mt-2">
                  <summary className="text-sm cursor-pointer text-gray-600 hover:text-gray-800">
                    상세 정보 보기
                  </summary>
                  <pre className="text-sm mt-2 p-2 bg-white rounded overflow-auto max-h-32">
                    {JSON.stringify(details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500 space-y-1">
          <p>
            {supabaseEnabled
              ? `URL: ${SUPABASE_URL}`
              : "현재 VITE_USE_SUPABASE=false · 로컬 모드"}
          </p>
          {!supabaseEnabled && (
            <p>
              .env에 `VITE_USE_SUPABASE=true`와 키를 설정하면 실서버 인증이
              활성화됩니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
