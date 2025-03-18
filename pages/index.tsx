import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ImageFallback from '../components/ImageFallback';

export default function Home() {
  // 이미지 로딩 상태 관리
  const [eventImageLoaded, setEventImageLoaded] = useState(false);
  const [templateImages, setTemplateImages] = useState({
    wedding: false,
    birthday: false,
    business: false
  });

  // 이미지 로딩 처리 함수
  const handleTemplateImageLoad = (type: keyof typeof templateImages) => {
    setTemplateImages(prev => ({
      ...prev,
      [type]: true
    }));
  };

  return (
    <Layout title="RSVPY - 개인 맞춤형 이벤트 관리 플랫폼" transparentHeader={true}>
      {/* 히어로 섹션 */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[#1E2330]">
              당신의 이벤트를 쉽게 관리하는 방법
            </h1>
            
            <p className="text-xl md:text-2xl text-[#1E2330] max-w-3xl mx-auto mb-10 font-light">
              한 곳에서 모든 이벤트 정보를 공유하고 관리하세요
            </p>
            
            <div className="mb-10">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-[#7722cf] hover:bg-[#6317a9] text-white font-medium rounded-md transition-all shadow-md"
              >
                무료로 시작하기
              </Link>
            </div>
          </motion.div>

          {/* 이미지 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6"
          >
            {/* 메인 이미지 (브라우저 창) */}
            <div className="relative mx-auto max-w-lg border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-[#F9F9F9] p-2 border-b border-gray-200 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              
              {/* 일반 이미지 태그로 대체 + 로딩 폴백 구현 */}
              <div className="relative w-full" style={{ minHeight: "300px" }}>
                {!eventImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                      <div className="mt-4 h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                )}
                
                <ImageFallback 
                  src="/images/event-page-preview.png"
                  alt="RSVPY 이벤트 페이지 미리보기"
                  className={`w-full ${eventImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setEventImageLoaded(true)}
                  fallbackSrc="/images/fallback-preview.png"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 기능 섹션 */}
      <section className="py-16 px-4 bg-[#F9F9F9]">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4 text-[#1E2330]">누구나 쉽게 멋진 이벤트 페이지를</h2>
            <p className="text-lg text-[#666] max-w-xl mx-auto">
              RSVPy를 사용하면 어떤 기술 지식 없이도 멋진 이벤트 페이지를 만들 수 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* 기능 아이템 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-[#7722cf]/10 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg className="w-6 h-6 text-[#7722cf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1E2330] text-center">
                간편한 페이지 생성
              </h3>
              <p className="text-center text-[#666]">
                몇 분 안에 전문적인 이벤트 페이지를 생성하고 참가자들에게 공유하세요
              </p>
            </motion.div>

            {/* 기능 아이템 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-[#7722cf]/10 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg className="w-6 h-6 text-[#7722cf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1E2330] text-center">
                실시간 참석 관리
              </h3>
              <p className="text-center text-[#666]">
                참가자들의 RSVP 상태를 실시간으로 확인하고 관리할 수 있어요
              </p>
            </motion.div>

            {/* 기능 아이템 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-[#7722cf]/10 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg className="w-6 h-6 text-[#7722cf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1E2330] text-center">
                다양한 커스터마이징
              </h3>
              <p className="text-center text-[#666]">
                개인 브랜드와 이벤트 성격에 맞게 모든 요소를 맞춤 설정할 수 있어요
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 템플릿 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4 text-[#1E2330]">다양한 템플릿으로 빠르게</h2>
            <p className="text-lg text-[#666] max-w-xl mx-auto">
              결혼식, 생일파티, 네트워킹 모임 등 모든 유형의 이벤트에 맞는 템플릿을 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 템플릿 카드 - 결혼식 */}
            <motion.div 
              className="rounded-lg overflow-hidden shadow-md border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(119, 34, 207, 0.1), 0 4px 6px -2px rgba(119, 34, 207, 0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-48 bg-gray-100">
                {!templateImages.wedding && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse w-full h-full bg-gray-200"></div>
                  </div>
                )}
                <ImageFallback 
                  src="/images/templates/wedding.jpg" 
                  alt="결혼식 템플릿" 
                  className={`w-full h-full object-cover ${templateImages.wedding ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleTemplateImageLoad('wedding')}
                  fallbackSrc="/images/fallback-template.png"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#1E2330]">결혼식</h3>
                <p className="text-[#666] text-sm">축하와 함께 결혼식의 모든 정보를 한눈에 보여주세요</p>
              </div>
            </motion.div>
            
            {/* 템플릿 카드 - 생일파티 */}
            <motion.div 
              className="rounded-lg overflow-hidden shadow-md border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(119, 34, 207, 0.1), 0 4px 6px -2px rgba(119, 34, 207, 0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-48 bg-gray-100">
                {!templateImages.birthday && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse w-full h-full bg-gray-200"></div>
                  </div>
                )}
                <ImageFallback 
                  src="/images/templates/birthday.jpg" 
                  alt="생일파티 템플릿" 
                  className={`w-full h-full object-cover ${templateImages.birthday ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleTemplateImageLoad('birthday')}
                  fallbackSrc="/images/fallback-template.png"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#1E2330]">생일 파티</h3>
                <p className="text-[#666] text-sm">특별한 날을 함께할 친구들을 위한 생일 초대장</p>
              </div>
            </motion.div>
            
            {/* 템플릿 카드 - 비즈니스 네트워킹 */}
            <motion.div 
              className="rounded-lg overflow-hidden shadow-md border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(119, 34, 207, 0.1), 0 4px 6px -2px rgba(119, 34, 207, 0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-48 bg-gray-100">
                {!templateImages.business && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse w-full h-full bg-gray-200"></div>
                  </div>
                )}
                <ImageFallback 
                  src="/images/templates/business.jpg" 
                  alt="비즈니스 네트워킹 템플릿" 
                  className={`w-full h-full object-cover ${templateImages.business ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleTemplateImageLoad('business')}
                  fallbackSrc="/images/fallback-template.png"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#1E2330]">비즈니스 네트워킹</h3>
                <p className="text-[#666] text-sm">프로페셔널한 분위기로 비즈니스 이벤트를 관리하세요</p>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/templates" className="text-[#7722cf] font-medium hover:underline inline-flex items-center">
              더 많은 템플릿 보기
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-[#7722cf]/5 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1E2330]">더 이상 복잡한 이벤트 관리는 그만</h2>
            <p className="text-lg text-[#666] mb-8 max-w-xl mx-auto">
              RSVPY와 함께라면 손쉽게 이벤트를 관리하고, 참가자들에게 훌륭한 경험을 제공할 수 있습니다.
            </p>
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-[#7722cf] hover:bg-[#6317a9] text-white font-medium rounded-md transition-all shadow-md inline-block"
            >
              무료로 시작하기
            </Link>
            <p className="mt-4 text-sm text-[#666]">
              신용카드가 필요없고, 가입 후 바로 사용할 수 있어요
            </p>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-[#1E2330]">RSVPY</span>
              </Link>
              <p className="mt-2 text-sm text-[#666]">© 2023 RSVPY. All rights reserved.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-[#1E2330]">제품</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">템플릿</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">기능</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">요금제</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-[#1E2330]">회사</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">소개</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">블로그</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">채용</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">연락처</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-[#1E2330]">리소스</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">도움말</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">가이드</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-[#1E2330]">법적 고지</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">이용약관</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">개인정보처리방침</a></li>
                  <li><a href="#" className="text-[#666] hover:text-[#7722cf]">쿠키 정책</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
