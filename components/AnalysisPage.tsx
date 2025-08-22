
import React from 'react';
import { AnalysisDisplay } from './AnalysisDisplay';
import { Loader } from './Loader';
import type { AnalysisReport, Language } from '../types';

interface AnalysisPageProps {
  analysis: AnalysisReport | null;
  translatedAnalysis: AnalysisReport | null;
  currentLanguage: Language;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  analysis,
  translatedAnalysis,
  currentLanguage,
  isLoading,
  loadingMessage,
  error,
  onLanguageChange,
  onReset,
}) => {
  const displayedAnalysis = currentLanguage === 'Hindi' && translatedAnalysis ? translatedAnalysis : analysis;

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-6">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
          &larr; Analyze Another Report
        </button>
      </div>

      {error && !isLoading && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && <Loader message={loadingMessage} />}

      {displayedAnalysis && !isLoading && (
        <AnalysisDisplay
          analysis={displayedAnalysis}
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          isTranslationAvailable={!!translatedAnalysis}
        />
      )}
    </div>
  );
};
