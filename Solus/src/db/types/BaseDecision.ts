/**
 * Base decision interface with common properties
 */

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