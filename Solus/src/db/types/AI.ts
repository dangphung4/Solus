/**
 * AI interfaces for the database
 * Contains types for AI models, prompts, and responses
 */

import { DecisionCategory } from './Decision';

/**
 * AI model configuration
 */
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  modelIdentifier: string; // e.g., "gpt-4", "gpt-3.5-turbo"
  version: string;
  contextWindow: number;
  parameters: {
    temperature: number;
    topP?: number;
    maxTokens?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  capabilities: AICapability[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * AI provider enum
 */
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  LLAMA = 'llama',
  CUSTOM = 'custom'
}

/**
 * AI capabilities
 */
export enum AICapability {
  QUICK_DECISION = 'quick_decision',
  DEEP_REFLECTION = 'deep_reflection',
  BIAS_DETECTION = 'bias_detection',
  VALUES_ALIGNMENT = 'values_alignment',
  FUTURE_SCENARIOS = 'future_scenarios',
  PERSONALIZATION = 'personalization',
  RECOMMENDATION = 'recommendation'
}

/**
 * AI prompts for different decision scenarios
 */
export interface AIPrompt {
  id: string;
  name: string;
  description: string;
  category?: DecisionCategory; // Optional - specific category this prompt is for
  decisionType: 'quick' | 'deep' | 'both';
  systemPrompt: string;
  userPromptTemplate: string; // Contains placeholders like {{decisionQuestion}}
  exampleResponses?: string[];
  variables: string[]; // List of variables that can be substituted in the prompt
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isActive: boolean;
}

/**
 * AI interaction history
 */
export interface AIInteraction {
  id: string;
  userId: string;
  decisionId?: string; // Optional - may not be tied to a specific decision
  modelId: string;
  promptId: string;
  inputTokens: number;
  outputTokens: number;
  userInput: string;
  aiResponse: string;
  metadata: Record<string, any>;
  feedback?: {
    helpfulnessRating?: number; // 1-5
    accuracyRating?: number; // 1-5
    comment?: string;
  };
  createdAt: Date;
}

/**
 * User pattern data for AI personalization
 */
export interface UserPattern {
  id: string;
  userId: string;
  patternType: PatternType;
  category?: DecisionCategory;
  data: Record<string, any>; // Flexible structure for different pattern types
  confidence: number; // 0-1 score indicating confidence in the pattern
  examples: string[]; // IDs of decisions exemplifying this pattern
  createdAt: Date;
  updatedAt: Date;
  lastApplied?: Date;
}

/**
 * Types of patterns the AI can detect
 */
export enum PatternType {
  PREFERENCE = 'preference', // Recurring preferences
  AVOIDANCE = 'avoidance', // Things consistently avoided
  TIMING = 'timing', // When decisions are made
  CONTEXT = 'context', // Contextual factors affecting decisions
  OUTCOME = 'outcome', // Patterns in decision outcomes
  VALUE = 'value' // Value-based patterns
} 