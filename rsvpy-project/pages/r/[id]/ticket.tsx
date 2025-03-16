import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import dynamic from 'next/dynamic';
import TicketPrintingAnimation from '../../../components/tickets/TicketPrintingAnimation';

// 클라이언트 사이드에서만 렌더링되도록 dynamic import
const TicketViewer = dynamic(() => import('../../../components/tickets/TicketViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-10 h-[400px] bg-zinc-900/30 rounded-lg border border-zinc-800">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  ),
});

const TicketPage = () => {
  const router = useRouter();
  const { id, name, email, ticketId } = router.query;
  const [showPrintingAnimation, setShowPrintingAnimation] = useState(true);
  const [eventDetails, setEventDetails] = useState({ title: '', date: '', time: '', location: '' });
  
  // 이벤트 정보 로드
  useEffect(() => {
    if (id) {
      // 실제 API 호출 대신 임시 데이터
      const mockEventDetails = {
        title: id === '1' ? '2023 개발자 컨퍼런스' : `이벤트 ${id}`,
        date: '2023년 6월 15일',
        time: '10:00',
        location: '서울 강남구 테헤란로 123'
      };
      
      setEventDetails(mockEventDetails);
    }
  }, [id]);

  // 애니메이션 완료 처리
  const handleAnimationComplete = () => {
    setShowPrintingAnimation(false);
  };

  // 참가자 이름이나 티켓 ID가 없으면 로드 화면
  if (!name || !ticketId || showPrintingAnimation) {
    return (
      <>
        {showPrintingAnimation && (
          <TicketPrintingAnimation
            eventName={eventDetails.title}
            participantName={name as string || 'Guest'}
            onComplete={handleAnimationComplete}
            duration={3000}
          />
        )}
      </>
    );
  }

  return (
    <Layout title={`티켓 - ${name}`} withHeader={false}>
      <div className="min-h-screen flex flex-col">
        {/* 헤더 영역 */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로
          </Link>
          
          <div className="text-xs text-gray-500">RSVPY 티켓</div>
        </div>

        <div className="flex-grow flex flex-col items-center p-4 md:p-8">
          {/* 티켓 정보 */}
          <div className="w-full max-w-md mb-6 text-center">
            <h1 className="text-xl font-bold mb-2">{eventDetails.title}</h1>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <div>{eventDetails.date}</div>
              <div className="hidden md:block">•</div>
              <div>{eventDetails.time}</div>
            </div>
          </div>

          {/* 3D 티켓 */}
          <div className="ticket-shadow w-full max-w-md rounded-xl overflow-hidden">
            <TicketViewer
              eventName={eventDetails.title}
              participantName={name as string}
              ticketId={ticketId as string}
              showControls={true}
              height="380px"
            />
          </div>

          {/* 참가자 정보 */}
          <div className="w-full max-w-md mt-8 bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">참가자</p>
                <p className="font-medium">{name}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">이메일</p>
                <p className="font-medium">{email}</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-xs text-gray-500">티켓 ID</p>
                <p className="font-medium font-mono text-sm bg-zinc-900 p-2 rounded mt-1">{ticketId}</p>
              </div>
            </div>
          </div>
          
          {/* 행사 정보 및 액션 버튼 */}
          <div className="w-full max-w-md mt-4 bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
            <div className="mb-4">
              <p className="text-xs text-gray-500">행사 장소</p>
              <p className="font-medium">{eventDetails.location}</p>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-gray-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm0 0h6" />
                </svg>
                인쇄
              </button>
              
              <button
                onClick={() => {
                  // 공유 API를 지원하는 브라우저에서만 동작
                  if (navigator.share) {
                    navigator.share({
                      title: `${eventDetails.title} - 티켓`,
                      text: `${name}님의 ${eventDetails.title} 이벤트 티켓입니다`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('티켓 링크가 클립보드에 복사되었습니다');
                  }
                }}
                className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                공유하기
              </button>
            </div>
          </div>
        </div>

        <div className="py-4 text-center text-xs text-gray-500 border-t border-zinc-800">
          <p>© 2023 RSVPY - 프리미엄 이벤트 관리 플랫폼</p>
        </div>
      </div>
    </Layout>
  );
};

export default TicketPage;
