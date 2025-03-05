/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * UserPreferences interfaces for the database
 * Contains user settings, preferences, and personalization data
 */

/**
 * User preferences for the application
 */
export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultDecisionMode: 'quick' | 'deep' | 'auto';
  privacySettings: {
    shareAnonymousData: boolean;
    allowHistoryStorage: boolean;
    retentionPeriod: number; // in days
  };
  aiPreferences: {
    usageConsent: boolean;
    personalityStyle: AIPersonalityStyle;
    detailLevel: 'minimal' | 'moderate' | 'detailed';
    creativityLevel: number; // 1-10 scale (1: very logical, 10: very creative)
  };
  dashboard: {
    favoriteCategories: string[];
    pinnedDecisions: string[]; // decision IDs
    widgets: DashboardWidgetConfig[];
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI personality styles for response tone
 */
export enum AIPersonalityStyle {
  ANALYTICAL = 'analytical',
  FRIENDLY = 'friendly',
  ENCOURAGING = 'encouraging',
  DIRECT = 'direct',
  BALANCED = 'balanced'
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidgetConfig {
  id: string;
  type: DashboardWidgetType;
  position: {
    row: number;
    col: number;
    width: number;
    height: number;
  };
  title?: string;
  settings?: Record<string, any>;
}

/**
 * Types of widgets available for dashboard
 */
export enum DashboardWidgetType {
  RECENT_DECISIONS = 'recent_decisions',
  DECISION_STATS = 'decision_stats',
  CATEGORY_BREAKDOWN = 'category_breakdown',
  DECISION_CALENDAR = 'decision_calendar',
  FAVORITES = 'favorites',
  QUICK_DECISION = 'quick_decision',
  TIPS = 'tips',
  PROGRESS = 'progress',
  CUSTOM = 'custom'
} 