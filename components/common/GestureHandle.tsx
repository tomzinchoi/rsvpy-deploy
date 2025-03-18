import React from 'react';

interface GestureHandleProps {
  className?: string;
}

const GestureHandle: React.FC<GestureHandleProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center w-full py-2 ${className}`}>
      <div className="w-12 h-1.5 rounded-full bg-zinc-600 opacity-50" />
    </div>
  );
};

export default GestureHandle;
