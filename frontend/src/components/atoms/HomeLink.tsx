import React from 'react';
import { Link } from 'react-router-dom';

export interface HomeLinkProps {
  logoSrc?: string;
  alt?: string;
  className?: string;
}

const HomeLink: React.FC<HomeLinkProps> = ({
  logoSrc = '/src/assets/Logo-white.webp',
  alt = 'Nutrition App',
  className = '',
}) => {
  return (
    <Link
      to="/"
      className={`flex items-center hover:opacity-80 transition-opacity duration-200 ${className}`.trim()}
      style={{ padding: '2rem 0 2rem 0' }} // Test avec style inline
    >
      <img
        src={logoSrc}
        alt={alt}
        className="w-auto"
        style={{ height: '3rem' }} // Test avec style inline
      />
    </Link>
  );
};

export default HomeLink;
