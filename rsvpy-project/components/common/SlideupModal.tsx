import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GestureHandle from './GestureHandle';

interface SlideupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showHeader?: boolean;
  height?: string;
  bgOpacity?: number;
}

const SlideupModal: React.FC<SlideupModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showHeader = true,
  height = 'auto',
  bgOpacity = 0.7
}) => {
  // 모달이 열려 있을 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity})` }}
        >
          <motion.div
            className="w-full max-w-md sm:max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-xl sm:rounded-xl shadow-xl overflow-hidden"
            style={{ maxHeight: '90vh', height: height }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모바일용 제스처 핸들 */}
            <div className="sm:hidden">
              <GestureHandle />
            </div>

            {/* 헤더 */}
            {showHeader && (
              <div className="border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
                <h2 className="text-lg font-medium">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* 콘텐츠 */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: showHeader ? 'calc(90vh - 57px)' : '90vh' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideupModal;
