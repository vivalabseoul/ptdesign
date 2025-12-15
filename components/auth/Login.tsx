import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate("/customer/dashboard");
    } catch (err: any) {
      console.error("로그인 실패:", err);
      setError(err.message || "로그인 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-2 border-gray-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">로그인</CardTitle>
          <CardDescription>
            Pro Touch Design에 오신 것을 환영합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-primary"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-primary"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <div className="mt-4 text-center text-lg">
            <span className="text-gray-600">계정이 없으신가요? </span>
            <Link to="/signup" className="text-primary hover:underline">
              회원가입
            </Link>
          </div>
          <div className="mt-2 text-center text-lg">
            <Link to="/" className="text-gray-600 hover:underline">
              메인으로 돌아가기
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
