import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EventDetail } from '../../types/common';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: EventDetail;
  showActions?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, showActions = false }) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return dateString;
    }
  };

  // 상태에 따른 색상 클래스 
  const getStatusClass = () => {
    switch (event.status) {
      case 'active':
        return 'bg-green-900/30 text-green-400 border border-green-900/50';
      case 'draft':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50';
      case 'ended':
        return 'bg-gray-800 text-gray-400 border border-gray-700';
      default:
        return 'bg-gray-800 text-gray-400 border border-gray-700';
    }
  };

  // 상태 텍스트
  const getStatusText = () => {
    switch (event.status) {
      case 'active':
        return '진행 중';
      case 'draft':
        return '초안';
      case 'ended':
        return '종료됨';
      default:
        return '알 수 없음';
    }
  };

  return (
    <motion.div 
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* 이벤트 커버 이미지 */}
      <div className="aspect-w-16 aspect-h-9 bg-zinc-900 relative">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gradient-to-br from-zinc-900 to-zinc-800">
            <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* 상태 배지 */}
        <div className="absolute top-4 right-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusClass()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* 이벤트 정보 */}
      <div className="p-5">
        {/* 이벤트 날짜 및 시간 */}
        <div className="flex items-center space-x-1 text-sm text-gray-400 mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.date)}</span>
          <span>•</span>
          <span>{event.time}</span>
        </div>

        {/* 이벤트 제목 및 설명 */}
        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>

        {/* 장소 */}
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0z" />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>

        {/* 참가자 정보 */}
        {(event.maxAttendees !== null && event.maxAttendees > 0) && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">참가 현황</span>
              <span className="text-gray-300">
                {event.currentAttendees} / {event.maxAttendees}
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2"
                style={{ width: `${Math.min(100, (event.currentAttendees / event.maxAttendees) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="pt-4 mt-2 border-t border-zinc-800 flex justify-between items-center">
          {showActions ? (
            <>
              <Link
                href={`/events/${event.id}`}
                className="text-gray-300 hover:text-white text-sm font-medium flex items-center"
              >
                상세보기
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={`/events/${event.id}/edit`}
                className="text-primary hover:text-primary-light text-sm font-medium"
              >
                수정
              </Link>
            </>
          ) : (
            <Link
              href={`/r/${event.id}`}
              className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg text-center transition-colors"
            >
              참가 등록
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
