
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto p-4 sm:p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            MediAssist
          </h1>
          <p className="text-sm sm:text-base text-teal-100">
            Easy Medical Report Analyzer
          </p>
        </div>
      </div>
    </header>
  );
};
