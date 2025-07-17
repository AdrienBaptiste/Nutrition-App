import React from 'react';

export interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="text-red-600 text-sm font-medium mb-2" role="alert">
      {message}
    </div>
  );
};

export default ErrorMessage;
