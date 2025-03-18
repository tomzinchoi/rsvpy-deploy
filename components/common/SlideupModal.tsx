import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GestureHandle from './GestureHandle';

interface SlideupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showHandle?: boolean;
  height?: 'auto' | 'full' | string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

const SlideupModal: React.FC<SlideupModalProps> = ({
  isOpen,
  onClose,
  title,
  showHandle = true,
  height = 'auto',
  children,
  closeOnBackdropClick = true
}) => {
  const [modalHeight, setModalHeight] = useState<string>(height === 'full' ? '85vh' : height === 'auto' ? 'auto' : height);

  // Prevent body scrolling when modal is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
          />
          
          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col"
            style={{ height: modalHeight }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {showHandle && <GestureHandle className="pt-2" />}
            
            {title && (
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-semibold text-lg">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <div className={`flex-1 overflow-y-auto ${title ? '' : 'pt-2'}`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SlideupModal;
