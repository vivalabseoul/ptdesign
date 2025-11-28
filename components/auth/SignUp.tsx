import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, 'user', phone);
      if (error) {
        setError(error.message || '회원가입에 실패했습니다');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-2 border-gray-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">회원가입</CardTitle>
          <CardDescription>
            Pro Touch Design에 가입하여 분석을 시작하세요
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
                type="tel"
                placeholder="전화번호 (예: 010-1234-5678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input-primary"
              />
              <p className="text-base text-gray-500 mt-1 ml-1">
                * 할인 혜택 및 프로모션 정보 제공을 위해 수집됩니다
              </p>
            </div>
            <div>
              <Input
                type="password"
                placeholder="비밀번호 (최소 6자)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-primary"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>
          <div className="mt-4 text-center text-lg">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link to="/login" className="text-primary hover:underline">
              로그인
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

