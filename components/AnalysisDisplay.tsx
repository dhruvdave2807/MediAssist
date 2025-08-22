import React, { useCallback, useRef } from 'react';
import type { AnalysisReport, Language } from '../types';
import { PdfIcon } from './icons/PdfIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { HeartbeatIcon } from './icons/HeartbeatIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

// This is a global declaration for html2pdf.js since we are loading it from a script tag.
declare const html2pdf: any;

interface AnalysisDisplayProps {
  analysis: AnalysisReport;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isTranslationAvailable: boolean;
}

interface AnalysisCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0 bg-teal-100 rounded-full p-3 text-teal-600">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600 text-lg leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  </div>
);

const PdfContent: React.FC<{ analysis: AnalysisReport, language: Language }> = ({ analysis, language }) => {
    const containerStyle: React.CSSProperties = {
        padding: '40px',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: language === 'Hindi' ? '"Noto Sans Devanagari", Arial, sans-serif' : 'Arial, sans-serif',
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box'
    };
    
    const sectionStyle: React.CSSProperties = {
        marginBottom: '24px',
        borderBottom: '1px solid #eee',
        paddingBottom: '16px',
    };
    const h2Style: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1a202c',
        marginBottom: '8px',
    };
    const pStyle: React.CSSProperties = {
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#4a5568',
    };
    const listStyle: React.CSSProperties = {
        paddingLeft: '0',
        listStyle: 'none',
    };
    const liStyle: React.CSSProperties = {
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#4a5568',
        marginBottom: '4px',
    };

    return (
        <div style={containerStyle}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', color: '#2c7a7b', fontWeight: 'bold' }}>MediAssist - AI Medical Report Analysis</h1>
                <p style={{ fontSize: '12px', color: '#a0aec0', fontStyle: 'italic', marginTop: '10px' }}>
                    Disclaimer: This is an AI-generated summary for informational purposes only. Please consult a qualified doctor for any medical advice.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}>Simple Summary</h2>
                <p style={pStyle}>{analysis.simpleSummary}</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}>Key Findings</h2>
                <ul style={listStyle}>
                    {analysis.keyFindings.map((item, i) => <li key={i} style={liStyle}>• {item}</li>)}
                </ul>
            </div>
            
            <div style={sectionStyle}>
                <h2 style={h2Style}>Possible Causes & Risk Factors</h2>
                 <ul style={listStyle}>
                    {analysis.possibleCauses.map((item, i) => <li key={i} style={liStyle}>• {item}</li>)}
                </ul>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}>Cure & Care Suggestions</h2>
                 <ul style={listStyle}>
                    {analysis.cureAndCare.map((item, i) => <li key={i} style={liStyle}>• {item}</li>)}
                </ul>
            </div>

            <div style={{ ...sectionStyle, borderBottom: 'none' }}>
                <h2 style={h2Style}>Recommended Action Steps</h2>
                 <ol style={{...listStyle, listStyleType: 'decimal', paddingLeft: '20px'}}>
                    {analysis.actionSteps.map((item, i) => <li key={i} style={{...liStyle, fontWeight: 'bold'}}>{item}</li>)}
                </ol>
            </div>
        </div>
    );
};


export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, currentLanguage, onLanguageChange, isTranslationAvailable }) => {
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(() => {
    const element = pdfContentRef.current;
    if (!element) return;
    
    const opt = {
      margin:       0,
      filename:     'MediAssist_Report_Analysis.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  }, []);

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <span className="font-semibold text-lg">Report Language:</span>
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
             <button
              onClick={() => onLanguageChange('English')}
              className={`px-4 py-2 text-lg font-bold rounded-md transition-colors ${currentLanguage === 'English' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('Hindi')}
              className={`px-4 py-2 text-lg font-bold rounded-md transition-colors ${currentLanguage === 'Hindi' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
            >
              हिन्दी {isTranslationAvailable && '✓'}
            </button>
          </div>
        </div>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-teal-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <PdfIcon className="w-6 h-6" />
          <span>Download PDF</span>
        </button>
      </div>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg text-center">
        <p className="font-bold text-lg">Disclaimer: This is an AI-generated summary for informational purposes only. Please consult a qualified doctor for any medical advice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnalysisCard title="Simple Summary" icon={<ClipboardIcon className="w-8 h-8"/>}>
            <p>{analysis.simpleSummary}</p>
        </AnalysisCard>
        <AnalysisCard title="Key Findings" icon={<HeartbeatIcon className="w-8 h-8"/>}>
            <ul className="list-disc list-inside space-y-2">
                {analysis.keyFindings.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </AnalysisCard>
        <AnalysisCard title="Possible Causes & Risk Factors" icon={<LightbulbIcon className="w-8 h-8"/>}>
            <ul className="list-disc list-inside space-y-2">
                {analysis.possibleCauses.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </AnalysisCard>
         <AnalysisCard title="Cure & Care Suggestions" icon={<CheckIcon className="w-8 h-8"/>}>
            <ul className="list-disc list-inside space-y-2">
                {analysis.cureAndCare.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </AnalysisCard>
      </div>
       <div className="col-span-1 md:col-span-2">
            <AnalysisCard title="Recommended Action Steps" icon={<CheckIcon className="w-8 h-8"/>}>
                <ul className="list-decimal list-inside space-y-3 font-semibold">
                    {analysis.actionSteps.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </AnalysisCard>
        </div>

        {/* Hidden element for PDF generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
            <div ref={pdfContentRef}>
                <PdfContent analysis={analysis} language={currentLanguage} />
            </div>
        </div>
    </div>
  );
};