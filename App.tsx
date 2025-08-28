import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisPage } from './components/AnalysisPage';
import { extractTextFromFile, analyzeText, translateAnalysis } from './services/geminiService';
import type { AnalysisReport, Language } from './types';
import { FaCheckCircle } from 'react-icons/fa';

// Helper to extract main keywords (topics) from text
function extractKeywords(text: string): string[] {
  const stopwords = ['the', 'is', 'and', 'of', 'to', 'in', 'a', 'with', 'for', 'on', 'by', 'an', 'as', 'at', 'from'];
  const words = text
    .split(/\s+/)
    .map(w => w.replace(/[^\w]/g, '').toLowerCase())
    .filter(w => w && !stopwords.includes(w));
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

export default function App(): React.ReactNode {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [translatedAnalysis, setTranslatedAnalysis] = useState<AnalysisReport | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  // For real-time keyword display
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordsAnalyzed, setKeywordsAnalyzed] = useState<number>(0);
  const [showKeywords, setShowKeywords] = useState<boolean>(false);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!process.env.API_KEY) {
      setError('API key is not configured. Please set the API_KEY environment variable.');
      setFile(selectedFile);
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setTranslatedAnalysis(null);
    setCurrentLanguage('English');
    setKeywords([]);
    setKeywordsAnalyzed(0);
    setShowKeywords(false);

    try {
      setLoadingMessage('Extracting text from your report...');
      const extractedText = await extractTextFromFile(selectedFile);
      if (!extractedText.trim()) {
        throw new Error('Could not extract any text from the file. Please try a clearer document.');
      }

      // Extract keywords but don't show yet
      const mainKeywords = extractKeywords(extractedText);
      setKeywords(mainKeywords);
      setKeywordsAnalyzed(0);

      setLoadingMessage('Analyzing your report with AI...');
      setShowKeywords(true); // Show keywords only when analyzing

      // Simulate real-time analysis by ticking keywords one by one
      for (let i = 1; i <= mainKeywords.length; i++) {
        await new Promise(res => setTimeout(res, 600)); // 600ms delay for effect
        setKeywordsAnalyzed(i);
      }

      const analysisResult = await analyzeText(extractedText);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
      setShowKeywords(false); // Hide after analysis
    }
  }, []);

  const handleLanguageChange = useCallback(async (lang: Language) => {
    if (!analysis) return;

    setCurrentLanguage(lang);
    if (lang === 'English') {
      return;
    }

<<<<<<< Updated upstream
    if (translatedAnalysis && currentLanguage === lang) {
      return; // Already translated to this language, no need to call API again
=======
    if (translatedAnalysis) {
      return;
>>>>>>> Stashed changes
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
      setCurrentLanguage('English');
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
    setKeywords([]);
    setKeywordsAnalyzed(0);
    setShowKeywords(false);
  }, []);

  const isAnalysisView = file;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        {isAnalysisView ? (
          <>
            {/* Show keywords as a row with tick marks only during "Analyzing your report with AI..." */}
            {showKeywords && loadingMessage === 'Analyzing your report with AI...' && keywords.length > 0 && (
              <div className="mb-4 flex flex-row gap-4 justify-center">
                {keywords.map((kw, idx) => (
                  <span key={idx} className="flex items-center bg-gray-200 px-4 py-2 rounded-full text-base font-medium">
                    {kw}
                    {idx < keywordsAnalyzed && (
                      <FaCheckCircle className="ml-2 text-green-500" title="Analyzed" />
                    )}
                  </span>
                ))}
              </div>
            )}
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
          </>
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