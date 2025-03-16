import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { EventDetail } from '../types/common';
import EventCard from '../components/events/EventCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'draft' | 'ended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 이벤트 데이터 로드
  useEffect(() => {
    // 실제 API 호출로 대체해야 함
    const fetchEvents = async () => {
      try {
        // 임시 데이터
        setTimeout(() => {
          const mockEvents: EventDetail[] = [
            {
              id: '1',
              title: '2023 개발자 컨퍼런스',
              description: '최신 웹 개발 트렌드와 기술을 공유하는 연례 컨퍼런스입니다.',
              date: '2023-06-15',
              time: '10:00',
              location: '서울 강남구 테헤란로 123, 개발자 센터',
              maxAttendees: 100,
              currentAttendees: 42,
              status: 'active',
              organizerName: 'Tech Community Korea',
              contents: []
            },
            {
              id: '2',
              title: '스타트업 밋업 네트워킹',
              description: '스타트업 창업자, 투자자, 개발자들이 모여 네트워킹하는 행사입니다.',
              date: '2023-07-22',
              time: '19:00',
              location: '서울 성수동 소셜벤처 허브',
              maxAttendees: 50,
              currentAttendees: 23,
              status: 'active',
              organizerName: 'Startup Seoul',
              contents: []
            },
            {
              id: '3',
              title: '디자인 워크샵',
              description: 'UI/UX 디자인 원칙과 실제 적용 방법을 배우는 실습 워크샵입니다.',
              date: '2023-08-08',
              time: '14:00',
              location: '서울 마포구 연남동 디자인 스튜디오',
              maxAttendees: 30,
              currentAttendees: 5,
              status: 'draft',
              organizerName: 'Design Community',
              contents: []
            },
            {
              id: '4',
              title: '2023 봄 음악 페스티벌',
              description: '다양한 장르의 음악을 즐길 수 있는 야외 페스티벌입니다.',
              date: '2023-05-12',
              time: '12:00',
              location: '서울 올림픽 공원',
              maxAttendees: 500,
              currentAttendees: 485,
              status: 'ended',
              organizerName: 'Music Festival Korea',
              contents: []
            }
          ];
          setEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('이벤트 로드 오류:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 필터링된 이벤트 가져오기
  const getFilteredEvents = () => {
    let filtered = events;
    
    // 상태 필터
    if (activeFilter !== 'all') {
      filtered = filtered.filter(event => event.status === activeFilter);
    }
    
    // 검색어 필터
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  return (
    <Layout title="대시보드 - RSVPY">
      <div className="bg-zinc-900/30 py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">내 이벤트</h1>
              <p className="text-gray-400">당신의 모든 이벤트를 관리하세요.</p>
            </div>
            <Link
              href="/events/create"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 이벤트 만들기
            </Link>
          </div>

          {/* 필터 및 검색 바 */}
          <div className="bg-zinc-900/70 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex space-x-2">
              {['all', 'active', 'draft', 'ended'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  } transition-colors`}
                >
                  {filter === 'all' ? '전체' : 
                   filter === 'active' ? '진행 중' : 
                   filter === 'draft' ? '초안' : '종료됨'}
                </button>
              ))}
            </div>
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="이벤트 검색..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 이벤트 목록 */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                <svg
                  className="w-16 h-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? '검색 결과가 없습니다.' 
                    : activeFilter !== 'all' 
                      ? `${activeFilter === 'active' ? '진행 중인' : activeFilter === 'draft' ? '초안' : '종료된'} 이벤트가 없습니다.`
                      : '이벤트가 없습니다. 새 이벤트를 만들어보세요.'}
                </p>
                <Link
                  href="/events/create"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  이벤트 만들기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <EventCard event={event} showActions={true} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
