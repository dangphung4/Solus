/**
 * Dashboard interfaces for the database
 * Contains types for dashboard data, statistics, and insights
 */

import { DecisionCategory, DecisionStatus } from './Decision';

/**
 * User dashboard statistics
 */
export interface DashboardStats {
  id: string;
  userId: string;
  timeRange: 'all_time' | 'year' | 'month' | 'week' | 'day';
  decisionCounts: {
    total: number;
    byType: {
      quick: number;
      deep: number;
    };
    byCategory: Record<DecisionCategory, number>;
    byStatus: Record<DecisionStatus, number>;
  };
  timeMetrics: {
    averageTimePerDecision: number; // in seconds
    totalTimeSpent: number; // in seconds
    quickestDecision: number; // in seconds
    longestDecision: number; // in seconds
  };
  satisfactionMetrics: {
    averageSatisfaction: number; // 1-5
    trendDirection: 'improving' | 'stable' | 'declining';
    percentFollowedRecommendations: number; // 0-100
  };
  streaks: {
    currentStreak: number; // consecutive days with decisions
    longestStreak: number;
  };
  lastUpdated: Date;
}

/**
 * Decision insight generated from user's history
 */
export interface DecisionInsight {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: InsightType;
  category?: DecisionCategory;
  relatedDecisions: string[]; // decision IDs
  data?: Record<string, any>; // Additional data specific to the insight type
  importance: number; // 1-10
  actionable: boolean;
  createdAt: Date;
  viewed: boolean;
  dismissed: boolean;
}

/**
 * Types of insights that can be generated
 */
export enum InsightType {
  PATTERN = 'pattern', // Recognized pattern in decisions
  IMPROVEMENT = 'improvement', // Way to improve decision process
  BIAS = 'bias', // Detected cognitive bias
  MILESTONE = 'milestone', // Achievement or milestone reached
  RECOMMENDATION = 'recommendation', // Suggested action based on history
  PREFERENCE = 'preference' // Discovered preference
}

/**
 * Activity log entry for tracking user's decision journey
 */
export interface ActivityLog {
  id: string;
  userId: string;
  decisionId?: string;
  actionType: ActivityActionType;
  timestamp: Date;
  details?: Record<string, any>;
}

/**
 * Types of activities tracked in the log
 */
export enum ActivityActionType {
  DECISION_STARTED = 'decision_started',
  DECISION_COMPLETED = 'decision_completed',
  DECISION_IMPLEMENTED = 'decision_implemented',
  OPTION_ADDED = 'option_added',
  OPTION_REMOVED = 'option_removed',
  REFLECTION_COMPLETED = 'reflection_completed',
  AI_REQUESTED = 'ai_requested',
  FEEDBACK_PROVIDED = 'feedback_provided',
  INSIGHT_VIEWED = 'insight_viewed',
  DASHBOARD_CUSTOMIZED = 'dashboard_customized'
} 