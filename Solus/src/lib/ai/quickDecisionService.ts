/**
 * Quick Decision AI Service
 * 
 * Provides AI-powered functionality for the Quick Decision feature.
 * Uses Gemini 2.0 Flash for fast, responsive decision-making assistance.
 */

import { generateText, generateObject } from 'ai';
import { geminiFlash } from './provider';
import { z } from 'zod';
import { DecisionCategory } from '@/db/types/BaseDecision';

/**
 * Extract options from user's verbal description
 * Takes natural language input and extracts structured decision options
 */
export async function extractDecisionOptions(userInput: string) {
  const optionsSchema = z.object({
    title: z.string().describe('A concise title for the decision'),
    category: z.nativeEnum(DecisionCategory).describe('The category that best fits this decision'),
    options: z.array(z.object({
      text: z.string().describe('The option text'),
      pros: z.array(z.string()).optional().describe('Positive aspects of this option'),
      cons: z.array(z.string()).optional().describe('Negative aspects of this option')
    })).min(1).describe('The different options the user is considering'),
    contextFactors: z.array(z.string()).optional().describe('Important contextual factors that might influence the decision')
  });

  try {
    const result = await generateObject({
      model: geminiFlash,
      schema: optionsSchema,
      prompt: `Extract decision information from this text: "${userInput}"
      Identify the main decision to be made, the options being considered, and any pros/cons mentioned.
      If the user doesn't explicitly mention a category, infer the most appropriate one.
      Include any contextual factors that might influence the decision.
      IMPORTANT: If something is ambiguous or not clearly stated, make a reasonable inference but don't invent specifics.`
    });

    return result;
  } catch (error) {
    console.error('Error extracting decision options:', error);
    throw new Error('Failed to extract decision options from your input. Please try again with more details.');
  }
}

/**
 * Generate recommendation for a quick decision
 * Analyzes options and provides a recommended choice with reasoning
 */
export async function generateRecommendation(
  title: string,
  options: Array<{
    text: string;
    pros?: string[];
    cons?: string[];
    selected?: boolean;
  }>,
  contextFactors?: string[],
  gutFeeling?: string
) {
  try {
    // Construct the prompt with all available information
    let prompt = `Help me decide: ${title}\n\nOptions:`;
    
    options.forEach((option, index) => {
      prompt += `\n${index + 1}. ${option.text}`;
      if (option.pros && option.pros.length > 0) {
        prompt += `\n   Pros: ${option.pros.join(', ')}`;
      }
      if (option.cons && option.cons.length > 0) {
        prompt += `\n   Cons: ${option.cons.join(', ')}`;
      }
    });
    
    if (contextFactors && contextFactors.length > 0) {
      prompt += `\n\nContextual factors: ${contextFactors.join(', ')}`;
    }
    
    if (gutFeeling) {
      prompt += `\n\nMy gut feeling: ${gutFeeling}`;
    }
    
    prompt += `\n\nPlease recommend the best option and explain your reasoning in a concise way. If there's a clear choice that aligns with my values or gut feeling, emphasize that.`;
    
    // Get recommendation text
    const { text } = await generateText({
      model: geminiFlash,
      prompt
    });
    
    // Extract just the recommended option from the response
    const recommendationSchema = z.object({
      recommendedOption: z.string().describe('The specific option text that is recommended'),
      reasoning: z.string().describe('A brief explanation of why this option is recommended')
    });
    
    const structured = await generateObject({
      model: geminiFlash,
      schema: recommendationSchema,
      prompt: `Based on this analysis, extract just the recommended option and reasoning:
      
      ${text}
      
      Be very concise. The recommendedOption should match one of the original options exactly.`
    });
    
    return {
      recommendation: structured.object.recommendedOption,
      reasoning: structured.object.reasoning,
      fullAnalysis: text
    };
  } catch (error) {
    console.error('Error generating recommendation:', error);
    throw new Error('Failed to generate a recommendation. Please try again.');
  }
}

/**
 * Process speech input for quick decision
 * Takes voice input and processes it for the quick decision flow
 */
export async function processSpeechInput(speechText: string) {
  try {
    // Extract structured decision data from speech
    const decisionData = await extractDecisionOptions(speechText);
    
    // Generate a recommendation based on the extracted options
    const recommendation = await generateRecommendation(
      decisionData.object.title,
      decisionData.object.options,
      decisionData.object.contextFactors
    );
    
    return {
      decisionData,
      recommendation
    };
  } catch (error) {
    console.error('Error processing speech input:', error);
    throw new Error('Failed to process your voice input. Please try again with more details.');
  }
} 