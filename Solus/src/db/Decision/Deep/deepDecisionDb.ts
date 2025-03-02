import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/db/db';
import { DeepDecision } from '@/db/types/DeepDecision';
import { DecisionStatus } from '@/db/types/BaseDecision';

/**
 * Collection name for deep decisions
 */
const COLLECTION_NAME = 'deepDecisions';

/**
 * Convert Firebase Timestamp to JavaScript Date and vice versa
 */
const convertDates = (decision: any, toFirestore = false): any => {
  if (toFirestore) {
    return {
      ...decision,
      createdAt: decision.createdAt instanceof Date ? Timestamp.fromDate(decision.createdAt) : decision.createdAt,
      updatedAt: Timestamp.fromDate(new Date())
    };
  } else {
    return {
      ...decision,
      createdAt: decision.createdAt?.toDate?.() || decision.createdAt,
      updatedAt: decision.updatedAt?.toDate?.() || decision.updatedAt
    };
  }
};

/**
 * Create a new deep decision
 */
export const createDeepDecision = async (decision: Omit<DeepDecision, 'id'>): Promise<DeepDecision> => {
  try {
    // Create a new document reference with auto-generated ID
    const newDecisionRef = doc(collection(db, COLLECTION_NAME));
    const id = newDecisionRef.id;
    
    const newDecision: DeepDecision = {
      ...decision,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: decision.status || DecisionStatus.DRAFT
    };
    
    // Convert dates for Firestore
    const decisionForFirestore = convertDates(newDecision, true);
    
    // Save to Firestore
    await setDoc(newDecisionRef, decisionForFirestore);
    
    return newDecision;
  } catch (error) {
    console.error('Error creating deep decision:', error);
    throw error;
  }
};

/**
 * Get a deep decision by ID
 */
export const getDeepDecision = async (id: string): Promise<DeepDecision | null> => {
  try {
    const decisionRef = doc(db, COLLECTION_NAME, id);
    const decisionSnap = await getDoc(decisionRef);
    
    if (decisionSnap.exists()) {
      const decisionData = decisionSnap.data();
      // Convert Firestore Timestamps to JavaScript Dates
      return convertDates(decisionData) as DeepDecision;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting deep decision:', error);
    throw error;
  }
};

/**
 * Update a deep decision
 */
export const updateDeepDecision = async (id: string, data: Partial<DeepDecision>): Promise<void> => {
  try {
    const decisionRef = doc(db, COLLECTION_NAME, id);
    
    // Convert dates for Firestore and set updated timestamp
    const updateData = convertDates({
      ...data,
      updatedAt: new Date()
    }, true);
    
    await updateDoc(decisionRef, updateData);
  } catch (error) {
    console.error('Error updating deep decision:', error);
    throw error;
  }
};

/**
 * Delete a deep decision
 */
export const deleteDeepDecision = async (id: string): Promise<void> => {
  try {
    const decisionRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(decisionRef);
  } catch (error) {
    console.error('Error deleting deep decision:', error);
    throw error;
  }
};

/**
 * Get all deep decisions for a user
 */
export const getUserDeepDecisions = async (userId: string): Promise<DeepDecision[]> => {
  try {
    const decisionsRef = collection(db, COLLECTION_NAME);
    const q = query(
      decisionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const decisions: DeepDecision[] = [];
    
    querySnapshot.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData) as DeepDecision);
    });
    
    return decisions;
  } catch (error) {
    console.error('Error getting user deep decisions:', error);
    throw error;
  }
};

/**
 * Get recent deep decisions for a user with pagination
 */
export const getRecentDeepDecisions = async (
  userId: string,
  limitCount: number = 10,
  startAfter?: Date
): Promise<DeepDecision[]> => {
  try {
    const decisionsRef = collection(db, COLLECTION_NAME);
    let q;
    
    if (startAfter) {
      q = query(
        decisionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        where('createdAt', '<', Timestamp.fromDate(startAfter)),
        limit(limitCount)
      );
    } else {
      q = query(
        decisionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const decisions: DeepDecision[] = [];
    
    querySnapshot.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData) as DeepDecision);
    });
    
    return decisions;
  } catch (error) {
    console.error('Error getting recent deep decisions:', error);
    throw error;
  }
};

/**
 * Update the values alignment section of a deep decision
 */
export const updateValuesAlignment = async (id: string, valuesAlignment: DeepDecision['valuesAlignment']): Promise<void> => {
  try {
    await updateDeepDecision(id, { valuesAlignment, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating values alignment:', error);
    throw error;
  }
};

/**
 * Update the future scenarios section of a deep decision
 */
export const updateFutureScenarios = async (id: string, futureScenarios: DeepDecision['futureScenarios']): Promise<void> => {
  try {
    await updateDeepDecision(id, { futureScenarios, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating future scenarios:', error);
    throw error;
  }
};

/**
 * Add a reflection response to a deep decision
 */
export const addReflectionResponse = async (
  id: string, 
  question: string, 
  answer: string
): Promise<void> => {
  try {
    const decision = await getDeepDecision(id);
    if (!decision) {
      throw new Error(`Deep decision with ID ${id} not found`);
    }
    
    const reflectionResponses = decision.reflectionResponses || [];
    reflectionResponses.push({ question, answer });
    
    await updateDeepDecision(id, { 
      reflectionResponses,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error adding reflection response:', error);
    throw error;
  }
}; 