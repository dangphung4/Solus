/**
 * Reflection interfaces for tracking user reflections on past decisions
 */

import { DecisionCategory } from './BaseDecision';

/**
 * Reflection status represents the user's satisfaction with the decision outcome
 */
export enum ReflectionOutcome {
  VERY_SATISFIED = 'very_satisfied',
  SATISFIED = 'satisfied',
  NEUTRAL = 'neutral',
  UNSATISFIED = 'unsatisfied',
  VERY_UNSATISFIED = 'very_unsatisfied',
}

/**
 * Learning types that can be derived from reflections
 */
export enum LearningType {
  INSIGHT = 'insight',          // New understanding gained
  PREFERENCE = 'preference',    // Discovered personal preference
  PATTERN = 'pattern',          // Recognized pattern in decisions
  IMPROVEMENT = 'improvement',  // Way to improve future decisions
}

/**
 * Reflection interface for tracking user's thoughts on past decisions
 */
export interface Reflection {
  id: string;
  userId: string;
  decisionId: string;         // References the original decision
  decisionType: 'quick' | 'deep';
  decisionCategory: DecisionCategory;
  
  // Core reflection data
  outcome: ReflectionOutcome;
  reflectionText: string;     // User's thoughts on the decision
  
  // Optional learning elements
  learnings?: {
    type: LearningType;
    description: string;
  }[];
  
  // Would they make the same decision again?
  wouldRepeat: boolean;
  
  // What would they change?
  improvementNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Optional AI-generated insights based on this reflection
  aiInsights?: string[];
}

/**
 * Summary statistics for reflections
 */
export interface ReflectionStats {
  userId: string;
  
  // Overall satisfaction metrics
  satisfactionCounts: Record<ReflectionOutcome, number>;
  averageSatisfaction: number; // 1-5 scale
  
  // Decision repetition stats
  wouldRepeatPercentage: number;
  
  // Category-specific stats
  satisfactionByCategory: Record<DecisionCategory, number>;
  
  // Time-based metrics
  reflectionTrend: 'improving' | 'stable' | 'declining';
  
  // Learning stats
  learningsByType: Record<LearningType, number>;
  
  // Last updated
  lastUpdated: Date;
} 