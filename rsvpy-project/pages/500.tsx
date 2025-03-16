import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Logo from '../components/common/Logo';

export default function Custom500() {
  return (
    <Layout title="서버 오류 - RSVPY" withHeader={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* 배경 효과 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
          
          {/* 장식 효과 */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-900/5 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Logo size="lg" linkToHome={false} />
          
          <div className="mt-10 flex items-center justify-center">
            <div className="text-6xl md:text-8xl font-bold text-white mr-6 border-r border-zinc-800 pr-6">500</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">서버 오류</h1>
              <p className="text-gray-400 mb-8 max-w-md">
                죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도하거나 아래 버튼을 클릭하여 홈으로 이동하세요.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 text-center"
                >
                  홈으로 이동
                </Link>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                >
                  새로고침
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-gray-500 text-sm">
              문제가 계속되면 <a href="mailto:support@rsvpy.com" className="text-primary hover:text-primary-light">support@rsvpy.com</a>으로 문의하세요.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
