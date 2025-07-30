import React from 'react';

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: TitleLevel; // h1 par défaut
  children: React.ReactNode;
  className?: string;
}

const LEVEL_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

const LEVEL_CLASSES: Record<TitleLevel, string> = {
  1: 'text-4xl md:text-5xl font-extrabold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg font-semibold',
  6: 'text-base font-semibold',
};

const Title: React.FC<TitleProps> = ({
  level = 1,
  children,
  className = '',
  ...props
}) => {
  const Tag = LEVEL_TAGS[level];
  const classes = LEVEL_CLASSES[level] + (className ? ' ' + className : '');
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Title;
