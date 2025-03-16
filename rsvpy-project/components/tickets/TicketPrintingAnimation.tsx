import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TicketPrintingAnimationProps {
  eventName: string;
  participantName: string;
  onComplete: () => void;
  duration?: number;
}

const TicketPrintingAnimation: React.FC<TicketPrintingAnimationProps> = ({
  eventName,
  participantName,
  onComplete,
  duration = 4000 // 기본 4초
}) => {
  const [progress, setProgress] = useState(0);

  // 애니메이션 진행 상태 업데이트
  useEffect(() => {
    const interval = 100; // 100ms마다 업데이트
    const steps = duration / interval;
    const increment = 100 / steps;
    
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + increment;
        
        // 애니메이션 완료
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 500); // 애니메이션 완료 후 0.5초 후 완료 콜백 실행
          return 100;
        }
        
        return newProgress;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-8">
      {/* 로고 애니메이션 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-white mb-2">RSVPY</h1>
        <p className="text-gray-400 text-center">티켓을 발급하는 중...</p>
      </motion.div>

      {/* 티켓 프린터 애니메이션 */}
      <div className="w-full max-w-md relative mb-8">
        {/* 프린터 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-zinc-800 rounded-lg p-4 shadow-xl border border-zinc-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-gray-400">RSVPY 티켓 프린터</div>
          </div>
          
          {/* 프린터 슬롯 */}
          <div className="bg-zinc-900/50 h-2 w-full rounded-lg mb-2"></div>
          
          {/* 티켓 출력 슬롯 */}
          <div className="bg-zinc-900 h-12 w-full rounded-lg relative overflow-hidden">
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: progress > 20 ? 0 : -100 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute inset-x-0 top-0 h-2 bg-zinc-800"
            ></motion.div>
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: progress > 50 ? 1 : 0 }}
            >
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* 티켓 출력 애니메이션 */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: progress > 30 ? (progress - 30) * 1.5 : -20,
            opacity: progress > 30 ? 1 : 0
          }}
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute left-0 right-0 mx-auto w-11/12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 shadow-lg shadow-primary/10"
          style={{ top: '100%' }}
        >
          <div className="bg-zinc-900/80 rounded p-3">
            <div className="text-sm font-medium text-gray-300 mb-1">{eventName}</div>
            <div className="text-lg font-bold text-white">{participantName}</div>
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-gray-400">티켓 생성 중...</div>
              <div className="h-6 w-6 rounded bg-zinc-800"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 진행 표시줄 */}
      <div className="w-full max-w-md">
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          ></motion.div>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>티켓 생성 중...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default TicketPrintingAnimation;
