/**
 * Decision interfaces for the database
 * Main export file that combines all decision types
 */

import { BaseDecision, DecisionCategory, DecisionStatus } from './BaseDecision';
import { QuickDecision } from './QuickDecision';
import { DeepDecision } from './DeepDecision';

/**
 * Union type for all decision types
 */
export type Decision = QuickDecision | DeepDecision;

export { DecisionCategory, DecisionStatus };
export type { BaseDecision, QuickDecision, DeepDecision }; 