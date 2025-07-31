import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../atoms/Image';
import logoImage from '../../assets/Logo-black.webp';

export interface HomeLinkProps {
  logoSrc?: string;
  alt?: string;
  className?: string;
}

const HomeLink: React.FC<HomeLinkProps> = ({
  logoSrc = logoImage,
  alt = 'Nutrition App',
  className = '',
}) => {
  return (
    <Link
      to="/"
      className={`flex items-center hover:opacity-80 transition-opacity duration-200 ${className}`.trim()}
      style={{ padding: '2rem 0 2rem 0' }}
    >
      <Image
        src={logoSrc}
        alt={alt}
        className="w-auto"
        style={{ height: '3rem' }}
      />
    </Link>
  );
};

export default HomeLink;
