import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import RegistrationModal from '../../components/events/RegistrationModal';
import { EventDetail } from '../../types/common';
import { formatDateToString, parseDateString } from '../../utils/ticketUtils';
import { motion } from 'framer-motion';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';

interface EventPageProps {
  event: EventDetail | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context);

  const { id } = context.params!;
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
    },
  };
};

const EventRegistrationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // 이벤트 정보 로드
  useEffect(() => {
    if (id) {
      // 실제 API 호출로 대체해야 함
      setTimeout(() => {
        const mockEvent: EventDetail = {
          id: id as string,
          title: id === '1' ? '2023 개발자 컨퍼런스' : `이벤트 ${id}`,
          description: '최신 웹 개발 트렌드와 기술을 공유하는 연례 컨퍼런스입니다.',
          date: '2023-06-15',
          time: '10:00',
          location: '서울 강남구 테헤란로 123, 개발자 센터',
          maxAttendees: 100,
          currentAttendees: 42,
          status: 'active',
          organizerName: '테크 커뮤니티 코리아',
          contents: [
            {
              id: 'content-1',
              type: 'heading',
              content: '이벤트 소개'
            },
            {
              id: 'content-2',
              type: 'text',
              content: '이 컨퍼런스에서는 최신 웹 기술과 개발 트렌드에 대한 인사이트를 얻을 수 있습니다. 다양한 세션과 네트워킹 기회가 제공됩니다.'
            },
            {
              id: 'content-3',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              id: 'content-4',
              type: 'heading',
              content: '주요 세션'
            },
            {
              id: 'content-5',
              type: 'text',
              content: '- 웹 개발의 미래: 2023년 트렌드\n- 모던 UI/UX 디자인 원칙\n- 실전 React 최적화 기법\n- 서버리스 아키텍처의 장단점\n- AI와 웹 개발의 통합'
            }
          ]
        };
        
        setEvent(mockEvent);
        setLoading(false);
      }, 800);
    }
  }, [id]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }).format(date);
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <Layout title="이벤트 로딩 중...">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-400">이벤트 정보를 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout title="이벤트를 찾을 수 없음">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">이벤트를 찾을 수 없습니다</h1>
          <p className="text-gray-400 mb-8">
            요청하신 이벤트가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <a href="/" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300">
            홈으로 돌아가기
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={event.title}>
      {/* 배경 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-black to-black"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>
      
      <div className="relative z-10">
        {/* 헤더 이미지 영역 */}
        <div className="w-full h-64 md:h-96 bg-zinc-900 relative overflow-hidden">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-900/20"></div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-5xl mx-auto">
                {event.status === 'active' && (
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-900/50 rounded-full text-xs font-medium inline-block mb-4">
                    참가 가능
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-white">{event.title}</h1>
                <p className="text-lg md:text-xl text-gray-300">
                  {formatDate(event.date)} · {event.time}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 이벤트 정보 섹션 */}
        <div className="bg-zinc-900/30 border-t border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 lg:px-0 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 왼쪽: 이벤트 세부 정보 */}
              <div className="w-full md:w-2/3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* 상세 설명 */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">이벤트 소개</h2>
                    <p className="text-gray-300 leading-relaxed">{event.description}</p>
                  </div>

                  {/* 이벤트 콘텐츠 */}
                  <div className="space-y-6">
                    {event.contents.map((content) => {
                      switch (content.type) {
                        case 'heading':
                          return <h2 key={content.id} className="text-2xl font-bold mt-8 mb-4">{content.content}</h2>;
                        case 'text':
                          return <p key={content.id} className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content.content}</p>;
                        case 'image':
                          return (
                            <div key={content.id} className="my-8">
                              <img 
                                src={content.content} 
                                alt="이벤트 이미지" 
                                className="w-full rounded-lg shadow-lg"
                              />
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                </motion.div>
              </div>
              
              {/* 오른쪽: 등록 카드 및 정보 */}
              <div className="w-full md:w-1/3">
                <div className="sticky top-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {/* 등록 카드 */}
                    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 shadow-xl mb-6">
                      <h3 className="text-xl font-bold mb-6">이벤트 참가</h3>

                      {/* 이벤트 정보 요약 */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-start">
                          <div className="bg-zinc-800 rounded-full p-2 mr-3 mt-1">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">날짜 및 시간</p>
                            <p className="font-medium">{formatDate(event.date)}</p>
                            <p className="font-medium">{event.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-zinc-800 rounded-full p-2 mr-3 mt-1">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">장소</p>
                            <p className="font-medium">{event.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-zinc-800 rounded-full p-2 mr-3 mt-1">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">참가자</p>
                            <div className="flex items-center">
                              <p className="font-medium">{event.currentAttendees}</p>
                              {event.maxAttendees && (
                                <p className="text-gray-500">
                                  <span className="mx-1">/</span>
                                  {event.maxAttendees}명
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 등록 버튼 */}
                      {event.status === 'active' ? (
                        <button
                          onClick={() => setShowRegistrationModal(true)}
                          className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20"
                        >
                          참가 등록하기
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 bg-zinc-800 text-gray-400 cursor-not-allowed rounded-lg"
                        >
                          {event.status === 'draft' ? '준비 중인 이벤트입니다' : '종료된 이벤트입니다'}
                        </button>
                      )}
                    </div>

                    {/* 주최자 정보 */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
                      <h3 className="text-lg font-medium mb-4">주최</h3>
                      <div className="flex items-center">
                        {event.organizerImage ? (
                          <img 
                            src={event.organizerImage} 
                            alt={event.organizerName || '주최자'} 
                            className="w-12 h-12 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 mr-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{event.organizerName || '주최자 정보 없음'}</p>
                          <p className="text-sm text-gray-400">주최자</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 등록 모달 */}
      <RegistrationModal 
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        eventId={event.id}
        eventTitle={event.title}
      />
    </Layout>
  );
};

export default EventRegistrationPage;
