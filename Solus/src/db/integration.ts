/**
 * Database integration service
 * Provides functionality to connect and integrate different parts of the database
 */

import { getDecision, updateDecisionStatus, getUserDecisionsWithStatus } from './Decision/decisionDb';
import { createReflection, getDecisionReflections } from './Reflection/reflectionDb';
import { Reflection, ReflectionOutcome } from './types/Reflection';
import { DecisionStatus } from './types/BaseDecision';
import { Decision } from './types/Decision';

/**
 * Create a reflection from a decision
 * This is the primary way to connect a decision with its reflection
 */
export const createReflectionFromDecision = async (
  decisionId: string,
  reflectionData: {
    outcome: ReflectionOutcome;
    reflectionText: string;
    wouldRepeat: boolean;
    improvementNotes?: string;
  }
): Promise<Reflection | null> => {
  try {
    // Get the decision first to ensure it exists and to get its details
    const decision = await getDecision(decisionId);
    
    if (!decision) {
      console.error('Decision not found:', decisionId);
      return null;
    }
    
    // Create the reflection with the decision data
    const reflection = await createReflection({
      userId: decision.userId,
      decisionId: decision.id,
      decisionType: decision.type,
      decisionCategory: decision.category,
      outcome: reflectionData.outcome,
      reflectionText: reflectionData.reflectionText,
      wouldRepeat: reflectionData.wouldRepeat,
      improvementNotes: reflectionData.improvementNotes,
    });
    
    // Update the decision status to show it has been reflected upon
    await updateDecisionStatus(decisionId, DecisionStatus.IMPLEMENTED);
    
    return reflection;
  } catch (error) {
    console.error('Error creating reflection from decision:', error);
    throw error;
  }
};

/**
 * Check if a decision has reflections
 */
export const hasReflection = async (decisionId: string): Promise<boolean> => {
  try {
    const reflections = await getDecisionReflections(decisionId);
    return reflections.length > 0;
  } catch (error) {
    console.error('Error checking if decision has reflections:', error);
    throw error;
  }
};

/**
 * Get a decision with its reflections
 * Returns the decision object with an added reflections array
 */
export const getDecisionWithReflections = async (decisionId: string): Promise<(Decision & { reflections: Reflection[] }) | null> => {
  try {
    const decision = await getDecision(decisionId);
    
    if (!decision) {
      return null;
    }
    
    const reflections = await getDecisionReflections(decisionId);
    
    return {
      ...decision,
      reflections
    };
  } catch (error) {
    console.error('Error getting decision with reflections:', error);
    throw error;
  }
};

/**
 * Get all decisions that need reflection
 * These are decisions that are completed but not yet reflected upon
 */
export const getDecisionsNeedingReflection = async (userId: string): Promise<Decision[]> => {
  try {
    // Get all decisions for the user that are in COMPLETED status
    const decisions = await getUserDecisionsWithStatus(userId, DecisionStatus.COMPLETED);
    
    // Filter out decisions that already have reflections
    const needReflection = [];
    
    for (const decision of decisions) {
      const hasReflectionAlready = await hasReflection(decision.id);
      if (!hasReflectionAlready) {
        needReflection.push(decision);
      }
    }
    
    return needReflection;
  } catch (error) {
    console.error('Error getting decisions needing reflection:', error);
    throw error;
  }
}; 