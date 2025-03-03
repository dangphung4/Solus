import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/db/db';
import { QuickDecision } from '@/db/types/QuickDecision';
import { DecisionStatus } from '@/db/types/BaseDecision';

/**
 * Collection name for quick decisions
 */
const COLLECTION_NAME = 'quickDecisions';

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
 * Create a new quick decision
 */
export const createQuickDecision = async (decision: Omit<QuickDecision, 'id'>): Promise<QuickDecision> => {
  try {
    // Create a new document reference with auto-generated ID
    const newDecisionRef = doc(collection(db, COLLECTION_NAME));
    const id = newDecisionRef.id;
    
    const newDecision: QuickDecision = {
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
    console.error('Error creating quick decision:', error);
    throw error;
  }
};

/**
 * Get a quick decision by ID
 */
export const getQuickDecision = async (id: string): Promise<QuickDecision | null> => {
  try {
    const decisionRef = doc(db, COLLECTION_NAME, id);
    const decisionSnap = await getDoc(decisionRef);
    
    if (decisionSnap.exists()) {
      const decisionData = decisionSnap.data();
      // Convert Firestore Timestamps to JavaScript Dates
      return convertDates(decisionData) as QuickDecision;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting quick decision:', error);
    throw error;
  }
};

/**
 * Update a quick decision
 */
export const updateQuickDecision = async (id: string, data: Partial<QuickDecision>): Promise<void> => {
  try {
    const decisionRef = doc(db, COLLECTION_NAME, id);
    
    // Convert dates for Firestore and set updated timestamp
    const updateData = convertDates({
      ...data,
      updatedAt: new Date()
    }, true);
    
    await updateDoc(decisionRef, updateData);
  } catch (error) {
    console.error('Error updating quick decision:', error);
    throw error;
  }
};

/**
 * Delete a quick decision
 */
export const deleteQuickDecision = async (id: string): Promise<void> => {
  try {
    const decisionRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(decisionRef);
  } catch (error) {
    console.error('Error deleting quick decision:', error);
    throw error;
  }
};

/**
 * Get all quick decisions for a user
 */
export const getUserQuickDecisions = async (userId: string): Promise<QuickDecision[]> => {
  try {
    const decisionsRef = collection(db, COLLECTION_NAME);
    const q = query(
      decisionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const decisions: QuickDecision[] = [];
    
    querySnapshot.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData) as QuickDecision);
    });
    
    return decisions;
  } catch (error) {
    console.error('Error getting user quick decisions:', error);
    throw error;
  }
};

/**
 * Get recent quick decisions for a user with pagination
 */
export const getRecentQuickDecisions = async (
  userId: string,
  limitCount: number = 10,
  startAfter?: Date
): Promise<QuickDecision[]> => {
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
    const decisions: QuickDecision[] = [];
    
    querySnapshot.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData) as QuickDecision);
    });
    
    return decisions;
  } catch (error) {
    console.error('Error getting recent quick decisions:', error);
    throw error;
  }
}; 