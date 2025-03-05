import { collection, query, where, getDocs, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/db/db';
import { Decision, DecisionCategory, DecisionStatus } from '@/db/types/Decision';
import { getQuickDecision, getUserQuickDecisions } from './Quick/quickDecisionDb';
import { getDeepDecision, getUserDeepDecisions } from './Deep/deepDecisionDb';
import { Timestamp } from 'firebase/firestore';

/**
 * Collection names
 */
const QUICK_COLLECTION = 'quickDecisions';
const DEEP_COLLECTION = 'deepDecisions';

/**
 * Convert Firebase Timestamp to JavaScript Date
 */
const convertDates = (decision: any): any => {
  return {
    ...decision,
    createdAt: decision.createdAt?.toDate?.() || decision.createdAt,
    updatedAt: decision.updatedAt?.toDate?.() || decision.updatedAt
  };
};

/**
 * Get a decision by ID, checking both quick and deep collections
 */
export const getDecision = async (id: string, type?: 'quick' | 'deep'): Promise<Decision | null> => {
  try {
    if (type === 'quick' || !type) {
      const quickDecision = await getQuickDecision(id);
      if (quickDecision) return quickDecision;
    }
    
    if (type === 'deep' || !type) {
      const deepDecision = await getDeepDecision(id);
      if (deepDecision) return deepDecision;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting decision:', error);
    throw error;
  }
};

/**
 * Get all decisions for a user (both quick and deep)
 */
export const getUserDecisions = async (userId: string): Promise<Decision[]> => {
  try {
    const [quickDecisions, deepDecisions] = await Promise.all([
      getUserQuickDecisions(userId),
      getUserDeepDecisions(userId)
    ]);
    
    // Combine and sort by date
    return [...quickDecisions, ...deepDecisions].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error('Error getting user decisions:', error);
    throw error;
  }
};

/**
 * Get decisions by category for a user
 */
export const getDecisionsByCategory = async (
  userId: string,
  category: DecisionCategory
): Promise<Decision[]> => {
  try {
    const quickRef = collection(db, QUICK_COLLECTION);
    const deepRef = collection(db, DEEP_COLLECTION);
    
    const quickQuery = query(
      quickRef,
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const deepQuery = query(
      deepRef,
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const [quickSnap, deepSnap] = await Promise.all([
      getDocs(quickQuery),
      getDocs(deepQuery)
    ]);
    
    const decisions: Decision[] = [];
    
    quickSnap.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData));
    });
    
    deepSnap.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData));
    });
    
    // Sort by date
    return decisions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting decisions by category:', error);
    throw error;
  }
};

/**
 * Get decisions by status for a user
 */
export const getDecisionsByStatus = async (
  userId: string,
  status: DecisionStatus
): Promise<Decision[]> => {
  try {
    const quickRef = collection(db, QUICK_COLLECTION);
    const deepRef = collection(db, DEEP_COLLECTION);
    
    const quickQuery = query(
      quickRef,
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const deepQuery = query(
      deepRef,
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const [quickSnap, deepSnap] = await Promise.all([
      getDocs(quickQuery),
      getDocs(deepQuery)
    ]);
    
    const decisions: Decision[] = [];
    
    quickSnap.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData));
    });
    
    deepSnap.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData));
    });
    
    // Sort by date
    return decisions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting decisions by status:', error);
    throw error;
  }
};

/**
 * Get recent decisions for a user (both quick and deep)
 */
export const getRecentDecisions = async (
  userId: string,
  limitCount: number = 10
): Promise<Decision[]> => {
  try {
    const quickRef = collection(db, QUICK_COLLECTION);
    const deepRef = collection(db, DEEP_COLLECTION);
    
    const quickQuery = query(
      quickRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const deepQuery = query(
      deepRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const [quickSnap, deepSnap] = await Promise.all([
      getDocs(quickQuery),
      getDocs(deepQuery)
    ]);
    
    const decisions: Decision[] = [];
    
    quickSnap.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData));
    });
    
    deepSnap.forEach((doc) => {
      const decisionData = doc.data();
      decisions.push(convertDates(decisionData));
    });
    
    // Sort by date and limit to requested count
    return decisions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error getting recent decisions:', error);
    throw error;
  }
};

/**
 * Get decisions count by category for a user
 */
export const getDecisionCountsByCategory = async (
  userId: string
): Promise<Record<DecisionCategory, number>> => {
  try {
    const decisions = await getUserDecisions(userId);
    
    // Initialize counts object with zeros
    const counts: Record<DecisionCategory, number> = {} as Record<DecisionCategory, number>;
    Object.values(DecisionCategory).forEach(category => {
      counts[category] = 0;
    });
    
    // Count decisions by category
    decisions.forEach(decision => {
      counts[decision.category]++;
    });
    
    return counts;
  } catch (error) {
    console.error('Error getting decision counts by category:', error);
    throw error;
  }
};

/**
 * Update a decision's status
 * Works for both quick and deep decisions
 */
export const updateDecisionStatus = async (id: string, status: DecisionStatus): Promise<void> => {
  try {
    // First determine if it's a quick or deep decision
    const decision = await getDecision(id);
    
    if (!decision) {
      throw new Error(`Decision with id ${id} not found`);
    }
    
    // Update status based on decision type
    if (decision.type === 'quick') {
      const quickCollection = collection(db, QUICK_COLLECTION);
      await updateDoc(doc(quickCollection, id), { 
        status, 
        updatedAt: Timestamp.fromDate(new Date()) 
      });
    } else if (decision.type === 'deep') {
      const deepCollection = collection(db, DEEP_COLLECTION);
      await updateDoc(doc(deepCollection, id), { 
        status, 
        updatedAt: Timestamp.fromDate(new Date()) 
      });
    }
  } catch (error) {
    console.error('Error updating decision status:', error);
    throw error;
  }
};

/**
 * Get decisions with a specific status for a user
 */
export const getUserDecisionsWithStatus = async (userId: string, status: DecisionStatus): Promise<Decision[]> => {
  try {
    // Get quick decisions with the specified status
    const quickQuery = query(
      collection(db, QUICK_COLLECTION),
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    // Get deep decisions with the specified status
    const deepQuery = query(
      collection(db, DEEP_COLLECTION),
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    // Execute both queries
    const [quickSnapshot, deepSnapshot] = await Promise.all([
      getDocs(quickQuery),
      getDocs(deepQuery)
    ]);
    
    // Process results
    const quickDecisions: Decision[] = [];
    quickSnapshot.forEach(doc => {
      quickDecisions.push(convertDates(doc.data()));
    });
    
    const deepDecisions: Decision[] = [];
    deepSnapshot.forEach(doc => {
      deepDecisions.push(convertDates(doc.data()));
    });
    
    // Combine and sort by date
    return [...quickDecisions, ...deepDecisions].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error('Error getting user decisions with status:', error);
    throw error;
  }
}; 