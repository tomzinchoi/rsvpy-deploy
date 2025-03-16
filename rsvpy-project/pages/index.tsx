import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// 3D 티켓 뷰어 (클라이언트 사이드 렌더링)
const TicketViewer = dynamic(() => import('../components/tickets/TicketViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-zinc-900/50 rounded-xl animate-pulse"></div>,
});

export default function Home() {
  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Layout title="RSVPY - 프리미엄 이벤트 관리 플랫폼">
      {/* 히어로 섹션 */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 px-4 overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
          
          {/* 장식용 원형 효과 */}
          <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto">
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                  특별한 이벤트를 위한{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                    3D 티켓
                  </span>
                </h1>
                
                <p className="text-lg text-gray-300 max-w-lg mx-auto md:mx-0 mb-8">
                  RSVPY로 이벤트를 쉽게 관리하고 참가자들에게 특별한 3D 티켓 경험을 제공하세요.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/events/create"
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20"
                  >
                    이벤트 만들기
                  </Link>
                  <Link
                    href="/ticket-sample"
                    className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-gray-300 hover:text-white rounded-lg transition-all"
                  >
                    티켓 샘플 보기
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* 3D 티켓 뷰어 */}
                <div className="ticket-shadow rounded-xl overflow-hidden">
                  <TicketViewer
                    eventName="2023 개발자 컨퍼런스"
                    participantName="김민수"
                    ticketId="20230615-DEMO-ABCDEF"
                    height="350px"
                    showControls={!isMobile}
                  />
                </div>
                
                {/* 장식 요소 */}
                <div className="absolute -top-6 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-3 -left-10 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">강력한 기능</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              RSVPY는 이벤트를 쉽게 관리하고 참가자들에게 특별한 경험을 제공하는 데 필요한 모든 기능을 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 특징 카드 1 */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">이벤트 생성</h3>
              <p className="text-gray-400">
                몇 번의 클릭만으로 전문적인 이벤트 페이지를 생성하고, 참석자 정보를 관리할 수 있습니다.
              </p>
            </div>

            {/* 특징 카드 2 */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">3D 티켓</h3>
              <p className="text-gray-400">
                참가자들에게 독특한 3D 티켓을 제공하여 이벤트 경험을 향상시키고 참여율을 높입니다.
              </p>
            </div>

            {/* 특징 카드 3 */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">관리 도구</h3>
              <p className="text-gray-400">
                이벤트 참가자들을 쉽게 관리하고, 체크인 과정을 간소화하며, 이벤트 진행 상황을 실시간으로 추적합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-30"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">지금 바로 RSVPY로 이벤트를 관리하세요</h2>
            <p className="text-gray-300 mb-8">
              모든 이벤트 요구 사항을 처리할 수 있는 올인원 솔루션을 경험하세요. 
              간단한 모임부터 대규모 컨퍼런스까지 RSVPY가 도와드립니다.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 text-center"
              >
                무료로 시작하기
              </Link>
              <Link
                href="/ticket-sample"
                className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all duration-300 text-center"
              >
                데모 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-white">RSVPY</span>
              </Link>
              <p className="mt-2 text-sm text-gray-500">© 2023 RSVPY. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">제품</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">기능</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">가격</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">회사</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">소개</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">블로그</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">연락처</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">지원</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">도움말</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">개인정보처리방침</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">이용약관</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
