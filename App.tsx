
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisPage } from './components/AnalysisPage';
import { extractTextFromFile, analyzeText, translateAnalysis } from './services/geminiService';
import type { AnalysisReport, Language } from './types';

export default function App(): React.ReactNode {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [translatedAnalysis, setTranslatedAnalysis] = useState<AnalysisReport | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!process.env.API_KEY) {
      setError('API key is not configured. Please set the API_KEY environment variable.');
      setFile(selectedFile); // Set file to trigger view change even on API key error
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setTranslatedAnalysis(null);
    setCurrentLanguage('English');

    try {
      setLoadingMessage('Extracting text from your report...');
      const extractedText = await extractTextFromFile(selectedFile);
      if (!extractedText.trim()) {
        throw new Error('Could not extract any text from the file. Please try a clearer document.');
      }

      setLoadingMessage('Analyzing your report with AI...');
      const analysisResult = await analyzeText(extractedText);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleLanguageChange = useCallback(async (lang: Language) => {
    if (!analysis) return;

    setCurrentLanguage(lang);
    if (lang === 'English') {
      return;
    }

    if (translatedAnalysis && currentLanguage === lang) {
      return; // Already translated to this language, no need to call API again
    }

    setIsLoading(true);
    setLoadingMessage(`Translating the report to ${lang === 'Hindi' ? 'Hindi' : lang === 'Gujarati' ? 'Gujarati' : ''}...`);
    setError(null);

    try {
      const translatedResult = await translateAnalysis(analysis, lang);
      setTranslatedAnalysis(translatedResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during translation.');
      setCurrentLanguage('English'); // Revert to English on error
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [analysis, translatedAnalysis, currentLanguage]);
  
  const handleReset = useCallback(() => {
    setFile(null);
    setAnalysis(null);
    setTranslatedAnalysis(null);
    setCurrentLanguage('English');
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
  }, []);

  const isAnalysisView = file; // As soon as a file is selected, switch to the analysis view/page.

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        {isAnalysisView ? (
          <AnalysisPage
            analysis={analysis}
            translatedAnalysis={translatedAnalysis}
            currentLanguage={currentLanguage}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
            onLanguageChange={handleLanguageChange}
            onReset={handleReset}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm space-y-1">
        <p>MediAssist – making medical reports easy for everyone.</p>
        <p>
          Made by <a href="https://www.linkedin.com/in/dhruvdave2807/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium">Dhruv Dave</a>
        </p>
      </footer>
    </div>
  );
}
