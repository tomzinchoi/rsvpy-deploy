import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { TicketViewerProps } from '../../types/common';

// Three.js 티켓은 클라이언트 사이드에서만 렌더링
const Ticket3D = dynamic(() => import('./Ticket3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  ),
});

const TicketViewer: React.FC<TicketViewerProps> = ({
  eventName,
  participantName,
  ticketId,
  showControls = false,
  height = '300px',
  className = ''
}) => {
  const [rotation, setRotation] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // 자동 회전 함수
  const animate = (time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }
    
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    if (isAutoRotate) {
      setRotation((prev) => prev + deltaTime * 0.02);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // 자동 회전 시작/중지
  useEffect(() => {
    if (isAutoRotate) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoRotate]);
  
  // 회전 수동 제어
  const handleRotate = (direction: 'left' | 'right') => {
    setIsAutoRotate(false);
    setRotation((prev) => prev + (direction === 'left' ? -Math.PI / 4 : Math.PI / 4));
  };
  
  // QR 코드 노출 토글
  const toggleQrCode = () => {
    setIsQrVisible((prev) => !prev);
    setIsAutoRotate(false);
  };
  
  return (
    <div
      className={`relative bg-gradient-to-b from-zinc-900/80 to-zinc-950 overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* 3D 티켓 */}
      <Ticket3D
        eventName={eventName}
        participantName={participantName}
        ticketId={ticketId}
        rotation={rotation}
        showQr={isQrVisible}
      />
      
      {/* 컨트롤 버튼 */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-3"
        >
          <button
            onClick={() => handleRotate('left')}
            className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2 rounded-full ${
              isAutoRotate 
                ? 'bg-primary/80 hover:bg-primary' 
                : 'bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700'
            } transition-colors`}
          >
            {isAutoRotate ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={toggleQrCode}
            className={`p-2 rounded-full ${
              isQrVisible 
                ? 'bg-primary/80 hover:bg-primary' 
                : 'bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700'
            } transition-colors`}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>
          
          <button
            onClick={() => handleRotate('right')}
            className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TicketViewer;
