import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/db/db';
import { DashboardStats, DecisionInsight, ActivityLog, InsightType, ActivityActionType } from '@/db/types/Dashboard';
import { getUserDecisions } from '@/db/Decision/decisionDb';
import { DecisionCategory, DecisionStatus } from '@/db/types/BaseDecision';

/**
 * Collection names
 */
const DASHBOARD_STATS_COLLECTION = 'dashboardStats';
const DECISION_INSIGHTS_COLLECTION = 'decisionInsights';
const ACTIVITY_LOG_COLLECTION = 'activityLogs';

/**
 * Convert Firebase Timestamp to JavaScript Date and vice versa
 */
const convertDates = (data: any, toFirestore = false): any => {
  if (toFirestore) {
    const result = { ...data };
    
    // Handle specific date fields
    if (result.createdAt instanceof Date) {
      result.createdAt = Timestamp.fromDate(result.createdAt);
    }
    if (result.updatedAt instanceof Date) {
      result.updatedAt = Timestamp.fromDate(result.updatedAt);
    }
    if (result.lastUpdated instanceof Date) {
      result.lastUpdated = Timestamp.fromDate(result.lastUpdated);
    }
    if (result.timestamp instanceof Date) {
      result.timestamp = Timestamp.fromDate(result.timestamp);
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
    if (result.lastUpdated?.toDate) {
      result.lastUpdated = result.lastUpdated.toDate();
    }
    if (result.timestamp?.toDate) {
      result.timestamp = result.timestamp.toDate();
    }
    
    return result;
  }
};

// ======== Dashboard Stats ========

/**
 * Get dashboard stats for a user and time range
 */
export const getDashboardStats = async (
  userId: string,
  timeRange: DashboardStats['timeRange'] = 'month'
): Promise<DashboardStats | null> => {
  try {
    const statsRef = doc(db, DASHBOARD_STATS_COLLECTION, `${userId}_${timeRange}`);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      const statsData = statsSnap.data();
      return convertDates(statsData) as DashboardStats;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

/**
 * Calculate and store dashboard stats for a user
 */
export const calculateAndStoreDashboardStats = async (
  userId: string,
  timeRange: DashboardStats['timeRange'] = 'month'
): Promise<DashboardStats> => {
  try {
    // Get all user decisions
    const decisions = await getUserDecisions(userId);
    
    // Filter decisions based on time range
    const now = new Date();
    let filteredDecisions = [...decisions];
    
    if (timeRange !== 'all_time') {
      let cutoffDate: Date;
      
      switch (timeRange) {
        case 'day':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          // Get start of current week (Sunday)
          const day = now.getDay();
          cutoffDate = new Date(now.setDate(now.getDate() - day));
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          cutoffDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }
      
      filteredDecisions = decisions.filter(
        decision => decision.createdAt >= cutoffDate
      );
    }
    
    // Count decisions by type
    const quickCount = filteredDecisions.filter(d => d.type === 'quick').length;
    const deepCount = filteredDecisions.filter(d => d.type === 'deep').length;
    
    // Count by category
    const categoryCountsMap: Record<DecisionCategory, number> = {} as Record<DecisionCategory, number>;
    Object.values(DecisionCategory).forEach(category => {
      categoryCountsMap[category] = 0;
    });
    
    filteredDecisions.forEach(decision => {
      categoryCountsMap[decision.category]++;
    });
    
    // Count by status
    const statusCountsMap: Record<DecisionStatus, number> = {} as Record<DecisionStatus, number>;
    Object.values(DecisionStatus).forEach(status => {
      statusCountsMap[status] = 0;
    });
    
    filteredDecisions.forEach(decision => {
      statusCountsMap[decision.status]++;
    });
    
    // Calculate time metrics
    const decisionTimes = filteredDecisions
      .filter(d => d.timeSpent !== undefined)
      .map(d => d.timeSpent as number);
    
    const totalTimeSpent = decisionTimes.reduce((sum, time) => sum + time, 0);
    const averageTimePerDecision = decisionTimes.length > 0 
      ? totalTimeSpent / decisionTimes.length 
      : 0;
    const quickestDecision = decisionTimes.length > 0 
      ? Math.min(...decisionTimes) 
      : 0;
    const longestDecision = decisionTimes.length > 0 
      ? Math.max(...decisionTimes) 
      : 0;
    
    // Calculate satisfaction metrics
    const satisfactionRatings = filteredDecisions
      .filter(d => d.userFeedback?.satisfactionRating !== undefined)
      .map(d => d.userFeedback?.satisfactionRating as number);
    
    const averageSatisfaction = satisfactionRatings.length > 0 
      ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length 
      : 0;
    
    // Calculate percentage of followed recommendations
    const decisionsWithRecommendations = filteredDecisions.filter(
      d => d.userFeedback?.followedRecommendation !== undefined
    );
    
    const followedRecommendations = decisionsWithRecommendations.filter(
      d => d.userFeedback?.followedRecommendation === true
    );
    
    const percentFollowedRecommendations = decisionsWithRecommendations.length > 0
      ? (followedRecommendations.length / decisionsWithRecommendations.length) * 100
      : 0;
    
    // Calculate streak data (simplified logic - just checking consecutive days)
    // For a real app, this would be more complex and likely stored incrementally
    const currentStreak = 1; // Placeholder - would require more complex logic
    const longestStreak = 1; // Placeholder - would require more complex logic
    
    // Create the dashboard stats object
    const dashboardStats: DashboardStats = {
      id: `${userId}_${timeRange}`,
      userId,
      timeRange,
      decisionCounts: {
        total: filteredDecisions.length,
        byType: {
          quick: quickCount,
          deep: deepCount
        },
        byCategory: categoryCountsMap,
        byStatus: statusCountsMap
      },
      timeMetrics: {
        averageTimePerDecision,
        totalTimeSpent,
        quickestDecision,
        longestDecision
      },
      satisfactionMetrics: {
        averageSatisfaction,
        // This would normally be calculated based on historical data
        trendDirection: 'stable', 
        percentFollowedRecommendations
      },
      streaks: {
        currentStreak,
        longestStreak
      },
      lastUpdated: new Date()
    };
    
    // Store the stats in Firestore
    const statsRef = doc(db, DASHBOARD_STATS_COLLECTION, dashboardStats.id);
    await setDoc(statsRef, convertDates(dashboardStats, true));
    
    return dashboardStats;
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    throw error;
  }
};

// ======== Decision Insights ========

/**
 * Create a new decision insight
 */
export const createDecisionInsight = async (
  insight: Omit<DecisionInsight, 'id' | 'createdAt' | 'viewed' | 'dismissed'>
): Promise<DecisionInsight> => {
  try {
    const insightRef = doc(collection(db, DECISION_INSIGHTS_COLLECTION));
    const id = insightRef.id;
    
    const newInsight: DecisionInsight = {
      ...insight,
      id,
      createdAt: new Date(),
      viewed: false,
      dismissed: false
    };
    
    // Convert dates for Firestore
    const insightForFirestore = convertDates(newInsight, true);
    
    await setDoc(insightRef, insightForFirestore);
    
    return newInsight;
  } catch (error) {
    console.error('Error creating decision insight:', error);
    throw error;
  }
};

/**
 * Get user insights by type
 */
export const getUserInsightsByType = async (
  userId: string,
  insightType: InsightType
): Promise<DecisionInsight[]> => {
  try {
    const insightsRef = collection(db, DECISION_INSIGHTS_COLLECTION);
    const q = query(
      insightsRef,
      where('userId', '==', userId),
      where('type', '==', insightType),
      where('dismissed', '==', false),
      orderBy('importance', 'desc'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const insights: DecisionInsight[] = [];
    
    querySnapshot.forEach((doc) => {
      const insightData = doc.data();
      insights.push(convertDates(insightData) as DecisionInsight);
    });
    
    return insights;
  } catch (error) {
    console.error('Error getting user insights by type:', error);
    throw error;
  }
};

/**
 * Get all active insights for a user
 */
export const getUserActiveInsights = async (userId: string): Promise<DecisionInsight[]> => {
  try {
    const insightsRef = collection(db, DECISION_INSIGHTS_COLLECTION);
    const q = query(
      insightsRef,
      where('userId', '==', userId),
      where('dismissed', '==', false),
      orderBy('importance', 'desc'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const insights: DecisionInsight[] = [];
    
    querySnapshot.forEach((doc) => {
      const insightData = doc.data();
      insights.push(convertDates(insightData) as DecisionInsight);
    });
    
    return insights;
  } catch (error) {
    console.error('Error getting user active insights:', error);
    throw error;
  }
};

/**
 * Mark insight as viewed
 */
export const markInsightAsViewed = async (insightId: string): Promise<void> => {
  try {
    const insightRef = doc(db, DECISION_INSIGHTS_COLLECTION, insightId);
    await updateDoc(insightRef, { viewed: true });
  } catch (error) {
    console.error('Error marking insight as viewed:', error);
    throw error;
  }
};

/**
 * Dismiss an insight
 */
export const dismissInsight = async (insightId: string): Promise<void> => {
  try {
    const insightRef = doc(db, DECISION_INSIGHTS_COLLECTION, insightId);
    await updateDoc(insightRef, { dismissed: true });
  } catch (error) {
    console.error('Error dismissing insight:', error);
    throw error;
  }
};

// ======== Activity Log ========

/**
 * Log user activity
 */
export const logActivity = async (
  userId: string,
  actionType: ActivityActionType,
  decisionId?: string,
  details?: Record<string, any>
): Promise<string> => {
  try {
    const activityRef = doc(collection(db, ACTIVITY_LOG_COLLECTION));
    const id = activityRef.id;
    
    const activity: ActivityLog = {
      id,
      userId,
      decisionId,
      actionType,
      timestamp: new Date(),
      details
    };
    
    // Convert dates for Firestore
    const activityForFirestore = convertDates(activity, true);
    
    await setDoc(activityRef, activityForFirestore);
    
    return id;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

/**
 * Get recent activity logs for a user
 */
export const getRecentActivityLogs = async (
  userId: string,
  limitCount: number = 20
): Promise<ActivityLog[]> => {
  try {
    const logsRef = collection(db, ACTIVITY_LOG_COLLECTION);
    const q = query(
      logsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const logs: ActivityLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const logData = doc.data();
      logs.push(convertDates(logData) as ActivityLog);
    });
    
    return logs;
  } catch (error) {
    console.error('Error getting recent activity logs:', error);
    throw error;
  }
};

/**
 * Get activity logs for a specific decision
 */
export const getDecisionActivityLogs = async (decisionId: string): Promise<ActivityLog[]> => {
  try {
    const logsRef = collection(db, ACTIVITY_LOG_COLLECTION);
    const q = query(
      logsRef,
      where('decisionId', '==', decisionId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const logs: ActivityLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const logData = doc.data();
      logs.push(convertDates(logData) as ActivityLog);
    });
    
    return logs;
  } catch (error) {
    console.error('Error getting decision activity logs:', error);
    throw error;
  }
}; 