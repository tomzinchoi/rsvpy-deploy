import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { TicketViewerProps } from '../../types/common';

// Dynamically import the 3D ticket component to prevent SSR issues
const TicketCanvas = dynamic(() => import('./TicketCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
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
  const [isClient, setIsClient] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  // Only render on client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
    
    // Auto-disable rotation after 10 seconds if controls are shown
    if (showControls) {
      const timer = setTimeout(() => {
        setIsRotating(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  // Toggle rotation
  const toggleRotation = () => setIsRotating(prev => !prev);
  
  // Toggle flip
  const toggleFlip = () => setIsFlipped(prev => !prev);

  if (!isClient) return null;

  return (
    <div
      className={`relative bg-gradient-radial from-zinc-900 to-black overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* 3D Ticket Canvas */}
      <div className="absolute inset-0">
        <TicketCanvas
          eventName={eventName}
          participantName={participantName}
          ticketId={ticketId}
          controlsEnabled={showControls}
          autoRotate={isRotating}
          floatIntensity={isRotating ? 1 : 0.3}
        />
      </div>
      
      {/* Controls overlay */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-3"
        >
          <button
            onClick={toggleFlip}
            className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 transition-colors"
            aria-label="Flip ticket"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button
            onClick={toggleRotation}
            className={`p-2 rounded-full ${
              isRotating 
                ? 'bg-primary/80 hover:bg-primary' 
                : 'bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700'
            } transition-colors`}
            aria-label={isRotating ? "Stop auto-rotation" : "Start auto-rotation"}
          >
            {isRotating ? (
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
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                const container = document.querySelector('.ticket-canvas');
                if (container) {
                  container.requestFullscreen();
                }
              }
            }}
            className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 transition-colors"
            aria-label="Fullscreen"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </motion.div>
      )}
      
      {/* Overlay instructions if controls are enabled */}
      {showControls && (
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white/70">
          드래그하여 회전
        </div>
      )}
    </div>
  );
};

export default TicketViewer;
