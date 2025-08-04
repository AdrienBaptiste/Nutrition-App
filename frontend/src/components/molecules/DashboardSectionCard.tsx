import React from 'react';
import Card from '../atoms/Card';
import Title from '../atoms/Title';
import Button from '../atoms/Button';

interface DashboardSectionCardProps {
  title: string;
  description: string;
  buttonText: string;
  to?: string; // Nouvelle prop pour navigation interne
  variant?: 'primary' | 'secondary' | 'simple' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  onButtonClick?: () => void; // Optionnel pour action JS
  // buttonColor est déprécié
}

const DashboardSectionCard: React.FC<DashboardSectionCardProps> = ({
  title,
  description,
  buttonText,
  to,
  variant = 'primary',
  size = 'md',
  onButtonClick,
}) => {
  return (
    <Card>
      <Title level={3} className="mb-2 text-gray-800">
        {title}
      </Title>
      <p className="text-gray-600 mb-4">{description}</p>
      {to ? (
        <Button to={to} variant={variant} size={size} className="w-full block text-center mt-2">
          {buttonText}
        </Button>
      ) : (
        <Button onClick={onButtonClick} variant={variant} size={size} className="w-full mt-2">
          {buttonText}
        </Button>
      )}
    </Card>
  );
};

export default DashboardSectionCard;
