import React from 'react';
import Card from '../atoms/Card';
import Title from '../atoms/Title';

interface DashboardSectionCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonColor?: 'blue' | 'green' | 'purple' | 'red';
  onButtonClick?: () => void;
}

const DashboardSectionCard: React.FC<DashboardSectionCardProps> = ({
  title,
  description,
  buttonText,
  buttonColor = 'blue',
  onButtonClick
}) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    red: 'bg-red-600 hover:bg-red-700'
  };

  return (
    <Card>
      <Title level={3} className="mb-2 text-gray-800">{title}</Title>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onButtonClick}
        className={`${colorClasses[buttonColor]} text-white px-4 py-2 rounded transition`}
      >
        {buttonText}
      </button>
    </Card>
  );
};

export default DashboardSectionCard;
