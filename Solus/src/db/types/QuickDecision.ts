/**
 * Quick Decision interface for everyday choices
 */

import { BaseDecision } from './BaseDecision';

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