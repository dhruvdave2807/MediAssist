
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisReport, Language } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'text/plain') {
    return file.text();
  }

  if (file.type.startsWith('image/') || file.type === 'application/pdf') {
    const imagePart = await fileToGenerativePart(file);
    const textPart = { text: "Extract all text from this medical report document. Be as accurate as possible." };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
    });

    return response.text;
  }
  
  throw new Error('Unsupported file type. Please upload a PDF, image, or text file.');
}

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    simpleSummary: {
      type: Type.STRING,
      description: "A simple, one-paragraph summary of the report for a non-medical person."
    },
    keyFindings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A bulleted list of the most important medical findings, problems, or diseases detected."
    },
    possibleCauses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A bulleted list of possible causes or risk factors related to the key findings."
    },
    cureAndCare: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A bulleted list of general cure and care suggestions in simple, non-medical language."
    },
    actionSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A bulleted list of recommended next steps for the patient."
    },
  },
  required: ["simpleSummary", "keyFindings", "possibleCauses", "cureAndCare", "actionSteps"],
};

export async function analyzeText(text: string): Promise<AnalysisReport> {
  const prompt = `Analyze the following medical report text and provide a structured analysis. The target audience is a patient with little to no medical knowledge, so use simple and clear language.

Medical Report Text:
---
${text}
---

Provide the analysis in the specified JSON format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    }
  });

  const jsonString = response.text.trim();
  try {
    return JSON.parse(jsonString) as AnalysisReport;
  } catch (e) {
    console.error("Failed to parse Gemini response:", jsonString);
    throw new Error("The AI returned an invalid analysis format. Please try again.");
  }
}

export async function translateAnalysis(analysis: AnalysisReport, targetLanguage: Language): Promise<AnalysisReport> {
  const prompt = `Translate all the string values in the following JSON object to ${targetLanguage}. Keep the JSON structure and keys exactly the same.

JSON to translate:
---
${JSON.stringify(analysis, null, 2)}
---

Return ONLY the translated JSON object.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    }
  });
  
  const jsonString = response.text.trim();
  try {
    return JSON.parse(jsonString) as AnalysisReport;
  } catch (e) {
    console.error("Failed to parse translated Gemini response:", jsonString);
    throw new Error("The AI returned an invalid translation format. Please try again.");
  }
}
