import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

interface AppLinkProps extends LinkProps {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

const AppLink: React.FC<AppLinkProps> = ({ active = false, className = '', children, ...rest }) => {
  const base =
    'px-3 py-2 rounded transition font-medium decoration-white hover:bg-gray-700 hover:text-gray-400';
  const activeClass = 'bg-gray-900';

  return (
    <Link
      {...rest}
      className={[base, active ? activeClass : '', className].filter(Boolean).join(' ')}
    >
      {children}
    </Link>
  );
};

export default AppLink;
