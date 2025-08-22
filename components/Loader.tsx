
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="w-16 h-16 border-4 border-teal-500 border-dashed rounded-full animate-spin"></div>
      <p className="text-xl font-semibold text-gray-700">{message}</p>
    </div>
  );
};
