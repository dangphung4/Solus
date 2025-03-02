/**
 * Decision interfaces for the database
 * Includes both Quick Decision and Deep Reflection types
 */

import { User } from './User';

/**
 * Base decision interface with common properties
 */
export interface BaseDecision {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: DecisionCategory;
  createdAt: Date;
  updatedAt: Date;
  status: DecisionStatus;
  aiGenerated: boolean;
  tags?: string[];
}

/**
 * Quick Decision type for everyday choices
 */
export interface QuickDecision extends BaseDecision {
  type: 'quick';
  options: Array<{
    id: string;
    text: string;
    selected: boolean;
    pros?: string[];
    cons?: string[];
  }>;
  contextFactors?: string[];
  gutFeeling?: string;
  recommendation?: string;
  recommendationReasoning?: string;
  userFeedback?: {
    satisfactionRating?: number; // 1-5
    followedRecommendation: boolean;
    comment?: string;
  };
  timeSpent?: number; // in seconds
}

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

/**
 * Union type for all decision types
 */
export type Decision = QuickDecision | DeepDecision;

/**
 * Decision categories
 */
export enum DecisionCategory {
  FOOD = 'food',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  CAREER = 'career',
  EDUCATION = 'education',
  RELATIONSHIP = 'relationship',
  HEALTH = 'health',
  FINANCE = 'finance',
  TRAVEL = 'travel',
  LIFESTYLE = 'lifestyle',
  TECHNOLOGY = 'technology',
  OTHER = 'other',
}

/**
 * Decision status
 */
export enum DecisionStatus {
  DRAFT = 'draft',           // Started but not completed
  IN_PROGRESS = 'in_progress', // Actively working on it
  COMPLETED = 'completed',   // Decision made
  IMPLEMENTED = 'implemented', // Decision acted upon
  ARCHIVED = 'archived',     // No longer active
} 