import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'simple' | 'underline';
type ButtonSize = 'sm' | 'md' | 'lg';

type CommonButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = CommonButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined;
    href?: undefined;
  };

type ButtonAsLink = CommonButtonProps &
  Omit<LinkProps, 'to'> & {
    to: string;
    href?: undefined;
  };

type ButtonAsAnchor = CommonButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    to?: undefined;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#67BB69] hover:bg-transparent text-white hover:text-[#3C2937] border-[#67BB69] focus:ring-[#67BB69]',
  secondary:
    'bg-[#3C2937] hover:bg-transparent text-white hover:text-[#3C2937] border-[#3C2937] border-2',
  simple:
    'bg-[transparent] text-white hover:text-[#67BB69] font-normal hover:underline border-none active:underline transition-all duration-50',
  underline:
    'bg-transparent text-[#67BB69] hover:text-[#3C2937] border-[#67BB69] focus:ring-[#67BB69]',
};

// Styles globaux pour la classe active (uniquement pour Button simple)
const ACTIVE_CLASS = 'text-[#67BB69] underline';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
};

const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled,
    ...rest
  } = props as CommonButtonProps & {
    to?: string;
    href?: string;
  };

  // Type-safe access to variant/size
  const variantClasses =
    VARIANT_CLASSES[(variant in VARIANT_CLASSES ? variant : 'primary') as ButtonVariant];
  const sizeClasses = SIZE_CLASSES[(size in SIZE_CLASSES ? size : 'md') as ButtonSize];
  const baseClasses =
    'font-semibold rounded-full border focus:outline-none disabled:opacity-50 transition-colors duration-300';
  // Ajout du style actif uniquement pour le variant simple
  const isSimple = variant === 'simple';
  const isActive = className?.split(' ').includes('active');
  const combinedClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${isSimple && isActive ? ACTIVE_CLASS : ''} ${className}`.trim();

  // Polymorphic rendering
  if ('to' in props && props.to) {
    // React Router Link
    return (
      <Link
        to={props.to}
        className={combinedClasses}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  if ('href' in props && props.href) {
    // Anchor tag
    return (
      <a
        href={props.href}
        className={combinedClasses}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  // Native button
  return (
    <button className={combinedClasses} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
