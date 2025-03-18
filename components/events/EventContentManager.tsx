import React from 'react';
import { EventContent, EventDetail } from '../../types/common';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface EventContentManagerProps {
  event: EventDetail;
  readonly?: boolean;
  className?: string;
}

const EventContentManager: React.FC<EventContentManagerProps> = ({
  event,
  readonly = true,
  className = ''
}) => {
  const contents = event.contents || [];

  // 콘텐츠가 없을 경우 표시할 내용
  if (contents.length === 0) {
    return (
      <div className={`py-6 text-center ${className}`}>
        <p className="text-gray-400 italic">이벤트 콘텐츠가 없습니다.</p>
      </div>
    );
  }

  // 각 콘텐츠 블록 렌더링 함수
  const renderContentBlock = (content: EventContent, index: number) => {
    const baseClasses = "mb-6";

    switch (content.type) {
      case 'heading':
        return (
          <h2 key={content.id} className={`text-2xl font-bold mb-4 ${baseClasses}`}>
            {content.content}
          </h2>
        );

      case 'text':
        return (
          <div 
            key={content.id} 
            className={`text-gray-200 whitespace-pre-wrap ${baseClasses}`}
            style={{ lineHeight: '1.6' }}
          >
            {content.content}
          </div>
        );

      case 'image':
        return (
          <div key={content.id} className="mb-6">
            {content.content && (
              <img 
                src={content.content} 
                alt="이벤트 이미지" 
                className="w-full h-auto rounded-lg shadow-md" // h-auto로 이미지 비율 유지
              />
            )}
          </div>
        );

      case 'location':
        return (
          <div key={content.id} className={`${baseClasses}`}>
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">위치</h3>
                  <p className="text-gray-300">{content.content}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div key={content.id} className={`${baseClasses}`}>
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">날짜 및 시간</h3>
                  <p className="text-gray-300">{content.content}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div key={content.id} className={`${baseClasses}`}>
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="text-gray-200">{content.content}</div>
            </div>
          </div>
        );

      default:
        return (
          <div key={content.id} className={`${baseClasses}`}>
            <p className="text-gray-400">{content.content}</p>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {contents
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((content, index) => renderContentBlock(content, index))}
      </motion.div>
    </div>
  );
};

export default EventContentManager;
