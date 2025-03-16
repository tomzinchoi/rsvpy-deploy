import React from 'react';
import { motion } from 'framer-motion';

interface GestureHandleProps {
  className?: string;
}

const GestureHandle: React.FC<GestureHandleProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-center w-full py-2 cursor-grab active:cursor-grabbing ${className}`}>
      <motion.div 
        className="w-12 h-1 bg-zinc-700 rounded-full" 
        whileHover={{ backgroundColor: 'rgb(113 113 122)' }} // zinc-500
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

export default GestureHandle;
