import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/layout/Layout';
import { generateTicketId, parseDateString } from '../utils/ticketUtils';

// 클라이언트 사이드에서만 렌더링하기 위해 dynamic import 사용
const TicketViewer = dynamic(() => import('../components/tickets/TicketViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-10 h-[400px] bg-zinc-900/30 rounded-lg border border-zinc-800">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  ),
});

const TicketSamplePage = () => {
  const [isClient, setIsClient] = useState(false);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    setIsClient(true);
    
    // 티켓 ID 생성
    const eventDate = parseDateString('2023-06-15');
    const generatedTicketId = generateTicketId(eventDate, 'SAMPLE');
    setTicketId(generatedTicketId);
  }, []);

  return (
    <Layout title="티켓 샘플 - RSVPY">
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">티켓 미리보기</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              RSVPY의 3D 티켓은 이벤트 참가자에게 특별한 경험을 제공합니다. 
              이 샘플 티켓을 확인해보세요.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">티켓 샘플</h2>
              <p className="text-gray-400">
                이 티켓은 샘플용으로 생성되었습니다. 실제 이벤트에 등록하면 유사한 형태의 티켓이 발급됩니다.
              </p>
            </div>

            {isClient && (
              <div className="ticket-shadow rounded-xl overflow-hidden">
                <TicketViewer
                  eventName="2023 개발자 컨퍼런스"
                  participantName="Guest User"
                  ticketId={ticketId}
                  showControls={true}
                  height="400px"
                />
              </div>
            )}

            <div className="mt-8 p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
              <h3 className="font-medium mb-2">참고사항</h3>
              <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                <li>실제 티켓은 이벤트 등록 시 자동으로 발급됩니다.</li>
                <li>티켓은 QR 코드를 통해 이벤트 당일 확인 가능합니다.</li>
                <li>모바일 기기에서도 3D 티켓을 감상할 수 있습니다.</li>
                <li>티켓은 이메일로도 전송됩니다.</li>
              </ul>
            </div>

            <div className="flex justify-center mt-8">
              <a
                href="/events/create"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/20"
              >
                이벤트 만들기
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TicketSamplePage;
