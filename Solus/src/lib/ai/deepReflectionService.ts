/**
 * Deep Reflection AI Service
 *
 * Provides AI-powered functionality for the Deep Reflection feature.
 * Uses Gemini for intelligent extraction and analysis of complex decisions.
 */

import { generateText, generateObject } from 'ai';
import { geminiFlash, geminiPro } from './provider';
import { z } from 'zod';
import { DecisionCategory } from '@/db/types/BaseDecision';

/**
 * Schema for extracted deep reflection data
 */
const deepReflectionSchema = z.object({
  title: z.string().describe('A clear, concise title for the decision'),
  category: z.nativeEnum(DecisionCategory).describe('The category that best fits this decision'),
  description: z.string().describe('A brief description of the decision context'),
  timeframe: z.string().optional().describe('When this decision needs to be made'),
  importance: z.string().describe('Why this decision is important and what impact it will have'),
  options: z.array(z.object({
    text: z.string().describe('A clear description of this option'),
    pros: z.array(z.string()).min(1).describe('Advantages of this option'),
    cons: z.array(z.string()).min(1).describe('Disadvantages of this option'),
    valuesAlignment: z.number().min(0).max(100).describe('How well this aligns with stated values (0-100)')
  })).min(2).describe('The different options being considered'),
  personalValues: z.array(z.string()).min(1).describe('Core personal values relevant to this decision'),
  emotionalContext: z.string().optional().describe('Emotional state and feelings about this decision'),
  stakeholders: z.array(z.string()).optional().describe('People affected by this decision'),
  potentialBiases: z.array(z.string()).optional().describe('Cognitive biases that might be affecting the decision')
});

export type ExtractedDeepReflection = z.infer<typeof deepReflectionSchema>;

/**
 * Extract structured deep reflection data from natural language input
 */
export async function extractDeepReflectionData(userInput: string): Promise<ExtractedDeepReflection> {
  try {
    const result = await generateObject({
      model: geminiFlash,
      schema: deepReflectionSchema,
      prompt: `You are helping someone think through an important life decision. Extract structured decision information from their description.

User's input: "${userInput}"

IMPORTANT INSTRUCTIONS:
1. Extract or infer the main decision being considered
2. Identify 2-4 distinct options (if only one is mentioned, suggest logical alternatives)
3. For each option, provide at least 2 pros and 2 cons
4. Identify personal values mentioned or implied (e.g., family, career growth, security, freedom, health)
5. Estimate values alignment for each option based on the context
6. Identify any stakeholders (people affected)
7. Note any cognitive biases that might be influencing the decision (e.g., sunk cost fallacy, status quo bias)
8. Capture the emotional context if mentioned

Be thorough but realistic. Don't invent specific details that weren't mentioned, but do make reasonable inferences based on the context.`
    });

    return result.object;
  } catch (error) {
    console.error('Error extracting deep reflection data:', error);
    throw new Error('Failed to analyze your input. Please try providing more details about your decision.');
  }
}

/**
 * Generate a comprehensive AI analysis and recommendation for a deep decision
 */
export async function generateDeepAnalysis(
  title: string,
  options: Array<{
    text: string;
    pros: string[];
    cons: string[];
    valuesAlignment: number;
  }>,
  personalValues: string[],
  emotionalContext?: string,
  stakeholders?: string[],
  potentialBiases?: string[]
): Promise<{
  recommendation: string;
  reasoning: string;
  keyInsights: string[];
  cautionaryNotes: string[];
  nextSteps: string[];
}> {
  try {
    const optionsText = options.map((opt, idx) => {
      const prosText = opt.pros.join(', ');
      const consText = opt.cons.join(', ');
      return `Option ${idx + 1}: ${opt.text}
  Pros: ${prosText}
  Cons: ${consText}
  Values Alignment: ${opt.valuesAlignment}%`;
    }).join('\n\n');

    const prompt = `You are a thoughtful decision coach helping someone with an important life decision.

DECISION: ${title}

OPTIONS:
${optionsText}

PERSONAL VALUES: ${personalValues.join(', ')}

${emotionalContext ? `EMOTIONAL CONTEXT: ${emotionalContext}` : ''}

${stakeholders && stakeholders.length > 0 ? `STAKEHOLDERS AFFECTED: ${stakeholders.join(', ')}` : ''}

${potentialBiases && potentialBiases.length > 0 ? `POTENTIAL BIASES TO CONSIDER: ${potentialBiases.join(', ')}` : ''}

Please provide a comprehensive analysis with:

1. RECOMMENDATION: Which option do you recommend and why? (Be clear and direct)

2. REASONING: A detailed explanation (2-3 paragraphs) of why this option best aligns with their values and circumstances. Consider the pros/cons, values alignment, and stakeholder impact.

3. KEY_INSIGHTS: 3-4 important insights they should consider (bullet points)

4. CAUTIONARY_NOTES: 2-3 things to watch out for or potential pitfalls (bullet points)

5. NEXT_STEPS: 3-4 concrete actions they can take to move forward with this decision (bullet points)

Format your response exactly as:
RECOMMENDATION: [option name]
REASONING: [detailed analysis]
KEY_INSIGHTS:
- [insight 1]
- [insight 2]
- [insight 3]
CAUTIONARY_NOTES:
- [note 1]
- [note 2]
NEXT_STEPS:
- [step 1]
- [step 2]
- [step 3]`;

    const { text } = await generateText({
      model: geminiPro,
      prompt
    });

    // Parse the response
    const recommendationMatch = text.match(/RECOMMENDATION:\s*(.+?)(?=\nREASONING:|$)/is);
    const reasoningMatch = text.match(/REASONING:\s*(.+?)(?=\nKEY_INSIGHTS:|$)/is);
    const insightsMatch = text.match(/KEY_INSIGHTS:\s*([\s\S]+?)(?=\nCAUTIONARY_NOTES:|$)/i);
    const cautionMatch = text.match(/CAUTIONARY_NOTES:\s*([\s\S]+?)(?=\nNEXT_STEPS:|$)/i);
    const stepsMatch = text.match(/NEXT_STEPS:\s*([\s\S]+?)$/i);

    const parseList = (text: string | undefined): string[] => {
      if (!text) return [];
      return text
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);
    };

    return {
      recommendation: recommendationMatch?.[1]?.trim() || options[0].text,
      reasoning: reasoningMatch?.[1]?.trim() || 'Based on the analysis of your options, values, and circumstances.',
      keyInsights: parseList(insightsMatch?.[1]),
      cautionaryNotes: parseList(cautionMatch?.[1]),
      nextSteps: parseList(stepsMatch?.[1])
    };
  } catch (error) {
    console.error('Error generating deep analysis:', error);

    // Fallback response
    const bestOption = options.reduce((best, current) =>
      current.valuesAlignment > best.valuesAlignment ? current : best
    , options[0]);

    return {
      recommendation: bestOption.text,
      reasoning: 'Based on the values alignment scores and the balance of pros and cons, this option appears to best align with your stated priorities. Consider reviewing the specific trade-offs for each option before making your final decision.',
      keyInsights: [
        'Your personal values should be the primary guide for this decision',
        'Consider both short-term convenience and long-term impact',
        'Stakeholder perspectives can provide valuable insights'
      ],
      cautionaryNotes: [
        'Be aware of how your current emotional state might be influencing your judgment',
        'Consider what you might regret not trying'
      ],
      nextSteps: [
        'Sleep on this decision before finalizing',
        'Discuss with a trusted friend or mentor',
        'Write down how you would feel one year from now with each choice'
      ]
    };
  }
}

/**
 * Process voice/text input for deep reflection and return complete analyzed data
 */
export async function processDeepReflectionInput(userInput: string) {
  try {
    // Extract structured data
    const extractedData = await extractDeepReflectionData(userInput);

    // Generate comprehensive analysis
    const analysis = await generateDeepAnalysis(
      extractedData.title,
      extractedData.options,
      extractedData.personalValues,
      extractedData.emotionalContext,
      extractedData.stakeholders,
      extractedData.potentialBiases
    );

    return {
      extractedData,
      analysis
    };
  } catch (error) {
    console.error('Error processing deep reflection input:', error);
    throw new Error('Failed to process your input. Please try again with more details about your decision.');
  }
}

/**
 * Generate follow-up questions to help the user think deeper
 */
export async function generateFollowUpQuestions(
  title: string,
  options: Array<{ text: string }>,
  currentContext: string
): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: geminiFlash,
      prompt: `You are helping someone think through an important decision.

Decision: ${title}
Options: ${options.map(o => o.text).join(', ')}
Current context: ${currentContext}

Generate 3-4 thoughtful follow-up questions that would help them think more deeply about this decision. Questions should:
- Help uncover hidden assumptions
- Explore values and priorities
- Consider long-term consequences
- Address potential blind spots

Format as a numbered list.`
    });

    return text
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0 && line.endsWith('?'))
      .slice(0, 4);
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return [
      'What would you advise a close friend in this situation?',
      'How will you feel about this decision in 5 years?',
      'What are you most afraid of with each option?',
      'Who else might be affected by this decision?'
    ];
  }
}
