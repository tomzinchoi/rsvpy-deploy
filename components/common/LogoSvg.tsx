import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoSvgProps {
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  className?: string;
  color?: string;
}

const LogoSvg: React.FC<LogoSvgProps> = ({
  size = 'md',
  linkToHome = true,
  className = '',
  color = '#ffffff' // White by default for dark background
}) => {
  // Size mapping for SVG viewBox
  const sizeDimensions = {
    sm: { width: 100, height: 30 },
    md: { width: 140, height: 42 },
    lg: { width: 180, height: 54 }
  };
  
  const { width, height } = sizeDimensions[size];
  
  // Logo component with SVG
  const LogoComponent = (
    <div className={`logo-container ${className}`}>
      <motion.svg 
        width={width} 
        height={height} 
        viewBox="0 0 200 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* R */}
        <path d="M10 10H30C35.5 10 40 14.5 40 20C40 25.5 35.5 30 30 30H20V50H10V10Z" fill={color} />
        <path d="M30 30L40 50H30L20 30" fill={color} />
        
        {/* S */}
        <path d="M50 15C50 12.2386 52.2386 10 55 10H70C72.7614 10 75 12.2386 75 15V20C75 22.7614 72.7614 25 70 25H55C52.2386 25 50 27.2386 50 30V45C50 47.7614 52.2386 50 55 50H70C72.7614 50 75 47.7614 75 45V40H65V45H60V30H75V15H65V20H60V15H50Z" fill={color} />
        
        {/* V */}
        <path d="M80 10H90L100 40L110 10H120L105 50H95L80 10Z" fill={color} />
        
        {/* P */}
        <path d="M130 10H150C155.5 10 160 14.5 160 20V25C160 30.5 155.5 35 150 35H140V50H130V10ZM140 25H150V20H140V25Z" fill={color} />
        
        {/* Y */}
        <path d="M170 10H180L190 25L200 10H210L195 33V50H185V33L170 10Z" fill={color} />
      </motion.svg>
    </div>
  );
  
  // Conditionally wrap with link
  if (linkToHome) {
    return (
      <Link href="/" className="focus:outline-none">
        {LogoComponent}
      </Link>
    );
  }
  
  return LogoComponent;
};

export default LogoSvg;
