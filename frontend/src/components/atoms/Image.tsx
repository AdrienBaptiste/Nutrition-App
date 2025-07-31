import React from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  loading?: 'lazy' | 'eager';
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  style,
  width,
  height,
  loading = 'lazy',
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
    />
  );
};

export default Image;
