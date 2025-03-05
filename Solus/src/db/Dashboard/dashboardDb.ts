/**
 * Dashboard database service
 * Provides functionality for dashboard statistics, insights, and activity tracking
 */

import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/db/db';
import { DashboardStats, DecisionInsight, ActivityLog, InsightType, ActivityActionType } from '@/db/types/Dashboard';
import { getUserDecisions } from '@/db/Decision/decisionDb';
import { DecisionCategory, DecisionStatus } from '@/db/types/BaseDecision';
import { getReflectionStats, 
  // getUserReflections
 } from '@/db/Reflection/reflectionDb';
import { v4 as uuidv4 } from 'uuid';

/**
 * Collection names
 */
const DASHBOARD_STATS_COLLECTION = 'dashboardStats';
const DECISION_INSIGHTS_COLLECTION = 'decisionInsights';
const ACTIVITY_LOG_COLLECTION = 'activityLog';

/**
 * Convert Firebase Timestamp to JavaScript Date
 */
const fromFirestore = (data: DocumentData): any => {
  return {
    ...data,
    lastUpdated: data.lastUpdated?.toDate?.() || data.lastUpdated,
    timestamp: data.timestamp?.toDate?.() || data.timestamp,
    createdAt: data.createdAt?.toDate?.() || data.createdAt
  };
};

/**
 * Get dashboard statistics for a user
 */
export const getDashboardStats = async (userId: string, timeRange: 'all_time' | 'year' | 'month' | 'week' | 'day' = 'all_time'): Promise<DashboardStats | null> => {
  try {
    const docRef = doc(db, DASHBOARD_STATS_COLLECTION, `${userId}_${timeRange}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return fromFirestore(docSnap.data());
    }
    
    // If stats don't exist yet, generate them
    return await generateDashboardStats(userId, timeRange);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

/**
 * Generate and save dashboard statistics for a user
 */
export const generateDashboardStats = async (userId: string, timeRange: 'all_time' | 'year' | 'month' | 'week' | 'day' = 'all_time'): Promise<DashboardStats> => {
  try {
    // Get all decisions for the user
    const allDecisions = await getUserDecisions(userId);
    
    // Filter decisions based on time range
    const decisions = filterByTimeRange(allDecisions, timeRange);
    
    // Get all reflections for the user
    // const reflections = await getUserReflections(userId);
    // const filteredReflections = filterByTimeRange(reflections, timeRange);
    
    // Calculate decision counts
    const decisionCounts = {
      total: decisions.length,
      byType: {
        quick: decisions.filter(d => d.type === 'quick').length,
        deep: decisions.filter(d => d.type === 'deep').length
      },
      byCategory: {} as Record<DecisionCategory, number>,
      byStatus: {} as Record<DecisionStatus, number>
    };
    
    // Initialize category and status counters
    Object.values(DecisionCategory).forEach(category => {
      decisionCounts.byCategory[category] = 0;
    });
    
    Object.values(DecisionStatus).forEach(status => {
      decisionCounts.byStatus[status] = 0;
    });
    
    // Count by category and status
    decisions.forEach(decision => {
      decisionCounts.byCategory[decision.category]++;
      decisionCounts.byStatus[decision.status]++;
    });
    
    // Calculate time metrics
    const timeMetrics = {
      averageTimePerDecision: 0,
      totalTimeSpent: 0,
      quickestDecision: 0,
      longestDecision: 0
    };
    
    // Calculate from decisions with timeSpent property
    const decisionsWithTime = decisions.filter(d => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return 'timeSpent' in d && typeof (d as any).timeSpent === 'number';
    });
    
    if (decisionsWithTime.length > 0) {
      // Calculate total time spent
      let totalTime = 0;
      let minTime = Number.MAX_VALUE;
      let maxTime = 0;
      
      decisionsWithTime.forEach(d => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const time = (d as any).timeSpent as number;
        totalTime += time;
        minTime = Math.min(minTime, time);
        maxTime = Math.max(maxTime, time);
      });
      
      timeMetrics.totalTimeSpent = totalTime;
      timeMetrics.averageTimePerDecision = totalTime / decisionsWithTime.length;
      timeMetrics.quickestDecision = minTime === Number.MAX_VALUE ? 0 : minTime;
      timeMetrics.longestDecision = maxTime;
    }
    
    // Get satisfaction metrics from reflections
    const satisfactionMetrics = {
      averageSatisfaction: 0,
      trendDirection: 'stable' as 'improving' | 'stable' | 'declining',
      percentFollowedRecommendations: 0
    };
    
    // Check if we have reflection stats
    const reflectionStats = await getReflectionStats(userId);
    if (reflectionStats) {
      satisfactionMetrics.averageSatisfaction = reflectionStats.averageSatisfaction;
      satisfactionMetrics.trendDirection = reflectionStats.reflectionTrend;
    }
    
    // Check for followed recommendations in quick decisions
    const quickDecisionsWithFeedback = decisions.filter(
      d => d.type === 'quick' && 'userFeedback' in d && d.userFeedback?.followedRecommendation !== undefined
    );
    
    if (quickDecisionsWithFeedback.length > 0) {
      const followed = quickDecisionsWithFeedback.filter(
        // @ts-ignore - we know userFeedback exists because we filtered for it
        d => d.userFeedback.followedRecommendation
      ).length;
      
      satisfactionMetrics.percentFollowedRecommendations = (followed / quickDecisionsWithFeedback.length) * 100;
    }
    
    // Calculate streaks (consecutive days with decisions)
    const streaks = {
      currentStreak: 0,
      longestStreak: 0
    };
    
    if (decisions.length > 0) {
      // This is a simplified streak calculation
      // For a real app, you'd want a more sophisticated algorithm
      streaks.currentStreak = 1;
      streaks.longestStreak = 1;
    }
    
    // Create the dashboard stats object
    const stats: DashboardStats = {
      id: `${userId}_${timeRange}`,
      userId,
      timeRange,
      decisionCounts,
      timeMetrics,
      satisfactionMetrics,
      streaks,
      lastUpdated: new Date()
    };
    
    // Save to Firestore
    await setDoc(doc(db, DASHBOARD_STATS_COLLECTION, stats.id), {
      ...stats,
      lastUpdated: Timestamp.fromDate(stats.lastUpdated)
    });
    
    return stats;
  } catch (error) {
    console.error('Error generating dashboard stats:', error);
    throw error;
  }
};

/**
 * Get recent insights for a user
 */
export const getRecentInsights = async (userId: string, count: number = 5): Promise<DecisionInsight[]> => {
  try {
    const q = query(
      collection(db, DECISION_INSIGHTS_COLLECTION),
      where('userId', '==', userId),
      where('dismissed', '==', false),
      orderBy('importance', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    const insights: DecisionInsight[] = [];
    
    querySnapshot.forEach(doc => {
      insights.push(fromFirestore(doc.data()));
    });
    
    return insights;
  } catch (error) {
    console.error('Error getting recent insights:', error);
    throw error;
  }
};

/**
 * Create a new insight
 */
export const createInsight = async (
  userId: string,
  title: string,
  description: string,
  type: InsightType,
  importance: number,
  actionable: boolean,
  category?: DecisionCategory,
  relatedDecisions: string[] = [],
  data?: Record<string, any>
): Promise<DecisionInsight> => {
  try {
    const insight: DecisionInsight = {
      id: uuidv4(),
      userId,
      title,
      description,
      type,
      category,
      relatedDecisions,
      data,
      importance,
      actionable,
      createdAt: new Date(),
      viewed: false,
      dismissed: false
    };
    
    await setDoc(doc(db, DECISION_INSIGHTS_COLLECTION, insight.id), {
      ...insight,
      createdAt: Timestamp.fromDate(insight.createdAt)
    });
    
    return insight;
  } catch (error) {
    console.error('Error creating insight:', error);
    throw error;
  }
};

/**
 * Mark an insight as viewed
 */
export const markInsightViewed = async (insightId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, DECISION_INSIGHTS_COLLECTION, insightId), {
      viewed: true
    });
  } catch (error) {
    console.error('Error marking insight viewed:', error);
    throw error;
  }
};

/**
 * Dismiss an insight
 */
export const dismissInsight = async (insightId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, DECISION_INSIGHTS_COLLECTION, insightId), {
      dismissed: true
    });
  } catch (error) {
    console.error('Error dismissing insight:', error);
    throw error;
  }
};

/**
 * Log an activity
 */
export const logActivity = async (
  userId: string,
  actionType: ActivityActionType,
  decisionId?: string,
  details?: Record<string, any>
): Promise<ActivityLog> => {
  try {
    const activity: ActivityLog = {
      id: uuidv4(),
      userId,
      decisionId,
      actionType,
      timestamp: new Date(),
      details
    };
    
    await setDoc(doc(db, ACTIVITY_LOG_COLLECTION, activity.id), {
      ...activity,
      timestamp: Timestamp.fromDate(activity.timestamp)
    });
    
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

/**
 * Get recent activity logs for a user
 */
export const getRecentActivity = async (userId: string, count: number = 10): Promise<ActivityLog[]> => {
  try {
    const q = query(
      collection(db, ACTIVITY_LOG_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    const activities: ActivityLog[] = [];
    
    querySnapshot.forEach(doc => {
      activities.push(fromFirestore(doc.data()));
    });
    
    return activities;
  } catch (error) {
    console.error('Error getting recent activity:', error);
    throw error;
  }
};

/**
 * Helper function to filter items by time range
 */
function filterByTimeRange<T extends { createdAt: Date }>(items: T[], timeRange: 'all_time' | 'year' | 'month' | 'week' | 'day'): T[] {
  if (timeRange === 'all_time') {
    return items;
  }
  
  const now = new Date();
  const cutoff = new Date();
  
  switch (timeRange) {
    case 'day':
      cutoff.setDate(now.getDate() - 1);
      break;
    case 'week':
      cutoff.setDate(now.getDate() - 7);
      break;
    case 'month':
      cutoff.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      cutoff.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return items.filter(item => item.createdAt >= cutoff);
} 
