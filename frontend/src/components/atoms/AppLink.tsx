import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

type AppLinkVariant = 'primary' | 'outline' | 'success' | 'danger';
type AppLinkSize = 'sm' | 'md' | 'lg';

interface AppLinkProps extends LinkProps {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: AppLinkVariant;
  size?: AppLinkSize;
}

const VARIANT_CLASSES: Record<AppLinkVariant, string> = {
  primary: 'bg-[#67BB69] hover:bg-transparent text-white border-[#67BB69] border-2 focus:scale-98',
  outline:
    'bg-transparent hover:bg-gray-800 text-gray-800 hover:text-white border-gray-800 focus:ring-gray-800',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-600 focus:ring-green-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-400',
};

const SIZE_CLASSES: Record<AppLinkSize, string> = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
};

const AppLink: React.FC<AppLinkProps> = ({
  active = false,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  ...rest
}) => {
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const baseClasses =
    'font-medium rounded border focus:outline-none focus:scale-98 disabled:opacity-50 transition-scale duration-100';
  const activeClass = active ? 'bg-transparent text-white border-[#67BB69]' : '';
  const combinedClasses = [baseClasses, variantClasses, sizeClasses, activeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Link {...rest} className={combinedClasses}>
      {children}
    </Link>
  );
};

export default AppLink;
