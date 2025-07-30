import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'success' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 focus:ring-blue-400',
  outline: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 focus:ring-gray-400',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-600 focus:ring-green-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-400',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // fallback si variant/size inconnu
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const baseClasses = 'font-semibold rounded border focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors duration-200';
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
