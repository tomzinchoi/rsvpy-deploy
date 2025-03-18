import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EventDetail } from '../../types/common';
import { formatDateToString } from '../../utils/ticketUtils';
import Image from 'next/image';

interface EventCardProps {
  event: EventDetail;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  // Format date to display
  const formattedDate = formatDateToString(event.date);
  
  // Get the appropriate status badge
  const getStatusBadge = () => {
    switch (event.status) {
      case 'active':
        return <span className="badge badge-success">진행 중</span>;
      case 'draft':
        return <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-400 border border-yellow-900/50 rounded-full text-xs font-medium">임시저장</span>;
      case 'ended':
        return <span className="px-2 py-0.5 bg-zinc-800 text-gray-400 border border-zinc-700 rounded-full text-xs font-medium">종료됨</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={`card hover:border-primary/40 ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/events/${event.id}`} className="block h-full">
        <div className="h-full flex flex-col">
          {/* Event cover image or placeholder */}
          <div className="h-48 bg-zinc-800 rounded-lg mb-4 overflow-hidden">
            {event.coverImage ? (
              <img 
                src={event.coverImage} 
                alt={event.title} 
                className="w-full h-full object-cover" // object-cover로 이미지가 잘 보이도록 설정
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
                <span className="text-zinc-500">이미지 없음</span>
              </div>
            )}
          </div>
          
          {/* Event details */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              {getStatusBadge()}
              <span className="text-sm text-gray-400">{event.currentAttendees || 0}명 참석</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">
              {event.title}
            </h3>
            
            <p className="text-sm text-gray-400 mb-3">
              {formattedDate} · {event.time}
            </p>
            
            <p className="text-sm text-gray-500 line-clamp-3 mb-4">
              {event.description || '설명 없음'}
            </p>
          </div>
          
          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-zinc-800 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                {event.organizerImage ? (
                  <img 
                    src={event.organizerImage} 
                    alt={event.organizerName || '주최자'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-zinc-500">
                    {(event.organizerName || '주최자').charAt(0)}
                  </span>
                )}
              </div>
              <span className="ml-2 text-sm text-gray-400">
                {event.organizerName || '주최자'}
              </span>
            </div>
            
            <div className="text-sm text-primary hover:text-purple-400 transition-colors">
              상세보기
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
