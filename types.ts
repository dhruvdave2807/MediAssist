
export interface AnalysisReport {
  simpleSummary: string;
  keyFindings: string[];
  possibleCauses: string[];
  cureAndCare: string[];
  actionSteps: string[];
}

export type Language = 'English' | 'Hindi' | 'Gujarati';
