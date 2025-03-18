import React, { useState } from 'react';

interface ImageFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

/**
 * 이미지 로딩 실패 시 폴백 이미지를 표시하는 컴포넌트
 */
const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  className = '',
  width,
  height,
  style = {}
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
      console.warn(`Image load failed: ${src}, using fallback`);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      width={width}
      height={height}
      style={style}
    />
  );
};

export default ImageFallback;
