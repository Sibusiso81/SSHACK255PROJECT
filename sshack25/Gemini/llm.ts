// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';
import { dashbordTips } from './prompts';
import { TipsProps } from '@/lib/utils';

export async function main({key,prompt,contents}:TipsProps) {
console.log(`Starting Gemini LLM for Dashboard Tips Generation... apikey:${process.env.GEMINI_API_KEY }`);
  const ai = new GoogleGenAI({
    apiKey: key,
  });
  console.log('prompt:',prompt);
  const config = {
    responseMimeType: 'text/plain',
    systemInstruction:prompt,
  };
  const model = 'gemini-2.5-flash-preview-04-17';
  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let responseText = "";
  for await (const chunk of response) {
    if (chunk.text) {
      const cleaned = chunk.text
        .replace(/`/g, "") // Remove backticks
        .replace(/json/g, "") // Remove the word "json"
       
      responseText += cleaned;
      
    } else {
      console.log("No text found in chunk, skipping...");
    }
  }
  return responseText;
}

