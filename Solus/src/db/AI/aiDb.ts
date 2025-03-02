import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/db/db';
import { 
  AIModel, 
  AIPrompt, 
  AIInteraction, 
  UserPattern, 
  PatternType 
} from '@/db/types/AI';
import { DecisionCategory } from '@/db/types/BaseDecision';

/**
 * Collection names
 */
const AI_MODELS_COLLECTION = 'aiModels';
const AI_PROMPTS_COLLECTION = 'aiPrompts';
const AI_INTERACTIONS_COLLECTION = 'aiInteractions';
const USER_PATTERNS_COLLECTION = 'userPatterns';

/**
 * Convert Firebase Timestamp to JavaScript Date and vice versa
 */
const convertDates = (data: any, toFirestore = false): any => {
  if (toFirestore) {
    const result = { ...data };
    
    // Convert Date objects to Timestamps
    if (result.createdAt instanceof Date) {
      result.createdAt = Timestamp.fromDate(result.createdAt);
    }
    if (result.updatedAt instanceof Date) {
      result.updatedAt = Timestamp.fromDate(result.updatedAt);
    }
    if (result.lastApplied instanceof Date) {
      result.lastApplied = Timestamp.fromDate(result.lastApplied);
    }
    
    return result;
  } else {
    const result = { ...data };
    
    // Convert Timestamps to Date objects
    if (result.createdAt?.toDate) {
      result.createdAt = result.createdAt.toDate();
    }
    if (result.updatedAt?.toDate) {
      result.updatedAt = result.updatedAt.toDate();
    }
    if (result.lastApplied?.toDate) {
      result.lastApplied = result.lastApplied.toDate();
    }
    
    return result;
  }
};

// ======== AI Models ========

/**
 * Get all active AI models
 */
export const getActiveAIModels = async (): Promise<AIModel[]> => {
  try {
    const modelsRef = collection(db, AI_MODELS_COLLECTION);
    const q = query(modelsRef, where('isActive', '==', true));
    
    const querySnapshot = await getDocs(q);
    const models: AIModel[] = [];
    
    querySnapshot.forEach((doc) => {
      const modelData = doc.data();
      models.push(convertDates(modelData) as AIModel);
    });
    
    return models;
  } catch (error) {
    console.error('Error getting active AI models:', error);
    throw error;
  }
};

/**
 * Get an AI model by ID
 */
export const getAIModel = async (modelId: string): Promise<AIModel | null> => {
  try {
    const modelRef = doc(db, AI_MODELS_COLLECTION, modelId);
    const modelSnap = await getDoc(modelRef);
    
    if (modelSnap.exists()) {
      const modelData = modelSnap.data();
      return convertDates(modelData) as AIModel;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting AI model:', error);
    throw error;
  }
};

// ======== AI Prompts ========

/**
 * Get active AI prompts for a specific decision type
 */
export const getActiveAIPrompts = async (
  decisionType: 'quick' | 'deep' | 'both'
): Promise<AIPrompt[]> => {
  try {
    const promptsRef = collection(db, AI_PROMPTS_COLLECTION);
    const q = query(
      promptsRef,
      where('isActive', '==', true),
      where('decisionType', 'in', [decisionType, 'both'])
    );
    
    const querySnapshot = await getDocs(q);
    const prompts: AIPrompt[] = [];
    
    querySnapshot.forEach((doc) => {
      const promptData = doc.data();
      prompts.push(convertDates(promptData) as AIPrompt);
    });
    
    return prompts;
  } catch (error) {
    console.error('Error getting active AI prompts:', error);
    throw error;
  }
};

/**
 * Get AI prompts for a specific category
 */
export const getAIPromptsByCategory = async (
  category: DecisionCategory,
  decisionType: 'quick' | 'deep' | 'both'
): Promise<AIPrompt[]> => {
  try {
    const promptsRef = collection(db, AI_PROMPTS_COLLECTION);
    const q = query(
      promptsRef,
      where('isActive', '==', true),
      where('category', '==', category),
      where('decisionType', 'in', [decisionType, 'both'])
    );
    
    const querySnapshot = await getDocs(q);
    const prompts: AIPrompt[] = [];
    
    querySnapshot.forEach((doc) => {
      const promptData = doc.data();
      prompts.push(convertDates(promptData) as AIPrompt);
    });
    
    return prompts;
  } catch (error) {
    console.error('Error getting AI prompts by category:', error);
    throw error;
  }
};

/**
 * Get an AI prompt by ID
 */
export const getAIPrompt = async (promptId: string): Promise<AIPrompt | null> => {
  try {
    const promptRef = doc(db, AI_PROMPTS_COLLECTION, promptId);
    const promptSnap = await getDoc(promptRef);
    
    if (promptSnap.exists()) {
      const promptData = promptSnap.data();
      return convertDates(promptData) as AIPrompt;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting AI prompt:', error);
    throw error;
  }
};

// ======== AI Interactions ========

/**
 * Record an AI interaction
 */
export const recordAIInteraction = async (interaction: Omit<AIInteraction, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const interactionRef = doc(collection(db, AI_INTERACTIONS_COLLECTION));
    const id = interactionRef.id;
    
    const newInteraction: AIInteraction = {
      ...interaction,
      id,
      createdAt: new Date()
    };
    
    // Convert dates for Firestore
    const interactionForFirestore = convertDates(newInteraction, true);
    
    await setDoc(interactionRef, interactionForFirestore);
    
    return id;
  } catch (error) {
    console.error('Error recording AI interaction:', error);
    throw error;
  }
};

/**
 * Add feedback to an AI interaction
 */
export const addAIInteractionFeedback = async (
  interactionId: string,
  feedback: AIInteraction['feedback']
): Promise<void> => {
  try {
    const interactionRef = doc(db, AI_INTERACTIONS_COLLECTION, interactionId);
    
    await updateDoc(interactionRef, { feedback });
  } catch (error) {
    console.error('Error adding AI interaction feedback:', error);
    throw error;
  }
};

/**
 * Get recent AI interactions for a user
 */
export const getUserAIInteractions = async (
  userId: string,
  limitCount: number = 10
): Promise<AIInteraction[]> => {
  try {
    const interactionsRef = collection(db, AI_INTERACTIONS_COLLECTION);
    const q = query(
      interactionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const interactions: AIInteraction[] = [];
    
    querySnapshot.forEach((doc) => {
      const interactionData = doc.data();
      interactions.push(convertDates(interactionData) as AIInteraction);
    });
    
    return interactions;
  } catch (error) {
    console.error('Error getting user AI interactions:', error);
    throw error;
  }
};

// ======== User Patterns ========

/**
 * Store a user pattern
 */
export const storeUserPattern = async (pattern: Omit<UserPattern, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const patternRef = doc(collection(db, USER_PATTERNS_COLLECTION));
    const id = patternRef.id;
    
    const newPattern: UserPattern = {
      ...pattern,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Convert dates for Firestore
    const patternForFirestore = convertDates(newPattern, true);
    
    await setDoc(patternRef, patternForFirestore);
    
    return id;
  } catch (error) {
    console.error('Error storing user pattern:', error);
    throw error;
  }
};

/**
 * Update a user pattern
 */
export const updateUserPattern = async (
  patternId: string,
  data: Partial<UserPattern>
): Promise<void> => {
  try {
    const patternRef = doc(db, USER_PATTERNS_COLLECTION, patternId);
    
    // Add updated timestamp
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    // Convert dates for Firestore
    const updateDataForFirestore = convertDates(updateData, true);
    
    await updateDoc(patternRef, updateDataForFirestore);
  } catch (error) {
    console.error('Error updating user pattern:', error);
    throw error;
  }
};

/**
 * Get user patterns by type
 */
export const getUserPatternsByType = async (
  userId: string,
  patternType: PatternType
): Promise<UserPattern[]> => {
  try {
    const patternsRef = collection(db, USER_PATTERNS_COLLECTION);
    const q = query(
      patternsRef,
      where('userId', '==', userId),
      where('patternType', '==', patternType),
      orderBy('confidence', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const patterns: UserPattern[] = [];
    
    querySnapshot.forEach((doc) => {
      const patternData = doc.data();
      patterns.push(convertDates(patternData) as UserPattern);
    });
    
    return patterns;
  } catch (error) {
    console.error('Error getting user patterns by type:', error);
    throw error;
  }
};

/**
 * Get user patterns by category
 */
export const getUserPatternsByCategory = async (
  userId: string,
  category: DecisionCategory
): Promise<UserPattern[]> => {
  try {
    const patternsRef = collection(db, USER_PATTERNS_COLLECTION);
    const q = query(
      patternsRef,
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('confidence', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const patterns: UserPattern[] = [];
    
    querySnapshot.forEach((doc) => {
      const patternData = doc.data();
      patterns.push(convertDates(patternData) as UserPattern);
    });
    
    return patterns;
  } catch (error) {
    console.error('Error getting user patterns by category:', error);
    throw error;
  }
}; 