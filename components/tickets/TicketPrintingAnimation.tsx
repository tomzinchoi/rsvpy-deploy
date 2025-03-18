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
  duration = 3000
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + 2;
        return newValue <= 100 ? newValue : 100;
      });
    }, duration / 50);

    setTimeout(() => {
      clearInterval(interval);
      setTimeout(onComplete, 500); // Small delay after hitting 100%
    }, duration);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-bold mb-2 text-white">{eventName}</h2>
        <p className="text-lg text-gray-300 mb-10">티켓 생성 중</p>

        <div className="flex flex-col items-center space-y-4">
          {/* Printer animation */}
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded-lg p-4 pb-8 relative">
            {/* Printer top */}
            <div className="h-4 bg-zinc-800 rounded-t-sm mx-4 mb-4"></div>
            
            {/* Ticket coming out */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 w-4/5 bg-gradient-to-b from-primary/80 to-indigo-900/80 rounded shadow-lg overflow-hidden"
              initial={{ y: -10, height: 0 }}
              animate={{ 
                y: progress > 95 ? 120 : 20, 
                height: progress > 0 ? 150 : 0,
                opacity: progress > 95 ? 0 : 1
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {progress > 20 && (
                <div className="p-4">
                  <p className="text-sm font-medium text-white opacity-80">{eventName}</p>
                  {progress > 40 && (
                    <p className="text-xs text-white/60 mt-1">{participantName}</p>
                  )}
                </div>
              )}
            </motion.div>
            
            {/* Printer light */}
            <div className={`absolute top-2 right-3 w-2 h-2 rounded-full ${progress < 100 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-gray-400 text-sm">
            {progress < 100 
              ? `티켓 프린팅 중... ${progress}%` 
              : "티켓 발급 완료!"}
          </p>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default TicketPrintingAnimation;
