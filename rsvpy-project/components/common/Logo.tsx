import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  linkToHome?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  withText = true,
  linkToHome = true
}) => {
  // 로고 크기에 따른 클래스
  const sizeClass = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };
  
  // 폰트 크기
  const fontSizeClass = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const logoContent = (
    <div className="flex items-center">
      <div className={`relative ${sizeClass[size]}`}>
        <motion.div
          className="text-primary font-bold flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className={`${fontSizeClass[size]} font-extrabold tracking-tighter bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text`}>
            RSVPY
          </span>
        </motion.div>
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
