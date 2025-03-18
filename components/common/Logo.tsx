import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  className?: string;
  showText?: boolean;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  linkToHome = true,
  className = '',
  showText = false, // 기본값을 false로 변경
  color = 'white'
}) => {
  // Size mapping for logo dimensions - 크기를 키움
  const sizeDimensions = {
    sm: { width: 64, height: 64 }, // 더 큰 크기로 변경
    md: { width: 128, height: 128 }, // 더 큰 크기로 변경
    lg: { width: 256, height: 256 }  // 더 큰 크기로 변경
  };
  
  const { width, height } = sizeDimensions[size];
  
  const LogoContent = (
    <div className={`flex items-center ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Image 
          src="/images/logo.png" 
          alt="RSVPY Logo" 
          width={width} 
          height={height}
          priority
        />
      </motion.div>
      
      {/* showText가 false면 텍스트 표시하지 않음 */}
      {showText && (
        <span className={`ml-2 font-bold tracking-tight ${
          size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'
        }`} style={{ color }}>
          RSVPY
        </span>
      )}
    </div>
  );
  
  if (linkToHome) {
    return (
      <Link href="/" className="focus:outline-none">
        {LogoContent}
      </Link>
    );
  }
  
  return LogoContent;
};

export default Logo;
