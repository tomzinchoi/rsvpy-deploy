import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';
import { motion } from 'framer-motion';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const { redirect } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      
      // 리디렉션 처리
      const redirectPath = typeof redirect === 'string' ? redirect : '/dashboard';
      router.push(redirectPath);
    } catch (error: any) {
      console.error('로그인 오류:', error);
      
      // 오류 메시지 처리
      if (error.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
      
      setLoading(false);
    }
  };

  return (
    <Layout title="로그인 - RSVPY" withHeader={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* 배경 효과 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
          
          {/* 장식용 원 요소들 */}
          <div className="absolute top-20 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Logo size="lg" />
            <p className="text-xl text-gray-400 mt-3">프리미엄 이벤트 관리 플랫폼</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-900/90 backdrop-blur-lg border border-zinc-800/70 p-8 rounded-xl shadow-2xl"
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">로그인</h1>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="name@example.com"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    비밀번호
                  </label>
                  <a href="/auth/forgot-password" className="text-sm text-primary hover:text-primary-light">
                    비밀번호 찾기
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded bg-zinc-800 border-zinc-700 text-primary focus:ring-primary focus:ring-opacity-25"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  로그인 상태 유지
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </button>
              
              <div className="text-center text-gray-400">
                계정이 없으신가요?{' '}
                <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-light transition-colors">
                  회원가입
                </Link>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-zinc-900 text-gray-500">또는</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google 로그인
                </button>
                
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 208 191.94">
                    <path
                      d="M0,9.77A9.55,9.55,0,0,1,9.77,0H198.23A9.55,9.55,0,0,1,208,9.77V182.16a9.55,9.55,0,0,1-9.77,9.77H9.77A9.55,9.55,0,0,1,0,182.16Z"
                      fill="#FFE812"
                    />
                    <path
                      d="M165.48,39.9c-33.2,0-60.15,21.24-60.15,47.35,0,16.92,11.14,31.75,27.93,40.28-1.25,4.32-4.53,15.64-5.18,18a6.37,6.37,0,0,0,2.92,6c1.56.87,3.36.53,5-.89,2.09-1.82,28.47-18.44,32.69-21.37,33.2,0,60.15-21.24,60.15-47.35S198.68,39.9,165.48,39.9Z"
                      fill="#381F1E"
                    />
                  </svg>
                  카카오 로그인
                </button>
              </div>
            </form>
          </motion.div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            계속 진행하면 RSVPY의 <a href="#" className="text-primary hover:underline">이용약관</a> 및 
            <a href="#" className="text-primary hover:underline"> 개인정보처리방침</a>에 동의하게 됩니다.
          </div>
        </div>
      </div>
    </Layout>
  );
}
