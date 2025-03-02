/**
 * Deep Decision interface for complex choices
 */

import { BaseDecision } from './BaseDecision';

/**
 * Deep Reflection type for complex decisions
 */
export interface DeepDecision extends BaseDecision {
  type: 'deep';
  options: Array<{
    id: string;
    text: string;
    selected: boolean;
    pros: Array<{
      text: string;
      weight: number; // 1-10
    }>;
    cons: Array<{
      text: string;
      weight: number; // 1-10
    }>;
  }>;
  valuesAlignment: Array<{
    value: string;
    alignmentScore: number; // 1-10
  }>;
  futureScenarios: Array<{
    description: string;
    likelihood: number; // 0-1
    impact: number; // 1-10
  }>;
  identifiedBiases?: string[];
  reflectionResponses?: Array<{
    question: string;
    answer: string;
  }>;
  recommendation?: string;
  recommendationReasoning?: string;
  userFeedback?: {
    satisfactionRating?: number; // 1-5
    insightfulness?: number; // 1-5
    followedRecommendation: boolean;
    comment?: string;
  };
  timeSpent?: number; // in seconds
} 