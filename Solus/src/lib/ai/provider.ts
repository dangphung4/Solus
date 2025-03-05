/**
 * Google Generative AI Provider Configuration
 * 
 * This file sets up the Google AI provider instance that will be used
 * throughout the application for all AI-powered features.
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Create Google provider with environment variable API key
export const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY,
});

// Create models for different purposes
export const geminiPro = google('gemini-1.5-pro-latest');
export const geminiFlash = google('gemini-2.0-flash');

// For embedding/vector operations if needed
export const embeddingModel = google.textEmbeddingModel('text-embedding-004');

// Model with search grounding for up-to-date information
export const geminiProWithSearch = google('gemini-1.5-pro-latest', {
  useSearchGrounding: true,
}); 